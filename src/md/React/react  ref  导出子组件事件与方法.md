---
title: React ref 导出子组件事件与方法 详解
category: React
tags: [React, ref, 导出子组件方法]
description: React ref 导出子组件事件与方法的详细解释，包括原因、解决方法和注意事项
date: 2026-02-10
---

# 一、为什么要用 ref 导出子组件方法？

React 是**单向数据流**：

* 父 👉 子：props
* 子 ❌ 父：不能直接暴露方法

但有些场景 **必须父调子**：

* 表单 `submit / reset`
* 弹窗 `open / close`
* 播放器 `play / pause`
* input `focus`

👉 这时候就用：
**`forwardRef + useImperativeHandle`**

---

# 二、标准写法（面试必写）

## 1️⃣ 子组件：暴露方法

```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

const Child = forwardRef((props, ref) => {
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus()
    },
    clear() {
      inputRef.current.value = ''
    },
  }))

  return <input ref={inputRef} />
})

export default Child
```

---

## 2️⃣ 父组件：调用子方法

```jsx
function Parent() {
  const childRef = useRef()

  return (
    <>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.focus()}>
        聚焦
      </button>
    </>
  )
}
```

✅ **这就是官方推荐方式**

---

# 三、为什么不能直接把 ref 传进去？

❌ 错误认知：

```jsx
function Child({ ref }) {}
```

**原因**：

* `ref` 是 React 保留属性
* 普通函数组件拿不到 ref

✔ 必须用：

```js
forwardRef((props, ref) => {})
```

---

# 四、useImperativeHandle 是干嘛的？（重点）

### 没用它会怎样？

```js
ref.current === 子组件实例 / DOM
```

### 用了之后：

```js
ref.current === 你“手动暴露”的对象
```

👉 **等于给子组件定义了一个“对外 API”**

---

## 面试一句话解释（背）

> `useImperativeHandle` 用来**控制 ref 暴露给父组件的内容**，避免父组件直接操作内部实现。

---

# 五、常见错误 & 坑（必问）

## 1️⃣ 暴露太多内部实现（反模式）

❌

```js
useImperativeHandle(ref, () => ({
  inputRef,
  state,
  props,
}))
```

✔

```js
useImperativeHandle(ref, () => ({
  focus,
  reset,
}))
```

👉 **只暴露行为，不暴露结构**

---

## 2️⃣ 忘了 forwardRef（100% 报错）

```txt
Function components cannot be given refs
```

---

## 3️⃣ 每次 render 都生成新方法

```js
useImperativeHandle(ref, () => ({
  focus: () => {}
}))
```

一般没问题
**但重性能场景**可以：

```js
useImperativeHandle(ref, () => ({ focus }), [])
```

---

## 4️⃣ ref.current 为空？

* 组件还没 mount
* 条件渲染
* StrictMode 双渲染（dev）

✔ 保险写法：

```js
childRef.current?.focus()
```

---

# 六、ref vs props 回调（面试对比）

| 方式               | 适合场景      |
| ---------------- | --------- |
| props 回调         | 状态 / 事件通知 |
| ref + imperative | 命令式控制     |

**面试标准句**：

> ref 是 escape hatch，不是常规通信手段。

---

# 七、Class 组件 vs Hooks（加分）

### Class 组件：

```js
class Child extends React.Component {
  focus() {}
}
```

```js
childRef.current.focus()
```

👉 Hooks 等价方案就是：
**forwardRef + useImperativeHandle**

---

# 八、真实项目例子（很加分）

### 表单组件

```js
useImperativeHandle(ref, () => ({
  submit: () => form.submit(),
  reset: () => form.resetFields(),
}))
```

### 弹窗组件

```js
useImperativeHandle(ref, () => ({
  open,
  close,
}))
```

---

# 九、终极面试回答模板（直接背）

> 父组件如果需要调用子组件方法，在函数组件中必须通过
> `forwardRef` 接收 ref，
> 再用 `useImperativeHandle` 显式暴露对外 API，
> 避免父组件直接操作子组件内部状态或 DOM。

---

如果你想 **再进阶一层**，我还能帮你：

* 🔥 ref + forwardRef 的源码调用链
* 🧠 为什么 React 不推荐大量使用 ref
* 🧪 StrictMode 下 ref 行为
* 🧩 用 ref 封装一个可控 Modal / Form 组件

你是准备 **面试冲刺**，还是想看一个 **完整业务级封装示例**？
