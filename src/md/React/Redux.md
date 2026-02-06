---
title: Redux 与 React-Redux 工作原理
category: React
tags: [React, Redux, 状态管理]
description: Redux 与 React-Redux 的工作原理详解，包括核心概念、工作流程和使用方法
date: 2026-02-05
---

##  Redux与React-Redux的工作原理
### Redux核心概念：
- Store：存储应用状态的容器
- Action：描述发生了什么的普通对象
- Reducer：指定如何更新状态的纯函数
- Dispatch：将action发送到store的方法

### React-Redux是连接Redux和React的库：
- Provider组件：将Redux store注入React应用
- connect高阶组件：连接组件和Redux store
- useSelector和useDispatch：hooks方式访问store

工作流程：
1. 组件dispatch一个action
2. Redux store调用reducer
3. reducer计算新状态并返回
4. store更新状态
5. 连接到store的组件接收新状态并重新渲染
