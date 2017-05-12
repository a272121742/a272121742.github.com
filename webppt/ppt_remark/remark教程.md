class: center, middle

# remark教程

---

## 使用remark


```js
<script src="https://remarkjs.com/downloads/remark-latest.min.js">
```

---

## 布局

```md
class : 布局参数, 布局参数
```

水平布局参数：

- left（默认值）
- center
- right

垂直布局参数

- top（默认值）
- middle
- bottom

---

## 位置

```md
.位置参数[文本]
```

`.left[居左]` .left[居左]

`.left[居左]` .center[居中]

`.left[居左]` .right[居右]

---

## 图片


---

## 背景

---

## 语法

```md
--- 翻页
-- 增加内容
```

```md
???
笔记内容（不会显示在幻灯片中，但会显示在笔记中）
```

---

## 幻灯片属性

```md
name: 幻灯片命名（用于链接）
```

```md
class: 布局参数, 布局参数
```

```md
background-image: url(背景图片链接地址)
background-position: 位置参数
background-repeat: 是否重复
background-size: 尺寸参数
```

---

count: false

## 幻灯片属性

```md
count: 是否计数
```

```md
template: 模版名称（将其他做好的幻灯片作为模版追加内容显示）
```

---

layout: true

## 幻灯片属性

---

### layout

```md
layout: true (上个幻灯片的标题将被用作本幻灯片的标题)
```

---

### layout

### exclude

```md
exclude: true (本幻灯片直接跳过不显示)
```

---

exclude: true

这个不会被显示的

---
layout: false

## 样式类

```md
.footnote[.red.bold[内容文本1] 内容文本2]
```

会被渲染成

```html
<span class="footnote">
  <span class="red bold">内容文本1</span> 文本内容2
</span>
```

---

## 样式类

中括号换行可以使得`span`标签渲染成`div`

```md
.footnote[.red.bold[内容文本1] 
内容文本2]
.footnote[.red.bold[
内容文本1] 
内容文本2]
```

会被渲染成

```html
<div class="footnote">
  <span class="red bold">内容文本1</span> 文本内容2
</div>
<div class="footnote">
  <div class="red bold">内容文本1</div> 文本内容2
</div>
```

---

class: center, middle

# 如果你想输出Marddown特殊标记
# 请使用HTML转义符

---


## 语法高亮

```js
function add(a, b){
  return a + b;
}
```

```js
function add(a, b){
*  return a + b;
}
```

---

## 演示模式

c - 创建相同窗口，两个窗口共享事件

f - 演示模式

p - 演讲稿模式

---

## 快捷键

h／？ - 打开帮助

j    - 下一页

k    - 上一页

b    - 黑屏模式

m    - 镜像模式

t    - 复位计时器

