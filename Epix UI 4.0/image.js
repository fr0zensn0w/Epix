const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')
const fs = require('fs')
const sql = require('sql.js')

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
    var imgArr = fn.split("/")
    var imgName = (imgArr[imgArr.length-1]).replace("%20", " ")

    //put everything into this
    var container = document.getElementById("page-container")

    //img name
    var imageName = document.createElement('h1')
    imageName.className = "page-header"
    imageName.textContent = imgName
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

    // document.body.appendChild(img);


    //input
    var form = document.createElement('form')
    var input = document.createElement('input')
    input.type = "text"
    input.className = "form-control"
    input.value = "add tags"
    input.id = "tag"
    form.appendChild(input);
    // var backButton = document.createElement('button')
    // backButton.textContent = 'Back'
    // backButton.addEventListener('click', function() {
    //     openGallery()
    // });



    //submit button
    var button = document.createElement('button')

    button.type = "button"
    button.className = "btn btn-sm btn-primary"

    button.textContent = 'Submit Tag'
    button.addEventListener('click', function() {
        var tag = document.getElementById("tag").value

        // new, DB method

        // first, get the database file
        var inBuff = fs.readFileSync('./database.sqlite')
        console.log("database found!")
        var db = new sql.Database(inBuff)
        // console.log(db.exec("SELECT * FROM Image"))

        try {
            db.run("INSERT INTO ImageTags VALUES ('" + imgName + "','" + tag + "');")
        } catch (e) {
            console.log(e)
            console.log(db.exec("SELECT * FROM ImageTags WHERE imageName='" + imgName +"';"))
        }
        
        var dbBinary = db.export()
        var buff = new Buffer(dbBinary)
        fs.writeFileSync("database.sqlite", buff)
        console.log(db.exec("SELECT * FROM ImageTags WHERE imageName='" + imgName +"';"))
        db.close()
    })
    // document.body.appendChild(form);
    // document.body.appendChild(button);
    // document.body.appendChild(backButton);


    formCol.appendChild(form);
    buttonCol.appendChild(button);

    inputRow.appendChild(formCol);
    inputRow.appendChild(buttonCol);

    imageAndInput.appendChild(inputRow);


    container.appendChild(imageAndInput);
}