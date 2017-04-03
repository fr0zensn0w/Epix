// what is called from index.html to add the two buttons
// old preProcessing and node Processing

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')

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

function openSelectedSlideshow(ssName) {
    window = remote.getCurrentWindow()
    main.openSlideshow(ssName);
    // don't timeout
}

// this function should load images into the frames for the slideshows
window.onload = function populateImages() {
    //readTextFile('./data.json', function(dataJSON) {
    // I'm a dummy and forgot about fs
    fs.readFile('./settings.json', 'utf8', function(err, data) {
        var imgData = JSON.parse(data)
        var img = document.getElementsByClassName('card-img-top img-fluid w-100')
        // right now we're just looping through and assigning images in order.
        // wow actually I just figured out how to make the gallery
        for (i = 0; i < img.length && i < 3; i++) {
            console.log(img[i])
            img[i].src = 'http://placehold.it/350x250'
            // img[i].src = `file://${__dirname}/Photos/` + imgData[i].FileName
            img[i].style.height = '250px'
            img[i].style.width = '350px'
            // var name = 'ss' + i
            // console.log(name);
            img[i].id = imgData[i].Name
            img[i].addEventListener('click', function(e) {
                openSelectedSlideshow(e.path[0].id);
                console.log(e);
            })
        }

    })
}
