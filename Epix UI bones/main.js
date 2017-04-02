const electron = require('electron')
const {app, BrowserWindow, shell} = electron

//// implement below somehow to get the window to gracefully transition (no white flash)
// let win = new BrowserWindow({show: false})
// win.once('ready-to-show', () => {
//   win.show()
// })

// require('electron-debug')({showDevTools: true});

// when the app is ready, open this page
app.on('ready', () => {
    let win = new BrowserWindow({width:800, height:600, transparent:false, frame:true})
    win.loadURL(`file://${__dirname}/index.html`)
})


// to open another window
exports.openWindow = (filename) => {
    let win = new BrowserWindow({width:800, height:600})
    win.loadURL(`file://${__dirname}/` + filename + `.html`)
}
