import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as url_module from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 添加命令行开关以防止网络服务崩溃
app.commandLine.appendSwitch('disable-features', 'NetworkService');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  Menu.setApplicationMenu(null);

  // 监听页面加载事件
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorCode, errorDescription);
  });

  if (app.isPackaged) {
    mainWindow.loadURL(
      url_module.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  } else {
    console.log('Loading Next.js dev server at http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000').then(() => {
      console.log('Page loaded successfully');
    }).catch(err => {
      console.error('Failed to load page:', err);
    });
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
