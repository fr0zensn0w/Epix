const electron = require('electron')
const {app, BrowserWindow} = electron

// when the app is ready, open this page
app.on('ready', () => {
    let win = new BrowserWindow({width:800, height:600})
    win.loadURL(`file://${__dirname}/index.html`)
})


// to open another window
exports.openWindow = (filename) => {
    let win = new BrowserWindow({width:800, height:600})
    win.loadURL(`file://${__dirname}/` + filename + `.html`)
}