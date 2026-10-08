import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

let mainWindow
let backendProcess

function startBackend() {
  if (backendProcess) return

  backendProcess = spawn(process.execPath, ['server/index.js'], {
    cwd: rootDir,
    env: { ...process.env, PORT: '5000', NODE_ENV: 'production', DIST_BUILD: 'true' },
    stdio: 'inherit'
  })

  backendProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error('Backend exited with code', code)
    }
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 980,
    minWidth: 1100,
    minHeight: 760,
    show: false,
    title: 'Tap & Pass Border Operations',
    backgroundColor: '#092b34',
    autoHideMenuBar: true,
    fullscreen: true,
    fullscreenable: true,
    kiosk: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false
    }
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL('http://localhost:5000')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  startBackend()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})
