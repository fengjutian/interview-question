---
title: 什么是 Render Props？
tags: [React]
description: 关于 Render Props 模式的面试题，包括定义、核心思想、形式示例、特点、与 HOC 的对比、常用使用场景等方向
date: 2026-02-10
category: React
---


## 1️⃣ 什么是 Render Props？

**定义**：
Render Props 是一种在 React 中共享组件逻辑的模式。它指的是一个 **prop 属性，其值为一个函数**，这个函数返回一个 React 元素。

**核心思想**：
通过函数作为 prop，把组件内部的状态或逻辑暴露给外部，由外部决定渲染内容。

### 形式示例

```jsx
// 计数器组件使用 render prop 共享逻辑
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return this.props.children({  // children 作为 render prop
      count: this.state.count,
      increment: this.increment,
    });
  }
}

// 使用 Counter
function App() {
  return (
    <Counter>
      {({ count, increment }) => (
        <div>
          <p>Count: {count}</p>
          <button onClick={increment}>Increment</button>
        </div>
      )}
    </Counter>
  );
}
```

**特点**：

1. `Counter` 内部只关心逻辑，不关心 UI。
2. `App` 决定 UI 如何渲染。
3. 可重用逻辑而不耦合视图。

---

## 2️⃣ Render Props vs 高阶组件 (HOC)

| 特性   | Render Props    | HOC           |
| ---- | --------------- | ------------- |
| 概念   | 通过函数 prop 注入 UI | 通过函数返回增强组件    |
| 可读性  | 内联函数，直观         | 需要嵌套组件，容易嵌套过深 |
| 适用场景 | 共享状态/逻辑         | 逻辑复用 + 组件增强   |
| 缺点   | 可能引入额外函数调用      | 可能增加组件树层级     |

---

## 3️⃣ 常用使用场景

1. **鼠标位置追踪**

```jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = e => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用
<MouseTracker render={({ x, y }) => <p>Mouse at ({x}, {y})</p>} />
```

2. **表单逻辑抽象**

* 状态管理、校验逻辑封装在组件内部
* 外部通过 render prop 决定表单展示 UI

3. **复用动画/计时器逻辑**

* 封装 setInterval、requestAnimationFrame 等逻辑
* 通过 render prop 渲染动画或计时器 UI

---

## 4️⃣ 面试常见问题

### Q1: 什么是 Render Props？

✅ 答案要点：

* 一种共享组件逻辑的模式
* Prop 值是一个函数
* 通过函数返回 UI，让父组件决定渲染

---

### Q2: Render Props 和 HOC 有何区别？

✅ 答案要点：

* HOC 是函数，返回新组件；Render Props 是函数 prop，返回 UI
* HOC 用于增强组件，Render Props 更灵活控制 UI
* HOC 可能增加组件树深度，Render Props 可能产生额外函数调用

---

### Q3: Render Props 的缺点？

* 函数每次渲染都可能创建新的闭包（性能问题，可用 `useCallback` 优化）
* 多层嵌套 render prop 时可能出现 **回调地狱**
* React Hooks 出现后，很多 render props 场景可以用 Hook 解决，代码更清晰

---

### Q4: Hooks 能替代 Render Props 吗？

✅ 答案：

* 可以，`useMousePosition` 或 `useCounter` Hook 可以替代 `MouseTracker` 或 `Counter` 的 render prop 模式
* 优点：避免多层嵌套、可组合性更强、代码更简洁

```jsx
function useCounter(initial = 0) {
  const [count, setCount] = React.useState(initial);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

function App() {
  const { count, increment } = useCounter();
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

### Q5: 面试题型示例

1. **写一个 render props 组件，封装计数器逻辑**
2. **把鼠标跟踪逻辑封装成 Render Props**
3. **将 Render Props 改写成 Hook**
4. **分析 Render Props 与 HOC 的优缺点和使用场景**

---

如果你需要，我可以帮你整理一个 **完整的 Render Props 面试题+答案清单表格**，直接拿去刷题和复盘，包含 **代码示例+答案要点+思路分析**。

你希望我帮你整理吗？
