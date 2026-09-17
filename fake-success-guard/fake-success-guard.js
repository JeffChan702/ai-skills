/**
 * fake-success-guard —— 判断一次 LLM / 工具调用的返回，到底是「真拿到结果」还是「假成功」
 *
 * 为什么需要它：
 *   模型在没拿到你给它的输入时不会报错，它会顺着上下文编一个答案。
 *   HTTP 200 + 一段通顺的文字，完全可能什么都没干。
 *   这类失败不抛异常，只会静默污染你的数据 —— 等你发现时，已经错了几百条。
 *
 * 零依赖，Node 与浏览器均可直接用。
 *
 * 用法：
 *   const { check } = require('./fake-success-guard');
 *   const r = check(modelOutput, { expect: [/设备号/, /\b\d{7}\b/] });
 *   if (!r.ok) {
 *     console.warn('假成功：', r.reason, r.detail);
 *     // 重试、换模型，或者把这条结果标记为「不确定」，不要直接采信
 *   }
 *
 * 返回：
 *   { ok: boolean, reason: string, detail: object }
 *   reason 取值：ok | empty | denial-input | denial | blind | pleasantry | missing-anchor
 *
 * 判定顺序很关键（见文件末注释）。
 */
'use strict';

// 规则 1：模型在说「我没拿到输入」。指向输入本身缺失，可信度最高。
// 注意模式要指向「输入」，否则会误伤「该用户未提供手机号」这类正常叙述。
const DENIAL_INPUT = [
  /未(提供|收到|检测到|包含|附带|获取到)(任何)?(图像|图片|截图|附件|文件|内容|文本|数据|输入)/,
  /(无法|不能|没有)(看到|查看到|识别|读取|访问|获取)(任何)?(图像|图片|截图|附件|内容|数据)/,
  /(输入|内容|图像|图片|附件)(数据)?(为|是)空/,
  /没有(收到|拿到|看到)(任何)?(内容|图像|图片|数据)/,
];

// 规则 2：泛化的感知失败。只在拿不到期望字段时才需要警惕，故判定优先级低于「期望字段命中」。
const DENIAL_WEAK = [
  /(我|本人)?(没有|未|无法|不能)(看到|识别|读取|获取|辨识)/,
  /(图片|图像|截图|附件|画面)[^。\n]{0,6}(模糊|不清晰|无法辨认|看不清)/,
];

// 规则 3：盲答特征词 —— 短、回避、反复说看不清
const BLIND = ['看不清', '不清楚', '无法辨认', '难以辨认', '模糊不清'];

// 规则 4：只有客套、没有实质
const PLEASANTRIES = ['好的', '收到', '已了解', '明白了', '请稍等'];

function isRe(v) {
  return v instanceof RegExp;
}

function countWords(text, words) {
  const hits = [];
  let n = 0;
  for (const w of words) {
    const c = text.split(w).length - 1;
    if (c > 0) {
      n += c;
      hits.push(w);
    }
  }
  return { n, hits };
}

function matchCount(text, patterns) {
  let n = 0;
  const hits = [];
  for (const p of patterns) {
    if (isRe(p)) {
      const flags = p.flags.indexOf('g') === -1 ? p.flags + 'g' : p.flags;
      const m = text.match(new RegExp(p.source, flags));
      if (m) {
        n += m.length;
        hits.push(p.source);
      }
    } else if (text.indexOf(String(p)) !== -1) {
      n += 1;
      hits.push(String(p));
    }
  }
  return { n, hits };
}

function anyRe(text, patterns) {
  const hits = [];
  for (const p of patterns) {
    if (p.test(text)) hits.push(p.source);
  }
  return hits;
}

/**
 * @param {string} output  模型 / 工具的返回文本
 * @param {object} [opts]
 * @param {Array<RegExp|string>} [opts.expect]  期望必须出现的关键字段（锚点），如 [/型号/, /\d{7}/]
 * @param {number} [opts.minLength=300]         短于这个长度才可能被判为盲答
 * @param {number} [opts.blindThreshold=3]      盲答词出现几次才算盲答
 * @param {boolean} [opts.strict]               为 true 时，即使锚点命中也要继续跑否认检查
 */
function check(output, opts) {
  const o = opts || {};
  const expect = o.expect || [];
  const minLength = o.minLength == null ? 300 : o.minLength;
  const blindThreshold = o.blindThreshold == null ? 3 : o.blindThreshold;
  const text = String(output == null ? '' : output).trim();

  if (!text) return { ok: false, reason: 'empty', detail: { length: 0 } };

  // 第一步：输入缺失是硬证据，优先级高于锚点。
  // 否则会掉进这个坑 —— 模型说「未提供图像数据…型号：看不清」，
  // 你拿 /型号/ 去匹配，反而匹配上它自己写的那句谎话，于是放行。
  const inputDenial = anyRe(text, DENIAL_INPUT);
  if (inputDenial.length) {
    return { ok: false, reason: 'denial-input', detail: { patterns: inputDenial } };
  }

  const anchor = matchCount(text, expect);
  const hasAnchor = anchor.n > 0;

  // 第二步：锚点命中即通过（strict 模式除外）。
  // 正常结果里也可能叙述「该用户未提供手机号」，所以不能一见到否认词就判失败。
  if (hasAnchor && o.strict !== true) {
    return { ok: true, reason: 'ok', detail: { length: text.length, anchor: anchor.hits } };
  }

  // 第三步：泛化否认
  const weakDenial = anyRe(text, DENIAL_WEAK);
  if (weakDenial.length) {
    return { ok: false, reason: 'denial', detail: { patterns: weakDenial } };
  }

  // 第四步：短 + 反复说看不清 = 盲答
  const blind = countWords(text, BLIND);
  if (text.length < minLength && blind.n >= blindThreshold) {
    return { ok: false, reason: 'blind', detail: { length: text.length, words: blind.hits } };
  }

  // 第五步：只有客套
  const pleasant = countWords(text, PLEASANTRIES);
  if (text.length < 30 && pleasant.n > 0) {
    return { ok: false, reason: 'pleasantry', detail: { length: text.length } };
  }

  // 第六步：声明了要锚点却一个都没出现
  if (expect.length && !hasAnchor) {
    return { ok: false, reason: 'missing-anchor', detail: { expect: expect.map(String) } };
  }

  return { ok: true, reason: 'ok', detail: { length: text.length } };
}

// ——————————————————————————————————————————————
// 内置回归样本。改任何规则或词表之前，先跑一遍：
//   node fake-success-guard.js
// 最后两条是「防误伤」样本，别删 —— 它们保证这套判定不是一个脆弱的敏感词匹配。
// ——————————————————————————————————————————————
const SAMPLES = [
  {
    name: '正常返回，含期望字段',
    text: '设备信息：型号 A1，系统版本 13，设备号 8661234，客户端版本 1.2.3（v45）',
    expect: [/设备号/, /\d{7}/],
    want: 'ok',
  },
  {
    name: '空返回',
    text: '   ',
    expect: [],
    want: 'empty',
  },
  {
    name: '真实失败案例：说没收到图，却顺手提了个字段名',
    text: '由于您未提供任何图像数据，我无法完成识别。型号：看不清，版本号：看不清。',
    expect: [/型号/, /版本号/],
    want: 'denial-input',
  },
  {
    name: '短盲答：反复说看不清',
    text: '看不清，看不清，这里也看不清。',
    expect: [/设备号/],
    want: 'blind',
  },
  {
    name: '泛化否认：明说自己识别不了',
    text: '我无法识别这张图片里的文字，看不清具体内容。',
    expect: [/设备号/],
    want: 'denial',
  },
  {
    name: '只有客套话',
    text: '好的，收到',
    expect: [],
    want: 'pleasantry',
  },
  {
    name: '声明了锚点却一个都没出现',
    text: '这是一段没有任何关键字段的正常描述文字。',
    expect: [/设备号/],
    want: 'missing-anchor',
  },
  {
    name: '防误伤：正常叙述里出现「未提供」不算失败',
    text: '该订单未提供手机号，因此无法发送短信通知。请先补充联系方式后再重试。',
    expect: [],
    want: 'ok',
  },
  {
    name: '防误伤：长文本里出现「无法识别」但锚点已命中',
    text: '识别结果如下：设备号 8661234。备注：图片右下方有一处无法识别的细小文字，已忽略。',
    expect: [/设备号/],
    want: 'ok',
  },
];

function selfTest(verbose) {
  const results = SAMPLES.map(function (s) {
    const opts = Object.assign({ expect: s.expect }, s.opts || {});
    const r = check(s.text, opts);
    return { name: s.name, want: s.want, got: r.reason, pass: r.reason === s.want };
  });
  const failed = results.filter(function (r) {
    return !r.pass;
  });
  if (verbose !== false) {
    results.forEach(function (r) {
      console.log(
        (r.pass ? 'PASS  ' : 'FAIL  ') + r.name + '   期望=' + r.want + ' 实际=' + r.got
      );
    });
    console.log('\n' + (results.length - failed.length) + '/' + results.length + ' 通过');
  }
  return failed.length === 0;
}

if (typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module) {
  process.exit(selfTest() ? 0 : 1);
}

module.exports = {
  check: check,
  selfTest: selfTest,
  SAMPLES: SAMPLES,
  DENIAL_INPUT: DENIAL_INPUT,
  DENIAL_WEAK: DENIAL_WEAK,
  BLIND: BLIND,
  PLEASANTRIES: PLEASANTRIES,
};

/**
 * 判定顺序为什么是这样（别随手改）：
 *
 * 1. empty
 * 2. denial-input  ← 必须排在锚点之前。反例见 SAMPLES 第 3 条：
 *                    模型一边说没收到图，一边写下「型号：看不清」，
 *                    如果你先查锚点，反而被它编的字段名骗过去。
 * 3. 锚点命中 → 通过
 * 4. denial（泛化）
 * 5. blind
 * 6. pleasantry
 * 7. missing-anchor
 * 8. ok
 *
 * 每一步都对应一个真实踩过的坑，改动请连带补样本。
 */
