---
title: Vue3 nextTick 为什么一定是微任务
tags: [Vue3, 组件]
description: Vue3 nextTick 为什么一定是微任务
date: 2026-02-05
category: Vue3
---

---

## 一、先看 Vue nextTick 是干什么的

```js
Vue.nextTick(() => {
  // DOM 更新完成后的回调
});
```

* **目的**：保证**状态更新完成、DOM 已经重新渲染到页面**后再执行回调
* **关键点**：不管你多次修改数据，nextTick 回调总是**批量执行**一次

---

## 二、为什么 nextTick 不能用宏任务？

### 1️⃣ 宏任务的特点

* setTimeout、setInterval 是宏任务
* 宏任务队列要等当前宏任务结束 + 所有微任务清空后才执行
* 同一轮事件循环，**宏任务执行顺序晚**

如果 nextTick 用宏任务：

```js
this.count++
this.count++
Vue.nextTick(() => console.log('DOM updated'))
```

* 会等待当前宏任务 + 下一个宏任务
* **可能比页面渲染晚一轮** → 不够实时
* 批量更新就不高效了

---

### 2️⃣ 微任务的特点

* Promise.then、queueMicrotask
* 当前宏任务结束后立即执行
* **会在下一轮宏任务前完成**
* 可以保证**多次数据修改被合并**再执行回调

---

## 三、Vue源码里 nextTick 的实现（简化版）

```js
const callbacks = [];

function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks);
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice();
  callbacks.length = 0;
  copies.forEach(cb => cb());
}
```

* `Promise.resolve().then()` → **微任务**
* **批量 flushCallbacks** → 批量 DOM 更新回调
* **保证同一轮事件循环内多次修改状态只触发一次回调**

---

## 四、事件循环视角

```
宏任务（script / setTimeout）
├─ 同步代码
├─ Vue 更新数据（响应式触发）
│   └─ effect -> nextTick 注册回调到微任务队列
├─ 当前宏任务结束
├─ 清空微任务队列 -> 执行 nextTick 回调
├─ 浏览器渲染
├─ 下一宏任务执行
```

* **核心点**：微任务队列清空时，DOM 已经是最新状态
* **如果用宏任务**，下一轮宏任务才触发回调 → DOM 更新延迟 → 不符合 Vue 的设计初衷

---

## 五、总结成一句话

> **Vue nextTick 必须是微任务，因为它要保证：当前宏任务执行完、所有响应式更新收集完、下一轮宏任务前立即执行回调，保证 DOM 更新已完成并批量合并。**

---

## 六、补充思路（面试加分）

* nextTick = 微任务 → 保证“同步代码执行完后立即执行回调”
* 如果多次状态修改，只触发一次回调 → **批处理优化**
* Vue 3 的 `flushJobs` 源码就是这个原理
* React 的 `useEffect` 也是类似机制（微任务级别）

---

我可以下一步帮你做一个**完整图示**：

```
Vue响应式更新 → nextTick回调队列 → 微任务 → DOM更新 → 浏览器渲染
```


