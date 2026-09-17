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

## 怎么用

把这个链接丢给你的 AI Agent：

```
https://github.com/JeffChan702/ai-skills
```

它会自己读完、把 skill 装上。然后**新开一个窗口**，把你要做的事直接说给它——它会自己找到该用的 skill，不用你指定，也不用写什么约束。

（想手动装也行：把对应目录下的 `SKILL.md` 复制到你的 skills 目录。）

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

每个 skill 目录下两份文件：`SKILL.md`（装进 AI 的规则）+ `README.md`（解决什么、怎么装、**怎么用一句话验证**）。零依赖，复制就能用。

## 许可

MIT
