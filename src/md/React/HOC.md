---
title: 高阶组件（HOC）
tags: [React, HOC, 组件]
description: 关于 React 高阶组件（HOC）的详细介绍，包括定义、用途和实现方法
date: 2026-02-08
category: React
---

## 一、HOC 是什么？

**HOC（Higher-Order Component，高阶组件）**

> 👉 **接收一个组件，返回一个新组件的函数**

```js
const EnhancedComponent = hoc(WrappedComponent);
```

本质：

* **函数**
* 参数：组件
* 返回值：新组件

---

## 二、最简单的 HOC 示例

```js
function withLoading(WrappedComponent) {
  return function Enhanced(props) {
    if (props.loading) {
      return <div>loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}
```

使用：

```js
const UserListWithLoading = withLoading(UserList);
```

---

## 三、HOC 解决什么问题？

### 1️⃣ 逻辑复用（最核心）

以前 class 时代：

* 复用生命周期
* 复用状态
* 复用副作用

👉 HOC 把**公共逻辑抽到组件外**

---

### 2️⃣ 横切关注点（cross-cutting concerns）

典型场景：

* 权限控制
* 埋点
* 登录校验
* 错误边界
* 主题注入
* loading / empty 处理

---

## 四、一个真实点的 HOC：权限控制

```js
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    if (!props.user) {
      return <Redirect to="/login" />;
    }
    return <WrappedComponent {...props} />;
  };
}
```

---

## 五、HOC 的核心特点（面试必说）

### ✅ 优点

* 逻辑复用清晰
* 不侵入原组件
* 适合 class 组件时代

### ❌ 缺点（重点）

1. **嵌套地狱**

```js
withA(withB(withC(Component)))
```

2. **props 冲突**

```js
props.user  被覆盖？
```

3. **调试困难**

* React DevTools 看到一堆匿名组件

4. **静态方法丢失**

```js
WrappedComponent.staticMethod ❌
```

需要：

```js
hoist-non-react-statics
```

---

## 六、HOC vs Hook（高频对比题）

| 对比       | HOC              | Hook          |
| -------- | ---------------- | ------------- |
| 逻辑复用     | ✅                | ✅             |
| 嵌套       | 多                | 少             |
| 可读性      | 一般               | 好             |
| 调试       | 困难               | 容易            |
| props 冲突 | 有                | 无             |
| 适用组件     | class / function | function only |
| React 推荐 | ❌                | ✅             |

👉 **React 官方态度**

> 新项目优先 Hook，HOC 更多是“历史方案 + 特殊场景”

---

## 七、HOC vs Render Props

```js
<DataProvider>
  {data => <List data={data} />}
</DataProvider>
```

|        | HOC | Render Props |
| ------ | --- | ------------ |
| 复用方式   | 包装  | 函数           |
| JSX 嵌套 | 少   | 多            |
| 可组合性   | 一般  | 好            |

---

## 八、HOC 的设计规范（加分项）

### 1️⃣ 透传 props

```js
<WrappedComponent {...props} />
```

### 2️⃣ displayName

```js
Enhanced.displayName = `withAuth(${Wrapped.name})`;
```

### 3️⃣ 不修改原组件

❌ 直接改 props
❌ 改 state

---

## 九、Hook 出现后，HOC 还用吗？

**还用，但场景很少：**

* 错误边界（Hook 不能做）
* 类组件老项目
* 第三方库注入（如 react-redux connect）
* AOP 风格增强

---

## 十、面试一句话总结（你可以直接背）

> **HOC 是一种通过包装组件来复用逻辑的模式，本质是函数接收组件返回新组件。它在 class 组件时代非常重要，但存在嵌套地狱、props 冲突等问题。Hook 出现后更推荐用 Hook 做逻辑复用，但在错误边界、类组件增强等场景下 HOC 仍然有价值。**

---
