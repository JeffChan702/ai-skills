# ai-skills

> **Agent 是汽车，skill 就是老司机。**
> 车再好，没有会开的人，照样撞墙。

你有没有遇到过这几种情况？

- 让 AI 加个按钮，它确实加了——但点击报错，也没做权限控制
- 用户说某个业务不好用，还举了例子，但你无从查起
- 需求是实现了，但改的文件太多，一大半根本没必要动
- 你什么都没说，它顺手"优化"了一下，结果出问题了

这些都不是"AI 不够聪明"，是**它没有一套做事的方法**。

这里是我日常攒下来的 9 个 skill。它们不教 AI 变聪明，而是给它一套**可以检查的工作方式**——每个 skill 都能装进 AI，也都配了一篇讲清"它为什么存在"的文章。

## 一句话安装（复制给任意 AI）

```
请访问 https://github.com/JeffChan702/ai-skills

把这个仓库里所有 skill 装到我的 skills 目录（按我在用的工具选一个）：
- Cursor：~/.cursor/skills/
- Claude Code：~/.claude/skills/
- WorkBuddy：~/.workbuddy/skills/

每个 skill 建一个同名文件夹，把 SKILL.md 原样放进去。
装完对照每个 skill 自己的 README 里「怎么简单测试」那一节，真的跑一遍——
不要只看文件在不在。最后给我一张表：skill 名 / 装到哪 / 验证通过没 / 不通过的原因。
```

只想装一个？把「所有 skill」换成名字即可。

## 遇到什么情况，装哪个

| 你遇到的情况 | 用这个 |
|---|---|
| 它自己乱定东西、顺手改，结果改坏了 | [**evidence-first**](evidence-first/README.md) + [**blast-radius**](blast-radius/README.md) |
| 需求理解偏了，做完了才发现不对 | [**requirement-anchor**](requirement-anchor/README.md) |
| 出了问题，不知道该从哪查起 | [**three-cards**](three-cards/README.md) |
| 它说做完了，其实是半成品 | [**false-done**](false-done/README.md) |
| 长任务跑到一半开始忘事、会话崩掉 | [**context-guard**](context-guard/README.md) |
| 判断不了它到底做没做 | [**fake-success-guard**](fake-success-guard/README.md) |
| 邮件发出去排版全乱 | [**mail-html-lite**](mail-html-lite/README.md) |
| 想知道"到底该问 AI 什么" | [**trustworthy-ai**](trustworthy-ai/README.md) |

## 或者，按一件事的流程看

```
requirement-anchor → blast-radius → [写代码] → three-cards → mail-html-lite
   锁死需求边界       减小爆炸半径                 出问题排查      结论发出去
```

从"接需求"到"发结论"的完整一圈。最容易脱节的四件事——需求理解、动手方式、问题排查、结论汇报——各自有一个 skill 接住。

而 [**trustworthy-ai**](trustworthy-ai/README.md) 是横向的总纲：**可信任不是"它说得对"，而是"它说的每句话都能被查"**，里面那四个问题不装任何东西也能直接拿去用。

## 每个 skill 长什么样

每个目录下两份文件：

- **`SKILL.md`** — 可以直接装进 AI 的规则
- **`README.md`** — 讲清它解决什么、怎么装、**怎么用一句话验证它装对了**

零依赖。复制过去就能用，不用装任何东西，不用改配置。

## 许可

MIT
