import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as url_module from 'url';
import * as fs from 'fs';

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
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  // 创建应用程序菜单
  const template: any[] = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload();
            }
          }
        },
        {
          label: '切换开发者工具',
          accelerator: process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        },
        { type: 'separator' },
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 监听页面加载事件
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
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

// 文件系统操作处理
ipcMain.handle('fs:mkdir', (event, dirPath, options) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, options || { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
});

// 应用程序操作处理
ipcMain.handle('app:getPath', (event, name) => {
  try {
    return app.getPath(name);
  } catch (error) {
    console.error('Error getting path:', error);
    throw error;
  }
});

ipcMain.handle('fs:writeFile', (event, filePath, content) => {
  try {
    // 确保目录存在
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

ipcMain.handle('fs:rename', (event, oldPath, newPath) => {
  try {
    // 确保新路径的目录存在
    const newDirPath = path.dirname(newPath);
    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirPath, { recursive: true });
    }
    fs.renameSync(oldPath, newPath);
    return true;
  } catch (error) {
    console.error('Error renaming file:', error);
    throw error;
  }
});

ipcMain.handle('fs:rm', (event, filePath, options) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, options);
    }
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
});

ipcMain.handle('fs:existsSync', (event, filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
});
