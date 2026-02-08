const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  // 文件系统操作
  fs: {
    mkdir: (path) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('fs:mkdir', path).then(resolve).catch(reject);
      });
    },
    writeFile: (path, content) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('fs:writeFile', path, content).then(resolve).catch(reject);
      });
    },
    rename: (oldPath, newPath) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('fs:rename', oldPath, newPath).then(resolve).catch(reject);
      });
    },
    rm: (path, options) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('fs:rm', path, options).then(resolve).catch(reject);
      });
    },
    existsSync: (path) => {
      return new Promise((resolve, reject) => {
        ipcRenderer.invoke('fs:existsSync', path).then(resolve).catch(reject);
      });
    }
  }
});