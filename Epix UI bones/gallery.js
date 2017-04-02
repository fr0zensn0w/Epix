// TODO put all the code here for handling buttons in the gallery
// to actually make the buttons, make them in gallery.html

const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')





function openPhotoGallery() {
    // alert("open the gallery")
    // TODO: put code in here to open the gallery, AKA open up to where the images are stored
    fullPath = "/Users/liquidsn0w/Desktop/"
    // shell.beep() //makes a beeping sound
    shell.showItemInFolder(fullPath)
}

function openNewSlideshow() {
    // DO NOT DELETE - handles opening the page
    //open the create new slideshow window
    window = remote.getCurrentWindow()
    main.openWindow("newSlideshow")
    setTimeout(function(){window.close()}, 700);
    // window.close()
}

function openGallery() {
    window = remote.getCurrentWindow()
    main.openWindow("gallery")
    setTimeout(function(){window.close()}, 700);
}

function openSlideshows() {
    window = remote.getCurrentWindow()
    main.openWindow("index")
    setTimeout(function(){window.close()}, 700);
}
