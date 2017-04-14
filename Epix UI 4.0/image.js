const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')
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

function openImage() {
    window = remote.getCurrentWindow()
    main.openWindow("image")
    setTimeout(function(){window.close()}, 1700);
}

window.onload = function renderImage() {
    var fn = remote.getGlobal('sharedObj').imgname;
    var imgName = fn.split("/")

    //put everything into this
    var container = document.getElementById("page-container")

    //img name
    var imageName = document.createElement('h1')
    imageName.className = "page-header"
    imageName.textContent = imgName[imgName.length-1]

    var imageNameDiv = document.createElement('div')
    imageNameDiv.className = "row"

    var imageNameCol = document.createElement('div')
    imageNameCol.className = "col-lg-12"
    imageNameCol.appendChild(imageName)

    imageNameDiv.appendChild(imageNameCol)



    //back button
    var backDiv = document.createElement('div')
    backDiv.id = "back-div"

    var backButton = document.createElement('button')
    backButton.textContent = 'Back'
    backButton.type = "button"
    backButton.className = "btn btn-sm btn-primary"
    backButton.addEventListener('click', function() {
        openGallery()
    });

    backDiv.appendChild(backButton)

    container.appendChild(backDiv);




    //div to hold image and tag input row
    var imageAndInput = document.createElement('div')
    imageAndInput.id = "image-and-input"


    //image
    console.log(imgName)
    var img = document.createElement('img');
    img.id = 'image-display'
    img.src = fn;
    img.style.width = '600px'
    img.style.height = '500px'
    imageAndInput.appendChild(img);
    imageAndInput.appendChild(imageNameDiv);


    //input and submit button row and columns
    var inputRow = document.createElement('div')
    inputRow.className = "form-group row"
    inputRow.id = "tag-input"

    var formCol = document.createElement('div')
    formCol.className = "col-3"

    var buttonCol = document.createElement('div')
    buttonCol.className = "col-1"



    //input
    var form = document.createElement('form')
    var input = document.createElement('input')
    input.type = "text"
    input.className = "form-control"
    input.placeholder = "add tags"
    input.id = "tag"
    form.appendChild(input);



    //submit button
    var button = document.createElement('button')

    button.type = "button"
    button.className = "btn btn-sm btn-primary"

    button.textContent = 'Submit Tag'
    button.addEventListener('click', function() {
        var tag = document.getElementById("tag").value
        fs.readFile('./data.json', function(err, data) {
            var json = JSON.parse(data);
            // we should implement a more efficient search later
            var found = 0
            var i = 0
            while (!found && i < json.length) {
                console.log(json[i].FileName)
                console.log(imgName[imgName.length-1])
                var curImage = (imgName[imgName.length-1]).replace("%20", " ")
                if (json[i].FileName == curImage) {
                    found = 1;
                } else {
                    i++
                }
            }
            json[i].Tags = json[i].Tags + " " + tag
            fs.writeFileSync('data.json', JSON.stringify(json, null, 4));
        })
    })
    formCol.appendChild(form);
    buttonCol.appendChild(button);

    inputRow.appendChild(formCol);
    inputRow.appendChild(buttonCol);

    imageAndInput.appendChild(inputRow);


    container.appendChild(imageAndInput);


}
