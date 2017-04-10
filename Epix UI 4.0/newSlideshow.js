// what is called from index.html to add the two buttons
// old preProcessing and node Processing

// TODO REMOVE ALL OF THIS, JUST COPIED OVER FROM ANOTHER FILE

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')
const path = require('path')



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

function saveSlideshowSettings() {
    var tag = " "
    var name = document.getElementById('name').value
    var month = " "
    var location = " "
    var exif = " "
    // console.log(document.getElementById('tags-checkbox').checked)
    if (document.getElementById('tags-checkbox').checked) {
        tag = document.getElementById('tag').value
    }
    // if (document.getElementById('name-checkbox').checked) {
    //     name = document.getElementById('name').value
    // }
    if (document.getElementById('month-checkbox').checked) {
        month = document.getElementById('month').value
    }
    if (document.getElementById('location-checkbox').checked) {
        location = document.getElementById('location').value
    }
    if (document.getElementById('exif-checkbox').checked) {
        exif = document.getElementById('exif').value
    }
    var ssObj = new Object()
    var json = []
    ssObj.Name = name
    ssObj.Tag = tag
    ssObj.Month = month
    ssObj.Location = location
    ssObj.Exif = exif
    fs.stat('./settings.json', function(err, stat) {
        if (err == null) {
            fs.readFile('./settings.json', function(err, data) {
                json = JSON.parse(data);
                json.push(ssObj);
                fs.writeFileSync('settings.json', JSON.stringify(json, null, 4));
            })
        } else {
            json.push(ssObj)
            fs.writeFileSync('settings.json', JSON.stringify(json, null, 4));
        }
    });
}
