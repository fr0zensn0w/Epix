// TODO put all the code here for handling buttons in the gallery
// to actually make the buttons, make them in gallery.html

const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')
const fs = require('fs')
const sql = require('sql.js')
const processing = require('./processing.js')

let myWindow = remote.BrowserWindow.fromId(1);



function processPhotos() {
    processing.processPhotos()

}

function openPhotoGallery() {
    // alert("open the gallery")
    // TODO: put code in here to open the gallery, AKA open up to where the images are stored
    // fullPath = "/Users/liquidsn0w/Desktop/"
    fullPath = `file://${__dirname}/Photos/`
    fullPath = __dirname + "/Photos/.0000001.jpg"
    // shell.beep() //makes a beeping sound
    shell.showItemInFolder(fullPath)
}

function openNewSlideshow() {
    // DO NOT DELETE - handles opening the page
    //open the create new slideshow window
    window = remote.getCurrentWindow()
    main.openWindow("newSlideshow")
    setTimeout(function(){window.close()}, 1700);
    // window.close()
}

function openGallery() {
    window = remote.getCurrentWindow()
    main.openWindow("gallery")
    setTimeout(function(){window.close()}, 1700);
}

function openSlideshows() {
    window = remote.getCurrentWindow()
    main.openWindow("index")
    setTimeout(function(){window.close()}, 1700);
}

function openSelected(i) {
    window = remote.getCurrentWindow()
    main.openImage(i)
    setTimeout(function(){window.close()}, 1700);
}



// this function should load images into the frames for the slideshows
window.onload = function populateImages() {
    var inBuff = fs.readFileSync('./database.sqlite')
    // console.log("database found!")
    var db = new sql.Database(inBuff)

    var query = "SELECT imageName, Width, Height FROM Image;"
    var imageData = db.exec(query)
    var imageData = imageData[0].values

    // console.log(imageData)

    var gallery = document.getElementById("gallery-cards")

    for (i = 0; i < imageData.length; i++) {

        var div = document.createElement('div')
        div.className = "card card-inverse"
        var img = document.createElement('img')
        img.className = "card-img-top img-fluid w-100"
        img.src = `file://${__dirname}/Photos/` + imageData[i][0]
        img.style.width = imageData[i][1]/20
            img.style.height = imageData[i][2]/20

            img.addEventListener('click', function(e) {
                //openSelected(e);
                openSelected(e.path[0].currentSrc);
            })

            div.appendChild(img);
            gallery.appendChild(div);

    }


    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    db.close() 
}
