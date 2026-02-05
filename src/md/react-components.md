---
title: React 组件开发
category: React
tags: [React, 组件, 开发]
description: React 组件开发指南，包括组件类型、props、状态管理、生命周期、样式和最佳实践
date: 2026-02-05
---

# React 组件开发

## 什么是 React 组件？

React 组件是构建 React 应用程序的基本单位，它是一个可重用的 UI 元素，可以接收输入（props）并返回描述应该在屏幕上显示什么的 React 元素。

## 组件类型

### 1. 函数组件

函数组件是一个接收 props 并返回 React 元素的 JavaScript 函数。

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### 2. 类组件

类组件是一个继承自 React.Component 的 JavaScript 类，它必须实现 render 方法。

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## 组件 props

Props 是组件的输入，它们是只读的，组件不应该修改自己的 props。

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// 使用组件
<Greeting name="John" age={30} />
```

## 组件状态

状态是组件内部的数据，它可以在组件的生命周期中发生变化。

### 使用 useState Hook

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 组件生命周期

### 函数组件的生命周期

函数组件使用 Hooks 来管理生命周期：

- `useEffect` - 处理副作用，如数据获取、订阅或手动更改 DOM

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 更新文档标题
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 组件组合

组件可以组合在一起，形成更复杂的 UI。

```jsx
function Header() {
  return <header>Header</header>;
}

function Content() {
  return <main>Content</main>;
}

function Footer() {
  return <footer>Footer</footer>;
}

function Layout() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
```

## 组件样式

### 1. 内联样式

```jsx
function StyledComponent() {
  return (
    <div style={{ color: 'red', fontSize: '20px' }}>
      Styled text
    </div>
  );
}
```

### 2. CSS 类

```jsx
function StyledComponent() {
  return (
    <div className="container">
      Styled text
    </div>
  );
}

// CSS 文件
.container {
  color: red;
  font-size: 20px;
}
```

### 3. CSS-in-JS

使用库如 styled-components 或 emotion。

```jsx
import styled from 'styled-components';

const StyledDiv = styled.div`
  color: red;
  font-size: 20px;
`;

function StyledComponent() {
  return <StyledDiv>Styled text</StyledDiv>;
}
```

## 组件测试

### 使用 Jest 和 React Testing Library

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter and increments when button is clicked', () => {
  render(<Counter />);
  
  // 检查初始状态
  expect(screen.getByText('You clicked 0 times')).toBeInTheDocument();
  
  // 点击按钮
  const button = screen.getByText('Click me');
  fireEvent.click(button);
  
  // 检查状态是否更新
  expect(screen.getByText('You clicked 1 times')).toBeInTheDocument();
});
```

## 最佳实践

### 1. 组件拆分

将复杂的组件拆分为更小的、可重用的组件。

### 2. 命名规范

- 组件名称使用 PascalCase
- 文件名称与组件名称保持一致

### 3. Props 类型检查

使用 TypeScript 或 PropTypes 进行类型检查。

```jsx
// 使用 TypeScript
interface GreetingProps {
  name: string;
  age: number;
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// 使用 PropTypes
import PropTypes from 'prop-types';

function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired
};
```

### 4. 性能优化

- 使用 `React.memo` 缓存组件
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数

```jsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // 组件内容
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // 缓存数据
  const expensiveData = useMemo(() => {
    // 昂贵的计算
    return computeExpensiveData(count);
  }, [count]);
  
  // 缓存函数
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  
  return (
    <div>
      <button onClick={handleClick}>Increment</button>
      <ExpensiveComponent data={expensiveData} />
    </div>
  );
}
```

## 总结

React 组件是构建 React 应用程序的基本单位，它们可以是函数组件或类组件。组件可以接收 props 作为输入，管理内部状态，并在生命周期中执行副作用。通过组件组合，可以构建复杂的 UI 界面。

遵循最佳实践，如组件拆分、命名规范、类型检查和性能优化，可以创建更可维护、更高效的 React 应用程序。