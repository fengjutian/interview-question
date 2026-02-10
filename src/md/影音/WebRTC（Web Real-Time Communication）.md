---
title: WebRTC（Web Real-Time Communication）
tags: [WebRTC]
description: 关于 WebRTC（Web Real-Time Communication）的面试题，包括基础概念、核心 API、应用场景等方向
date: 2026-02-10
category: WebRTC
---

## **一、基础概念**

1. **WebRTC 是什么？**

   * WebRTC 是浏览器原生支持的 **实时音视频通信技术**，支持 **点对点（P2P）音视频、数据传输**。
   * 核心特点：

     * 低延迟实时通信
     * 跨平台（Chrome、Firefox、Safari 等）
     * 不依赖插件
   * **应用场景**：

     * 视频通话、直播互动
     * 在线教育、远程会议
     * P2P 文件传输

2. **WebRTC 传输流程**

   * **信令阶段**：交换 SDP（Session Description Protocol）和 ICE 候选地址
   * **建立连接**：创建 `RTCPeerConnection`，协商媒体流
   * **媒体传输**：通过 SRTP/DTLS 加密传输音视频
   * **数据通道**（可选）：通过 `RTCDataChannel` 传输自定义数据

---

## **二、核心 API**

1. **获取本地媒体流**

```js
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
  })
  .catch(err => console.error(err));
```

* **追问**：

  * 如何处理用户拒绝权限？
  * 如何获取屏幕共享流？

    ```js
    navigator.mediaDevices.getDisplayMedia({ video: true });
    ```

2. **创建 PeerConnection**

```js
const pc = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});
```

* **作用**：管理 P2P 连接和 ICE 候选
* **追问**：

  * STUN/TURN 有什么区别？

    * **STUN**：获取公网 IP
    * **TURN**：中继转发（穿透失败时）
  * 可以只用 STUN 吗？（不可靠，NAT 严重时需要 TURN）

3. **添加本地流到连接**

```js
stream.getTracks().forEach(track => pc.addTrack(track, stream));
```

4. **创建 SDP Offer / Answer**

```js
// 创建 Offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
// 将 offer 发送给远端，远端生成 Answer
```

* **追问**：

  * SDP 里包含哪些信息？

    * 编解码器、媒体流信息、候选地址
  * Offer/Answer 流程的作用是什么？

    * 双方协商媒体格式和连接参数

5. **处理 ICE Candidate**

```js
pc.onicecandidate = event => {
  if (event.candidate) sendCandidateToRemote(event.candidate);
};
```

* **追问**：

  * 如果 ICE 失败怎么办？
  * 可以同时传多个 candidate 吗？（可以，浏览器会合并）

6. **远端流渲染**

```js
pc.ontrack = event => {
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = event.streams[0];
};
```

7. **数据通道**

```js
const dataChannel = pc.createDataChannel('chat');
dataChannel.onmessage = e => console.log('收到消息:', e.data);
```

* **追问**：

  * 数据通道是可靠的还是不可靠的？

    * 默认可靠，可配置为不可靠（UDP 风格）
  * 应用场景：实时游戏、协同编辑、文件传输

---

## **三、面试高频问题**

1. **WebRTC 和传统流媒体的区别**

   * WebRTC：低延迟 P2P
   * HLS/DASH：基于 HTTP 分段，延迟高
   * **追问**：为什么直播延迟会更低？

2. **如何解决 NAT/防火墙穿透问题？**

   * STUN + TURN
   * ICE 协议动态选路
   * **追问**：NAT 类型对 P2P 有什么影响？

3. **WebRTC 的安全机制**

   * 全部使用 DTLS + SRTP 加密
   * 媒体和信令需 HTTPS/WSS
   * **追问**：为什么必须 HTTPS？

     * 浏览器安全策略，getUserMedia 只能在安全上下文使用

4. **WebRTC 的延迟和带宽优化**

   * 自适应码率（ABR）
   * 调整 `RTCPeerConnection` 编码参数
   * 控制帧率和分辨率
   * **追问**：如何在前端实现带宽自适应？

5. **常见问题排查**

   * 黑屏：`ontrack` 没触发 → 流未添加或被拒绝
   * 音视频不同步：时间戳校准
   * 网络不通：STUN/TURN 配置

---

## **四、实战题示例**

1. **实现一对一视频通话**

   * 步骤：

     1. 获取本地媒体流
     2. 创建 RTCPeerConnection
     3. 添加本地流
     4. 创建 SDP Offer / Answer
     5. 通过信令服务器交换 SDP 和 ICE
     6. 渲染远端流

2. **实现屏幕共享**

   * 用 `getDisplayMedia` 获取屏幕流，替换或合并到现有 PeerConnection

3. **实现聊天 + 文件传输**

   * 使用 `RTCDataChannel` 发送文本/二进制数据
   * 可实现 P2P 文件传输，无需服务器中转

