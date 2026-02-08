---
title: 事件循环 + Vue 更新机制联动解析
tags: [Vue3]
description: 事件循环 + Vue 更新机制联动解析，包括同步代码、宏任务、微任务、Vue 响应式 effect、nextTick、浏览器渲染等核心概念
date: 2026-02-05
category: Vue3
---

# 一、核心概念先梳理

| 概念             | 角色                                   | 事件循环位置                       |
| -------------- | ------------------------------------ | ---------------------------- |
| 同步代码           | 调用栈立即执行                              | 当前宏任务                        |
| 宏任务            | setTimeout、事件回调                      | 事件循环下一轮                      |
| 微任务            | Promise.then、queueMicrotask、nextTick | 当前宏任务结束后立即执行                 |
| Vue 响应式 effect | 数据变化触发 watcher                       | 同步收集 effect → nextTick 调用微任务 |
| nextTick       | Vue 提供的微任务回调注册                       | 微任务队列清空阶段执行                  |
| 渲染             | 浏览器更新 DOM                            | 微任务清空后 → 浏览器渲染               |

---

# 二、Vue 更新机制核心流程（结合事件循环）

1. **数据修改**（同步任务）

```js
this.count++
this.flag = true
```

* 触发 **响应式 getter/setter**
* 收集 **依赖 effect**（watcher / computed / component render）

2. **effect 收集**（同步）

* 立即收集依赖，但**不会同步执行 render**
* render 更新被 **加入更新队列**

3. **nextTick 注册回调**（微任务）

```js
Vue.nextTick(() => {
  console.log('DOM updated')
})
```

* 回调被放入 **微任务队列**

4. **当前宏任务结束**

* 同步代码执行完毕
* 事件循环触发 **微任务清空阶段**

5. **微任务执行**

* Vue 批量 **flush 更新队列** → 执行 component render
* 执行 nextTick 回调

6. **浏览器渲染**

* 微任务清空后浏览器更新页面
* 确保 DOM 已经是最新状态

7. **下一轮宏任务**

* setTimeout / 事件回调等进入执行

---

# 三、可视化示意（脑内模型）

```
[宏任务: script]
├─ 同步代码
│   ├─ this.count++
│   ├─ effect 收集 watcher
│   └─ Vue.nextTick 注册回调（微任务队列）
├─ 当前宏任务结束
│
[微任务队列]
├─ flush watcher -> render component
├─ nextTick 回调
│
[浏览器渲染]
└─ 下一轮宏任务（setTimeout / 事件回调）
```

---

# 四、经典例子

```js
console.log('start');

this.count++;
this.count++;
Vue.nextTick(() => console.log('DOM updated'));

Promise.resolve().then(() => console.log('promise'));

console.log('end');
```

### 执行顺序分析

1. 同步代码：`start` → `end`
2. 数据修改触发 watcher → 加入更新队列
3. Promise.then → 微任务
4. nextTick → 微任务
5. 当前宏任务结束 → 清空微任务：

   * 执行 watcher → render DOM
   * 执行 nextTick 回调 → 输出 `DOM updated`
6. 浏览器渲染

**输出顺序**

```
start
end
promise
DOM updated
```

---

# 五、核心面试结论

1. Vue **响应式更新** → 批量执行 → 微任务队列
2. **nextTick** 必须是微任务 → 保证数据更新后立即执行
3. 微任务清空后浏览器渲染 → 保证页面最新状态
4. 宏任务永远在下一轮 → 不会阻塞微任务或 DOM 更新


