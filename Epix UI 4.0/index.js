// what is called from index.html to add the two buttons
// old preProcessing and node Processing

const remote = require('electron').remote
const main = remote.require('./main.js')

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

// this function should load images into the frames for the slideshows
window.onload = function populateImages() {
    // just using one image, we should make it pick an image that acually belongs to the slideshow
    var img = document.getElementsByClassName('card-img-top img-fluid w-100')
    for (i = 0; i < img.length; i++) {
        img[i].src = "/Users/anthonybonitatibus/Documents/Epix/Epix UI 4.0/Photos/IMG_0118.JPG"
        img[i].style.height = '250px'
        img[i].style.width = '350px'
    }
}