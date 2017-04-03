const electron = require('electron')
const {app, BrowserWindow, shell} = electron
const remote = electron.remote

//// implement below somehow to get the window to gracefully transition (no white flash)
// let win = new BrowserWindow({show: false})
// win.once('ready-to-show', () => {
//   win.show()
// })

// require('electron-debug')({showDevTools: true});

// when the app is ready, open this page
app.on('ready', () => {
    let win1 = new BrowserWindow({width:1000, height:800, transparent:false, frame:true, show:false})
    win1.loadURL(`file://${__dirname}/index.html`)
    // removes the white page that is shown before the window is loaded up
    win1.once('ready-to-show', () => {
      win1.show()
    })

})




exports.openImage = (i) => {
    global.sharedObj = {imgname: i};
    let win = new BrowserWindow({width:1000, height:800, backgroundColor: '#222',show:false})
    win.loadURL(`file://${__dirname}/image.html`)
    // win.show()
    // win.webContents.openDevTools()
    //win.webContents.send('imgname', filename)
    win.once('ready-to-show', () => {
      win.show()
    })
}

exports.openSlideshow = (ssName) => {
    global.sharedObj = {SSN: ssName};
    let win = new BrowserWindow({width:1000, height:800, backgroundColor: '#222',show:false})
    win.loadURL(`file://${__dirname}/slideshow.html`)
    // win.show()
    //win.webContents.openDevTools()
    //win.webContents.send('imgname', filename)
    win.once('ready-to-show', () => {
      win.show()
    })
}


// to open another window
exports.openWindow = (filename) => {
    let win = new BrowserWindow({width:1000, height:800, backgroundColor: '#222',show:false})
    win.loadURL(`file://${__dirname}/` + filename + `.html`)
    // win.show()
    // win.webContents.openDevTools()
    win.once('ready-to-show', () => {
      win.show()
    })
}
