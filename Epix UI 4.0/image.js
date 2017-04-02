const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')
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

function openImage() {
    window = remote.getCurrentWindow()
    main.openWindow("image")
    setTimeout(function(){window.close()}, 700);
}

window.onload = function renderImage() {
    var fn = remote.getGlobal('sharedObj').imgname;
    var imgName = fn.split("/")

    console.log(imgName)
    var img = document.createElement('img');
    img.src = fn;
    img.style.width = '600px'
    img.style.height = '500px'
    document.body.appendChild(img);
    var form = document.createElement('form')
    var input = document.createElement('input')
    input.type = "text"
    input.id = "tag"
    form.appendChild(input);
    var backButton = document.createElement('button')
    backButton.textContent = 'Back'
    backButton.addEventListener('click', function() {
        openGallery()
    });
    var button = document.createElement('button')
    button.textContent = 'Submit Tag'
    button.addEventListener('click', function() {
        var tag = document.getElementById("tag").value
        fs.readFile('./data.json', function(err, data) {
            var json = JSON.parse(data);
            // we should implement a more efficient search later
            var found = 0
            var i = 0
            while (!found) {
                if (json[i].FileName == imgName[imgName.length-1]) {
                    found = 1;
                } else {
                    i++
                }
            }
            json[i].Tags = json[i].Tags + " " + tag
            fs.writeFileSync('data.json', JSON.stringify(json, null, 4));
        })
    })
    document.body.appendChild(form);
    document.body.appendChild(button);
    document.body.appendChild(backButton);
}