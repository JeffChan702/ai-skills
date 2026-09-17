---
name: mail-html-lite
description: >-
  生成或整理邮件正文的 HTML：轻量排版，段落不挤、标题分得清、复制粘贴也快。
  不做花哨视觉，不加 CSS 框架，不写脚本。
  触发：邮件美化、HTML 邮件、邮件排版、HTML 正文、段落间距、mail-html-lite。
---

# mail-html-lite — 轻量邮件 HTML

发信前把正文收成**统一、好读、少代码**的 HTML。不做花哨视觉；目标是段落不挤、标题分得清、复制粘贴也快。

## 何时用

- 上游 skill / 脚本已经写好正文，需要一个统一的外壳
- 现有 HTML 段落挤在一起、标题糊成一团

## 原则（硬）

1. **快**：直接套下方壳子，改标题与各节内容即可。
2. **少**：禁止额外 CSS 框架、渐变、卡片阴影、多栏布局、图标字体。
3. **清**：每节一个 `h3` + 若干 `p`/`ul`/`ol`/`table`；相邻块之间靠壳子里的 margin，不要手写一堆内联 margin。
4. **保真**：调用方规定的必有章节**不得删减**；本 skill 只包一层样式，不改内容。
5. **人话**：排版时**不改写**语义。正文里若还带着黑话或内部流程词，退回去让作者改，别替他改。
6. **复用优先**：同一轮已经生成过邮件 HTML，又要一份内容相同的独立 HTML 时，直接复制那份并改名；不要重新拼装、重新渲染。

## 标准壳（复制即用）

把 `{标题}` 和 `<!-- sections -->` 换成实际内容。节内只用语义标签，**尽量少写 style**。

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{标题}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<div style="max-width:720px;margin:16px auto;padding:20px 24px;background:#fff;border:1px solid #e5e5e5;font-family:Segoe UI,Microsoft YaHei,sans-serif;font-size:14px;line-height:1.6;color:#222;">
  <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;">{标题}</h2>
  <p style="margin:0 0 20px;color:#666;font-size:13px;">{副标题一行，如时间/状态}</p>

  <!-- 每一节：h3 + 内容；不要把多节塞进同一个 p -->
  <h3 style="margin:20px 0 8px;font-size:15px;font-weight:600;border-bottom:1px solid #eee;padding-bottom:4px;">1. 节标题</h3>
  <p style="margin:0 0 10px;">段落……</p>
  <ul style="margin:0 0 10px;padding-left:20px;">
    <li style="margin:0 0 4px;">条目</li>
  </ul>

  <p style="margin:24px 0 0;color:#888;font-size:12px;">页脚说明（可选）</p>
</div>
</body></html>
```

## 表格（可选）

```html
<table style="border-collapse:collapse;width:100%;margin:0 0 10px;font-size:13px;">
  <tr>
    <th style="border:1px solid #ddd;padding:6px 8px;background:#fafafa;text-align:left;">列</th>
    <th style="border:1px solid #ddd;padding:6px 8px;background:#fafafa;text-align:left;">值</th>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:6px 8px;">…</td>
    <td style="border:1px solid #ddd;padding:6px 8px;">…</td>
  </tr>
</table>
```

## 代码 / 路径块（可选）

```html
<pre style="margin:0 0 10px;padding:10px 12px;background:#f6f8fa;border:1px solid #eee;white-space:pre-wrap;font-size:12px;">原文或路径</pre>
```

## 自检（发信前 5 秒）

- [ ] 用了标准壳，未另起花哨主题
- [ ] 每个大节有独立 `h3`，节与节不粘连
- [ ] 调用方要求的必备章节一个没少
- [ ] 宽度还是 720px 左右——超了在手机端会横向滚动

## 禁止

- 紫渐变、大圆角卡片、徽章贴纸、多色标签墙
- 为「好看」加长脚本或生成器（本 skill **无脚本**）
- 改写调用方的结论语义
