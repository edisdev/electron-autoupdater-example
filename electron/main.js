const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const autoUpdater = require('./autoUpdater');

let mainWindow;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});


app.on('ready', function () {
  const PACKAGE_APP = require('../package.json')

  const EVENTS = {
    GET_VERSION: 'get-current-version',
    CONTROL_VERSION: 'control-version'
  }

  ipcMain.removeHandler(EVENTS.GET_VERSION)
  ipcMain.removeHandler(EVENTS.CONTROL_VERSION)
  ipcMain.removeAllListeners('electron-updater')

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "#12121c",
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'preload.js')
    }
  });

  const htmlFile = path.resolve(__dirname, '../index.html')
  mainWindow.loadFile(htmlFile);

  ipcMain.handle(EVENTS.GET_VERSION, () => {
    return PACKAGE_APP.version
  })
  ipcMain.handle(EVENTS.CONTROL_VERSION, () => {
    return autoUpdater.control(mainWindow)
  })


  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});
