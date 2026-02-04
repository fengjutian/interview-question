## 什么是JSX？为什么使用它？
JSX是JavaScript的语法扩展，允许在JavaScript中编写类似HTML的代码。
```jsx
const element = <h1>Hello, world!</h1>;
```

JSX的优势：
- 直观地描述UI应该呈现出的交互效果
- 将标记语言与逻辑代码共同存放，实现关注点分离
- 通过Babel会被编译为React.createElement()调用
- 有助于防止XSS攻击，因为React DOM会自动转义JSX中的内容

## JSX 是怎么被浏览器识别的？
```
JSX
 ↓（Babel 编译）
React.createElement
 ↓
Virtual DOM（JS 对象树）
 ↓
Diff 算法
 ↓
最小化 DOM 操作
 ↓
真实 DOM

```
