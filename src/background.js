'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

var template = [{
  label: 'Song Writer',
  submenu: [
    {
      label: 'About Song Writer',
      selector: 'orderFrontStandardAboutPanel:'
    }
  ]
},
{
  label: 'Edit',
  submenu: [
    {
      label: 'Undo',
      accelerator: 'Command+Z',
      selector: 'undo:'
    },
    {
      label: 'Redo',
      accelerator: 'Shift+Command+Z',
      selector: 'redo:'
    },
    {
      type: 'separator'
    },
    {
      label: 'Cut',
      accelerator: 'Command+X',
      selector: 'cut:'
    },
    {
      label: 'Copy',
      accelerator: 'Command+C',
      selector: 'copy:'
    },
    {
      label: 'Paste',
      accelerator: 'Command+V',
      selector: 'paste:'
    },
    {
      label: 'Select All',
      accelerator: 'Command+A',
      selector: 'selectAll:'
    },
  ]
},
{
  label: 'View',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'Command+R',
      click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
    },
  ]
},
{
  label: 'Window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:'
    },
    {
      label: 'Close',
      accelerator: 'Command+W',
      selector: 'performClose:'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      selector: 'arrangeInFront:'
    },
  ]
},
{
  label: 'Help',
  submenu: []
}];

const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })

ipcMain.on("close", () => {
  console.log("Close triggered");
  mainWindow.close();
})

ipcMain.on("minimize", () => {
  console.log("minimize triggered");
  mainWindow.minimize();
})

ipcMain.on("maximize", () => {
  console.log("maximize triggered");
  if(mainWindow.isMaximized()){
    mainWindow.unmaximize();
  }else{
    mainWindow.maximize();
  }
})

function createMainWindow () {
  const window = new BrowserWindow({ width: 1240, height: 800, backgroundColor: "white", frame: false })
  window.setMenu(menu);
  if (isDevelopment) {
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  });

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
})
