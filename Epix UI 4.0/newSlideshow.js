// what is called from index.html to add the two buttons
// old preProcessing and node Processing

// TODO REMOVE ALL OF THIS, JUST COPIED OVER FROM ANOTHER FILE

const remote = require('electron').remote
const main = remote.require('./main.js')



// TODO put functions here that handle what goes on in the create new slideshow page
// All buttons should be placed in the newSlideshow.html file

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
