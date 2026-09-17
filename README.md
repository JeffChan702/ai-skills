# ai-skills

我在用的 AI Agent 技能包，把其中通用的那部分抽出来对外分享。

**目前 3 个，全部零依赖**——把对应的 `SKILL.md` 复制到你的 skills 目录就能用，不用装任何东西，不用改配置。

## 一览

| skill | 一句话作用 | 详细说明 |
|---|---|---|
| **three-cards** | 把任何故障拆成三道填空题，前两张卡不需要懂原理 | [README](three-cards/README.md) |
| **mail-html-lite** | 邮件正文的轻量 HTML 排版，段落不挤、标题分得清 | [README](mail-html-lite/README.md) |
| **fake-success-guard** | 判断一次 LLM / 工具调用是真成功还是「假成功」 | [README](fake-success-guard/README.md) |

## 哪些能串起来用

### 组合 A：把一个模糊的问题，变成一封能发出去的结论信

```
three-cards  →  mail-html-lite
（结构化排查）     （排版成邮件）
```

1. **three-cards** 先把「XX 坏了」这种一句话描述，逼成三张卡：发生了什么（动作 → 结果）、发生在哪、为什么
2. 拿到结论后，**mail-html-lite** 把它排成一封段落清楚、复制即用的邮件

这条链覆盖的是「从一句模糊反馈，到一封能发出去的排查结论」的完整过程——**排查和汇报这两件最容易脱节的事，被接在了一起**。

### 组合 B：给 Agent 加一道「假成功」护栏（独立使用）

```
LLM / 工具调用  →  fake-success-guard  →  采信 or 重试
```

**fake-success-guard** 不依赖其他 skill，直接接在任意调用之后，拦住「返回 200、文字通顺、但什么都没干」的情况。它本身是个普通的 JS 模块，你也可以只拿它当代码用，不装 skill。

## 怎么装

每个 skill 目录下都有一份 `SKILL.md`。在对应平台的 skills 目录下建一个**同名文件夹**，把 `SKILL.md` 放进去即可：

| 工具 | skills 目录 |
|---|---|
| Cursor | `~/.cursor/skills/` |
| Claude Code | `~/.claude/skills/` |
| WorkBuddy | `~/.workbuddy/skills/` |

例如 `three-cards` → 复制到 `~/.cursor/skills/three-cards/SKILL.md`。

**每个 skill 的详细作用、安装路径、验证方法（一句话测通）、设计取舍和边界，都写在它自己的 README 里**——点上面表格里的链接进去看。

## 许可

MIT
