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
    loadDatabase()
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
    fs.readFile('./data.json', function(err, data) {
        var imgData = JSON.parse(data)
        var gallery = document.getElementById("gallery-cards")
        //var img = document.getElementsByClassName('card-img-top img-fluid w-100')
        // right now we're just looping through and assigning images in order.
        // wow actually I just figured out how to make the gallery
        for (i = 0; i < imgData.length; i++) {
            var div = document.createElement('div')
            div.className = "card card-inverse"
            var img = document.createElement('img')
            img.className = "card-img-top img-fluid w-100"
            img.src = `file://${__dirname}/Photos/` + imgData[i].FileName
            // img.style.height = '250px'
            // img.style.width = '350px'

            img.style.width = imgData[i].Width/20
            img.style.height = imgData[i].Height/20

            img.addEventListener('click', function(e) {
                //openSelected(e);
                openSelected(e.path[0].currentSrc);
            })

            div.appendChild(img);
            gallery.appendChild(div);
        }
    })
}

// <div class="card">
//                 <img class="card-img-top img-fluid w-100" src="http://placehold.it/350x150" alt="Card image cap">
//             </div>
