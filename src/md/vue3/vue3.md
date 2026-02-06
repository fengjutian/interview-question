---
title: Vue3 核心组件
tags: [Vue3, 组件]
description: 关于 Vue3 核心组件的详细介绍，包括定义、用途和实现方法
date: 2026-02-05
category: Vue3
---

## Vue 3 相比 Vue 2 有哪些核心变化？
- 响应式系统从 Object.defineProperty → Proxy
- Composition API（setup / ref / reactive）
- 更好的 TypeScript 支持
- Tree-shaking 更友好
- 性能更好、体积更小

## Proxy 响应式原理是什么？
- 通过 Proxy 拦截 get / set
- get 时进行依赖收集
- set 时触发依赖更新
- 使用 effect 管理副作用函数

加分点：
- 支持新增 / 删除属性
- 数组、Map、Set 原生支持

## ref 和 reactive 有什么区别？
|      | ref       | reactive |
| ---- | --------- | -------- |
| 数据类型 | 基本类型 + 对象 | 只能对象     |
| 访问   | `.value`  | 直接访问     |
| 解包   | 模板自动解包    | 不需要      |


## setup 执行时机？
- 在 beforeCreate 之前执行
- 此时没有 this
- props 已经解析完成

## watch 和 watchEffect 区别？
|     | watch | watchEffect |
| --- | ----- | ----------- |
| 依赖  | 手动指定  | 自动收集        |
| 时机  | 懒执行   | 立即执行        |
| 控制力 | 高     | 简单          |

## reactive 解构为什么会失去响应式？
原因：
- 解构会触发一次 get
- 新变量不再被 Proxy 代理
解决：
- toRefs
- toRef

## computed 和 watch 区别？
computed 偏“派生状态”，watch 偏“副作用”。

## Vue 3 中如何优化性能？
- shallowRef / shallowReactive

- markRaw

- v-memo

- keep-alive

- 合理拆组件