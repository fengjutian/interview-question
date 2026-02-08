---
title: 实现一个通用 HOC 模板
tags: [React, HOC, 组件]
description: 实现一个通用的 HOC 模板，包含设计目标和代码实现
date: 2026-02-08
category: React
---

## 一、通用 HOC 设计目标

一个合格的 HOC，至少要做到：

1. ✅ **透传 props**
2. ✅ **不修改原组件**
3. ✅ **可配置（接收参数）**
4. ✅ **displayName 友好**
5. ✅ **支持 ref 转发**
6. ✅ **不丢失静态方法**
7. ✅ **逻辑可插拔**

---

## 二、最通用的 HOC 模板（推荐背这个）

```js
import React, { forwardRef } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

function createHOC(enhancerName, enhance) {
  return function withEnhance(WrappedComponent) {
    const EnhancedComponent = forwardRef((props, ref) => {
      // 这里是“增强逻辑”
      const enhancedProps = enhance(props) || {};

      return (
        <WrappedComponent
          ref={ref}
          {...props}
          {...enhancedProps}
        />
      );
    });

    // 设置 displayName
    const wrappedName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    EnhancedComponent.displayName = `${enhancerName}(${wrappedName})`;

    // 拷贝静态方法
    hoistNonReactStatics(EnhancedComponent, WrappedComponent);

    return EnhancedComponent;
  };
}

export default createHOC;
```

---

## 三、怎么用这个模板？

### 示例 1：withLoading

```js
const withLoading = createHOC('withLoading', props => {
  if (props.loading) {
    return {
      children: <div>Loading...</div>
    };
  }
});
```

```js
export default withLoading(UserList);
```

---

### 示例 2：注入权限信息

```js
const withAuth = createHOC('withAuth', props => {
  return {
    hasAuth: Boolean(props.user),
  };
});
```

---

## 四、如果你觉得上面太“重”，这是简化面试版（常写）

```js
function withEnhance(WrappedComponent) {
  function Enhanced(props) {
    // 增强逻辑
    return <WrappedComponent {...props} />;
  }

  Enhanced.displayName =
    `withEnhance(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Enhanced;
}
```

👉 **面试时写这个完全够用**

---

## 五、ref 转发为什么重要？（加分点）

默认 HOC 会**吃掉 ref**：

```js
<Enhanced ref={ref} /> ❌
```

必须用：

```js
forwardRef((props, ref) => ...)
```

---

## 六、静态方法为什么会丢？

```js
WrappedComponent.fetchData = () => {}
```

HOC 返回的是新组件：

```js
Enhanced.fetchData ❌
```

解决：

```js
hoistNonReactStatics(Enhanced, WrappedComponent);
```

---

## 七、HOC 设计的 3 个铁律（面试官最爱）

1️⃣ **不要修改原组件**

```js
❌ WrappedComponent.prototype.xxx
```

2️⃣ **透传所有 props**

```js
<WrappedComponent {...props} />
```

3️⃣ **增强逻辑不要和 UI 强耦合**

---

## 八、你可以这样回答“实现一个通用 HOC 模板”

> 我会封装一个高阶函数，负责统一处理 displayName、ref 转发和静态方法拷贝，内部通过 enhancer 函数注入增强逻辑，这样不同 HOC 只需要关注自己的业务增强部分，提高复用性和可维护性。

---

## 九、再进阶一步（很加分）

### HOC + Hook 混用（真实项目）

```js
function withTheme(WrappedComponent) {
  return function(props) {
    const theme = useTheme(); // hook
    return <WrappedComponent {...props} theme={theme} />;
  };
}
```

👉 **合法**

* Hook 在组件内部
* HOC 只是返回组件


