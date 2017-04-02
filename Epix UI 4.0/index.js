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

// got this from stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


// this function should load images into the frames for the slideshows
window.onload = function populateImages() {
    readTextFile('./data.json', function(dataJSON) {
        var imgData = JSON.parse(dataJSON)
        var img = document.getElementsByClassName('card-img-top img-fluid w-100')
        for (i = 0; i < img.length; i++) {
            img[i].src = `file://${__dirname}/Photos/` + imgData[i].FileName
            img[i].style.height = '250px'
            img[i].style.width = '350px'
        }
    })
    //JSON.parse('./data.json');
    // just using one image, we should make it pick an image that acually belongs to the slideshow
    
}