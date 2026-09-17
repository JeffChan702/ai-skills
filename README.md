# ai-skills

我自己在用的 AI Agent 技能包，把其中通用的部分抽出来，做成可以直接安装的形式。

不需要装依赖，不需要改配置——把对应的 `SKILL.md` 复制到你的 skills 目录就行。

---

## three-cards · 三卡排查法

把任何故障拆成三道填空题：

| 卡 | 回答什么 |
|---|---|
| 卡一 · 问题模型 | 发生了什么？（动作 → 结果） |
| 卡二 · 环境与主体 | 发生在哪、在谁身上？ |
| 卡三 · 机制与证据 | 为什么？（候选原因 + 支持证据 + 反证） |

**前两张卡不需要懂任何内部原理**，只要把话说清楚、把边界定清楚。

### 安装

把 `three-cards/SKILL.md` 复制到你的 skills 目录：

| 你在用的工具 | 目标路径 |
|---|---|
| Cursor | `~/.cursor/skills/three-cards/SKILL.md` |
| Claude Code | `~/.claude/skills/three-cards/SKILL.md` |
| WorkBuddy | `~/.workbuddy/skills/three-cards/SKILL.md` |

### 验证装好了没

重启工具，发这句：

```
用三卡排查：我的部署脚本今天开始报 permission denied
```

**通过标准**：它先反问你「执行了什么命令、预期什么、实际报什么错」，而不是直接甩给你一堆可能原因。

如果它一上来就列了十条猜测，只有两种可能：目录名或文件名不对，或者工具没重启。

### 排查时配合项目路径用（推荐）

```
用三卡排查这个问题：<一句话描述现象>

我的项目路径（卡三要读代码，可以填多个）：
- D:\code\my-app
- D:\code\my-shared-lib

要求：
1. 卡三的候选原因，要落到上面的代码里找支持证据和反证，不要凭空推断。
2. 读不到路径就直接告诉我，别猜。
3. 一次只问一张卡，卡一卡二填完再进卡三。
```

不给项目路径的话，卡三很容易退化成「猜」——允许 AI 读代码，才叫「带着假设去找证据」。

---

## fake-success-guard · LLM「假成功」检测

判断一次 LLM / 工具调用的返回，到底是真拿到了结果，还是「假成功」——模型没拿到你给它的输入时不会报错，它会顺着上下文编一个答案，静默污染你的数据。

零依赖，Node 与浏览器通用。

```js
const { check } = require('./fake-success-guard');

const r = check(modelOutput, { expect: [/型号/, /\d{7}/] });
if (!r.ok) {
  console.warn('假成功：', r.reason, r.detail);
  // 重试 / 换模型 / 标记为「不确定」，就是不要直接采信
}
```

`reason` 是可读的失败类型：`denial-input` / `denial` / `blind` / `pleasantry` / `missing-anchor`。

**自带 9 条回归样本，改动规则前先跑：**

```bash
node fake-success-guard/fake-success-guard.js
```

里面包含 2 条防误伤样本，专门保证这套判定不是一个脆弱的敏感词匹配，别删。

---

## 许可

MIT
