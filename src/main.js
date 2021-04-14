const {BrowserWindow} = require('electron')

let window

const createWindow = () => {
    window = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    window.loadURL('http://localhost:3000/')
}

module.exports = createWindow