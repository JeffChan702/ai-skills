# ai-skills

我把日常在用的 AI Agent 技能抽出来分享。

不过说实话，**我想提供的不是工具，是思想**——每个 skill 背后都有一个能独立成立的主张（"任何需求都是增删查改的变体""没依据的决定不许做""产出存在不等于达标"）。skill 只是这些主张的一个可执行外壳。所以每个 skill 都配了一篇讲清"它为什么存在"的文章。

**目前 5 个，全部零依赖**，复制过去就能用，不用装任何东西。

## 一句话安装（复制给任意 AI）

把下面这段发给你在用的 AI（Cursor / Claude Code / WorkBuddy 都行），它会自己读完仓库、装到正确位置、并**实际验证一遍**：

```
请访问 https://github.com/JeffChan702/ai-skills

任务：把这个仓库里的所有 skill 安装到我的 skills 目录。

1. 先判断我在用哪个工具，对应目录是：
   - Cursor：~/.cursor/skills/
   - Claude Code：~/.claude/skills/
   - WorkBuddy：~/.workbuddy/skills/
2. 每个 skill 建一个同名文件夹，把它的 SKILL.md 原样放进去（不要改内容）。
   fake-success-guard 是个 JS 模块，直接把整个目录放进去即可。
3. 装完以后，对照每个 skill 自己的 README 里「怎么简单测试」那一节，
   逐条真的跑一遍验证，不要只看文件在不在。
4. 最后给我一张表：skill 名 / 装到哪 / 验证是否通过 / 不通过的具体原因。
```

只想装某一个？把「所有 skill」换成名字就行，比如：

```
请访问 https://github.com/JeffChan702/ai-skills
把 three-cards 这个 skill 装到我的 skills 目录，并按它 README 里的「怎么简单测试」验证一遍。
```

## 一览

| skill | 一句话作用 | 详细说明 |
|---|---|---|
| **evidence-first** | AI 协作的证据纪律：没依据的决定不许做 | [README](evidence-first/README.md) |
| **requirement-anchor** | 把一段需求锚定成 12 格矩阵，锁死边界再动手 | [README](requirement-anchor/README.md) |
| **three-cards** | 把任何故障拆成三道填空题，前两张卡不需要懂原理 | [README](three-cards/README.md) |
| **mail-html-lite** | 邮件正文的轻量 HTML 排版，段落不挤、标题分得清 | [README](mail-html-lite/README.md) |
| **fake-success-guard** | 判断一次 LLM / 工具调用是真成功还是「假成功」 | [README](fake-success-guard/README.md) |

## 哪些能串起来用

### 组合 A：一个需求的完整闭环

```
requirement-anchor  →  [写代码]  →  three-cards  →  mail-html-lite
    锁死需求边界                       出问题排查         结论发出去
```

1. **requirement-anchor** 先把需求拆成 12 格：产品层 / 数据层 / 展示层 × 增删查改。每格必须带证据和**验收判定**，🟡🔴 的格子明确标出来——那些就是后面最可能返工的地方
2. 照着矩阵写代码
3. 做完发现不对，用 **three-cards** 把模糊现象结构化：发生了什么（动作 → 结果）、发生在哪、为什么
4. 排查结论用 **mail-html-lite** 排成一封能直接发出去的邮件

这条链覆盖「一个需求从进来到收尾」的全过程——**最容易脱节的三件事（需求理解、问题排查、结论汇报）被接成了一条线。**

### 横切在上面所有环节之上的：evidence-first

```
evidence-first  ━━━━━━━━━━━━━━━━━━━━━━┓
requirement-anchor → 写代码 → three-cards → mail-html-lite
```

**evidence-first** 不参与串联，它是**横向约束**——锚定需求时不许编格子，排查时不许编原因，任何时候都不许用"看起来合理"替代"有依据"。如果你只装一个，我建议是它。

### 组合 B：给 Agent 加一道「假成功」护栏（独立使用）

```
LLM / 工具调用  →  fake-success-guard  →  采信 or 重试
```

**fake-success-guard** 不依赖其他 skill，直接接在任意调用之后，拦住「返回 200、文字通顺、但什么都没干」的情况。它本身是个普通的 JS 模块，你也可以只拿它当代码用，不装 skill。

## 怎么装（手动）

每个 skill 目录下都有一份 `SKILL.md`。在对应平台的 skills 目录下建一个**同名文件夹**，把 `SKILL.md` 放进去即可：

| 工具 | skills 目录 |
|---|---|
| Cursor | `~/.cursor/skills/` |
| Claude Code | `~/.claude/skills/` |
| WorkBuddy | `~/.workbuddy/skills/` |

**每个 skill 的详细作用、安装路径、验证方法、设计取舍和边界，都写在它自己的 README 里**——点上面表格里的链接进去看。

## 许可

MIT
