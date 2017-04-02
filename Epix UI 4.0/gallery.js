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
        var gallery = (document.getElementsByClassName('gallery'))[0];
        //var img = document.getElementsByClassName('card-img-top img-fluid w-100')
        // right now we're just looping through and assigning images in order.
        // wow actually I just figured out how to make the gallery
        for (i = 0; i < imgData.length; i++) {
            var div = document.createElement('div')
            div.class = "card"
            var img = document.createElement('img')
            img.class = "card-img-top img-fluid w-100"
            img.src = `file://${__dirname}/Photos/` + imgData[i].FileName
            img.style.height = '250px'
            img.style.width = '350px'
            div.appendChild(img);
            gallery.append(div);
        }
    })    
}

// <div class="card">
//                 <img class="card-img-top img-fluid w-100" src="http://placehold.it/350x150" alt="Card image cap">
//             </div>