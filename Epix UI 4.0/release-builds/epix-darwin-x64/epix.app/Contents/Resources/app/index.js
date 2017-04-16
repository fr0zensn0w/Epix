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
        var deck = document.getElementById("card-deck")
        // var img = document.getElementsByClassName('card-img-top img-fluid w-100')
        // right now we're just looping through and assigning images in order.
        // wow actually I just figured out how to make the gallery
        for (i = 0; i < imgData.length; i++) {
            var div = document.createElement('div')
            div.className = "card card-default"
            var img = document.createElement('img')
            console.log(img)
            img.src = 'http://placehold.it/350x250'
            // img[i].src = `file://${__dirname}/Photos/` + imgData[i].FileName
            img.style.height = '250px'
            img.style.width = '350px'
            // var name = 'ss' + i
            // console.log(name);
            img.id = imgData[i].Name

            img.className = "card-img-top img-fluid w-100"
            img.addEventListener('click', function(e) {
                openSelectedSlideshow(e.path[0].id);
                console.log(e);
            })

            //Adding card block to hold slideshow title and description
            var cardBlock = document.createElement('div')
            cardBlock.className = "card-block"

            //Card title
            var h4 = document.createElement("h4")
            h4.textContent = imgData[i].Name
            h4.className = "card-title"

            //Card tags
            var p = document.createElement("p")
            p.textContent = "Tags: " + imgData[i].Tag
            p.className = "card-text"

            cardBlock.appendChild(h4)
            cardBlock.appendChild(p)


            div.appendChild(img)
            div.appendChild(cardBlock)
            deck.appendChild(div)
        }

    })
}
