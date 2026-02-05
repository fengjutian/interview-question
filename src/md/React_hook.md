## 常用Hooks及其使用场景

### useState：管理组件状态
```jsx
const [count, setCount] = useState(0);
```
### useEffect：处理副作用，如数据获取、订阅事件等

```jsx
useEffect(() => {
  document.title = `点击了${count}次`;
  return () => { /* 清理函数 */ };
}, [count]);
```

### useContext：跨组件共享状态
```jsx
const theme = useContext(ThemeContext);
```

### useReducer：复杂状态逻辑管理
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### useCallback：缓存函数引用，避免不必要的重新渲染
```jsx
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);
```

### useMemo：缓存计算结果
```jsx
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### useImperativeHandle：自定义暴露给父组件的实例值
```jsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus()
}));
```

### useDebugValue：在React DevTools中显示自定义Hook的调试信息
```jsx
useDebugValue(count > 0 ? '已点击' : '未点击');
```

### useLayoutEffect：在DOM更新后同步执行副作用
```jsx
useLayoutEffect(() => {
  // 同步执行布局相关操作
}, [dependencies]);
```

### useRef：保存可变值，访问DOM元素
```jsx
const inputRef = useRef(null);
```

## 如何使用自定义Hook复用逻辑？
自定义Hook是一种复用状态逻辑的方式，它可以提取组件逻辑到可重用的函数中。

例如，创建一个管理表单的Hook：

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);
  
  return { values, handleChange, resetForm };
}

// 使用自定义Hook
function LoginForm() {
  const { values, handleChange, resetForm } = useForm({ username: '', password: '' });
  
  return (
    <form>
      <input name="username" value={values.username} onChange={handleChange} />
      <input name="password" value={values.password} onChange={handleChange} />
      <button type="button" onClick={resetForm}>重置</button>
    </form>
  );
}
```

## React.memo与useMemo的区别？
### React.memo：

- 是一个高阶组件
- 用于包裹函数组件，对props进行浅比较
- 当props不变时，避免组件重新渲染

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  // 仅当props变化时重新渲染
});
```
### useMemo

- 是一个Hook
- 用于缓存计算结果
- 只有依赖项变化时才重新计算值

```jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

区别：React.memo用于整个组件的记忆化，而useMemo用于特定计算结果的记忆化。

## useEffect VS useLayoutEffect
useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。

useEffect 是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect 是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变DOM后渲染），不会产生闪烁。useLayoutEffect总是比useEffect先执行。
