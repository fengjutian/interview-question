
---
title: React Hooks 闭包问题 详解
category: React
tags: [React, Hooks, 闭包问题]
description: React Hooks 闭包问题的详细解释，包括原因、解决方法和注意事项
date: 2026-02-10
---


## 一、先一句话把本质说死（面试必背）

> **Hooks 中的闭包问题，本质是：函数捕获的是“创建时那次 render 的变量快照”，不是最新 state。**

这句话一出，面试官基本就不追了 👍

---

## 二、最经典的闭包坑（必会）

### 1️⃣ setInterval / setTimeout 拿到旧 state

❌ 错误示例

```js
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setInterval(() => {
      console.log(count)
      setCount(count + 1)
    }, 1000)
  }, [])
}
```

**现象**

* `count` 永远是 0
* 每秒 set 的都是 `0 + 1`

**原因**

* effect 只执行一次
* 回调闭包捕获了第一次 render 的 `count`

---

### ✔ 解法一：函数式 setState（最推荐）

```js
setCount(c => c + 1)
```

**为什么能解决？**

> React 在执行更新时传入的是“最新 state”，绕过闭包。

---

### ✔ 解法二：useRef 存最新值

```js
const countRef = useRef(count)

useEffect(() => {
  countRef.current = count
})

useEffect(() => {
  setInterval(() => {
    setCount(countRef.current + 1)
  }, 1000)
}, [])
```

---

## 三、useEffect 依赖遗漏 = 闭包 bug

### 2️⃣ effect 里用到变量，却不写依赖

```js
useEffect(() => {
  doSomething(id)
}, []) // ❌
```

**解释模板**

> effect 中引用的变量来自闭包，依赖数组必须显式声明。

✔ 正确：

```js
useEffect(() => {
  doSomething(id)
}, [id])
```

---

## 四、useCallback 的“假缓存”问题

### 3️⃣ useCallback 依赖写错

❌

```js
const handleClick = useCallback(() => {
  console.log(count)
}, [])
```

**现象**

* 点击永远打印初始 count

**原因**

> useCallback 缓存的是函数 + 它的闭包

✔ 正确：

```js
const handleClick = useCallback(() => {
  console.log(count)
}, [count])
```

---

## 五、事件监听的隐形闭包（高频）

### 4️⃣ addEventListener

```js
useEffect(() => {
  window.addEventListener('resize', () => {
    console.log(width)
  })
}, [])
```

**坑点**

* resize 打印的 width 永远是初始值

✔ 解法（推荐版）：

```js
const widthRef = useRef(width)
useEffect(() => {
  widthRef.current = width
})

useEffect(() => {
  const handler = () => {
    console.log(widthRef.current)
  }
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

---

## 六、为什么 React 不“自动”帮你解决闭包？

**这是面试官很喜欢的追问**

标准回答：

> React 不能破坏 JS 闭包语义，
> Hooks 设计是显式依赖，而不是隐式魔法。

---

## 七、React 是怎么“检测”你可能写错的？

> **eslint-plugin-react-hooks**

* exhaustive-deps
* 提示你遗漏依赖
* 本质是在防闭包 bug

---

## 八、什么时候该用哪种方案？

| 场景            | 推荐方案         |
| ------------- | ------------ |
| 定时器           | 函数式 setState |
| 事件监听          | useRef       |
| 依赖变化触发 effect | 写依赖          |
| 回调传给子组件       | useCallback  |

---

## 九、终极压轴 3 句（闭包杀手锏）

1. **“Hooks 的闭包不是 bug，是 JS 特性”**
2. **“依赖数组是告诉 React：哪些值参与了闭包”**
3. **“函数式更新是绕开闭包最稳的方式”**

---

## 十、面试官最后一刀（你这样回）

**Q：你在项目中是怎么避免闭包问题的？**

> 我严格开启 exhaustive-deps，
> 定时器和异步场景优先用函数式 setState，
> 事件监听用 ref 保存最新值。

---

如果你愿意，我可以下一步直接给你：

* 👔 **闭包专项模拟面试（连续追问）**
* 🧠 **React 源码角度解释闭包**
* 🧪 **真实 bug 复盘（线上事故级）**
* 🧩 **一眼看穿闭包 bug 的 checklist**

要不要直接来一轮 **闭包专项面试模拟**？
