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
