import { app, BrowserWindow, Menu, protocol, net } from 'electron';
import * as path from 'path';
import * as url from 'url';

// 处理协议
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

let mainWindow: BrowserWindow | null;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 隐藏菜单
  Menu.setApplicationMenu(null);

  // 加载应用
  if (app.isPackaged) {
    // 生产环境：加载构建后的 Next.js 应用
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  } else {
    // 开发环境：加载本地开发服务器
    mainWindow.loadURL('http://localhost:3000');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  }

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用就绪事件
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});

// 所有窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理 Squirrel 安装事件（仅 Windows）
if (require('electron-squirrel-startup')) {
  app.quit();
}
