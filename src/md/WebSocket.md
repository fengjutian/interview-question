---
title: WebSocket
tags: [WebSocket, 工作原理]
description: WebSocket 工作原理介绍，包括握手过程、数据传输、关闭连接等核心概念
date: 2026-02-05
category: WebSocket
---

## 什么是 WebSocket？解决了什么问题？
WebSocket 是一种基于 TCP 的全双工通信协议，通过一次 HTTP Upgrade 握手后建立长连接，允许客户端和服务端随时双向通信，解决了 HTTP 无法服务端主动推送、实时性差的问题。

## WebSocket 建立连接的过程？
1. 客户端发起 HTTP 请求（带 Upgrade: websocket）
2. 服务端返回 101 Switching Protocols
3. 协议从 HTTP 切换为 WebSocket
4. 在同一条 TCP 连接上进行双向通信

## WebSocket 和 HTTP 有什么区别？
| 维度   | HTTP | WebSocket |
| ---- | ---- | --------- |
| 连接   | 短连接  | 长连接       |
| 通信   | 单向   | 全双工       |
| 协议   | 应用层  | 应用层       |
| 实时性  | 差    | 高         |
| 头部开销 | 大    | 小         |


## WebSocket 是如何保证安全的？
WebSocket 本身不负责加密，安全性主要体现在两个方面：
一是握手阶段通过 Sec-WebSocket-Key / Sec-WebSocket-Accept 校验，防止普通 HTTP 请求伪装成 WebSocket；
二是实际生产环境中通常使用 wss://，也就是基于 TLS 的 WebSocket，由 HTTPS 提供数据加密和身份校验。

## WebSocket 如何防中间人攻击？
通过 TLS 加密，确保握手和数据传输过程中的安全性。

## WebSocket 为什么是全双工？
WebSocket 建立在 TCP 之上，而 TCP 天然是全双工的；
同时 WebSocket 协议中不再区分请求和响应，客户端和服务端都可以在任意时间主动发送数据，因此实现了真正的全双工通信。

## HTTP2 也是基于 TCP，它为什么不是全双工？
HTTP2 虽然支持多路复用，但语义上仍然是请求-响应模型，而 WebSocket 没有这个语义限制。

## WebSocket 消息是如何传输的？
WebSocket 以 Frame（帧） 为单位进行数据传输，一条完整消息可以由一个或多个帧组成。
每个帧包含 FIN、Opcode、Payload Length 和 Payload Data，用于标识消息类型、是否结束以及具体数据内容。

## 为什么要拆成 Frame？直接一条消息不行吗？
拆成 Frame 有以下几个原因：
1. 支持二进制数据传输：Frame 可以包含任意二进制数据，而消息只能包含文本或 JSON 等可序列化数据。
2. 支持消息分片：一条大消息可以拆分成多个 Frame 发送，避免单次传输数据量过大。
3. 支持消息压缩：可以在 Frame 级别进行压缩，减少传输数据量。

## WebSocket 如何做心跳保活？
WebSocket 协议本身定义了 ping / pong 控制帧用于心跳检测。
服务端会定期发送 ping，如果在指定时间内未收到 pong，则认为连接失效并关闭连接。


## WebSocket 断线重连怎么做？
1. 监听 onclose / onerror
2. 延迟发起重连，避免瞬时重试
3. 重新进行身份校验
4. 必要时进行消息补偿
   
## 如果一万客户端同时断线重连怎么办？
1. 服务端可以限制每个客户端的重连次数，避免对服务端压力过大。
2. 可以采用分布式部署，将客户端连接分布到多个节点，避免单点压力。

## WebSocket 如何鉴权？
WebSocket 握手阶段浏览器无法自定义 Header，因此常见做法是在连接建立后，通过第一条消息发送 token 进行鉴权，服务端校验通过后才允许后续通信。

### 为什么不直接把 token 放 URL？
- URL 容易被日志记录
- 安全性差

## WebSocket 如何处理消息可靠性？
WebSocket 基于 TCP，只保证字节传输可靠，不保证业务消息一定被正确处理。
业务层通常需要自行实现消息 ID、ACK 确认、重发机制，确保消息不丢、不重、不乱。

### 那 WebSocket 和 MQ 谁更可靠？
- WebSocket 依赖 TCP 协议，而 MQ 是应用层协议，因此 WebSocket 更可靠。
- 但 MQ 通常用于异步解耦场景，而 WebSocket 更适用于实时通信场景。


## WebSocket 如何支持集群？
WebSocket 是有状态连接，在集群环境下需要解决连接和消息路由问题，常见方案包括：
- 使用 Nginx Sticky Session
- 通过 Redis Pub/Sub 广播消息
- 使用消息队列进行跨节点通信


## WebSocket 和 SSE 的区别？
|       | WebSocket | SSE     |
| ----- | --------- | ------- |
| 通信    | 双向        | 单向      |
| 协议    | TCP       | HTTP    |
| 浏览器支持 | 好         | 好       |
| 适用    | IM / 游戏   | 通知 / 推送 |

## WebSocket 是不是一直占用线程？
不是。
在事件驱动模型下，WebSocket 通常基于 epoll/select，一个线程可以管理成千上万条连接，不会为每个连接分配一个线程。

### 那什么情况下会占满线程？
- 同步阻塞 IO
- 消息处理逻辑太慢

## WebSocket 可以跨域吗？
可以。
WebSocket 不受浏览器同源策略限制，但服务器可以通过校验 Origin 头来控制来源。

### 那算不算安全漏洞？
不是。
Origin 头只是一个建议，服务器可以根据业务逻辑来判断是否接受连接。


## WebSocket 和 HTTP2 能一起用吗？
传统 WebSocket 基于 HTTP/1.1 的 Upgrade 机制，HTTP/2 不支持这种 Upgrade。
虽然存在 WebSocket over HTTP/2 的扩展方案，但目前主流浏览器和生产环境中并不常用。