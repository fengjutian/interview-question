// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 示例：发送消息到主进程
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  // 示例：接收来自主进程的消息
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});
