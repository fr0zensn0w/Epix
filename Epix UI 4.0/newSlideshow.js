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
    var name = " "
    var month = " "
    var location = " "
    if (1) {
        tag = document.getElementById('tag').value
    }
    if (1) {
        name = document.getElementById('name').value
    }
    if (1) {
        month = document.getElementById('month').value
    }
    if (1) {
        location = document.getElementById('location').value
    }
    var ssObj = new Object()
    var json = []
    ssObj.Name = name
    ssObj.Tag = tag
    ssObj.Month = month;
    ssObj.Location = location;
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
