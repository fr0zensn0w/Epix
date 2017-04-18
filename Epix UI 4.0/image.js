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

function openPhoto() {
    // alert("open the gallery")
    // TODO: put code in here to open the gallery, AKA open up to where the images are stored
    // fullPath = "/Users/liquidsn0w/Desktop/"
    var fn = remote.getGlobal('sharedObj').imgname;
    var imgArr = fn.split("/")
    var imgName = (imgArr[imgArr.length-1]).replace("%20", " ")
    fullPath = `file://${__dirname}/Photos/`
    fullPath = __dirname + "/Photos/" + imgName
    // shell.beep() //makes a beeping sound
    shell.showItemInFolder(fullPath)
}

function deleteTag() {
    var tag = document.getElementById("tag").value

    var inBuff = fs.readFileSync('./database.sqlite')
    console.log("database found!")
    var db = new sql.Database(inBuff)

    var fn = remote.getGlobal('sharedObj').imgname;
    var imgArr = fn.split("/")
    var imgName = (imgArr[imgArr.length-1]).replace("%20", " ")

    try {
        db.run("DELETE FROM ImageTags WHERE imageName='" + imgName + "' AND tag='" + tag + "';")
    } catch (e) {
        console.log(e)
        console.log(db.exec("SELECT * FROM ImageTags WHERE imageName='" + imgName +"';"))
    }

    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    console.log(db.exec("SELECT * FROM ImageTags WHERE imageName='" + imgName +"';"))
    db.close()
    settingsDeleted()
}


function settingsSubmitted() {
    var alert = document.getElementById("alert-info")
    console.log("added tag to the database")
    var submitAlert = document.createElement('div')
    submitAlert.className = "alert alert-success"
    submitAlert.textContent = "Tag Saved"
    alert.appendChild(submitAlert)
}

function settingsDeleted() {
    var alert = document.getElementById("alert-info")
    console.log("Deleted tag from the database")
    var delAlert = document.createElement('div')
    delAlert.className = "alert alert-success"
    delAlert.textContent = "Tag Deleted"
    alert.appendChild(delAlert)
}


window.onload = function renderImage() {
    var fn = remote.getGlobal('sharedObj').imgname;
    var imgArr = fn.split("/")
    var imgName = (imgArr[imgArr.length-1]).replace("%20", " ")

    //put everything into this
    var container = document.getElementById("page-container")
    var alert = document.getElementById("alert-info")
    // console.log(alert)

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

    // var openDiv = document.createElement('div')
    // openDiv.id = "open-div"

    var openButton = document.createElement('button')
    openButton.textContent = 'Open on Computer'
    openButton.type = "button"
    openButton.className = "btn btn-sm btn-primary"
    openButton.style = "margin-left: 10px; width:150px"
    openButton.addEventListener('click', function() {
        openPhoto()
    });
    backDiv.appendChild(openButton)




    //div to hold image and tag input row
    var imageAndInput = document.createElement('div')
    imageAndInput.id = "image-and-input"

    console.log(imgName)
    var img = document.createElement('img');
    img.id = 'image-display'
    img.src = fn;
    img.style.width = '600px'
    img.style.height = '500px'
    // marg = ($(window).width() - 600 )/2
    // console.log(marg)
    // img.style.marginLeft = marg + "px"

    imageAndInput.appendChild(img);
    imageAndInput.appendChild(imageNameDiv);


    //input and submit button row and columns
    var inputRow = document.createElement('div')
    inputRow.className = "form-group row"
    inputRow.id = "tag-input"

    var formCol = document.createElement('div')
    formCol.className = "col-3"

    var submitButtonCol = document.createElement('div')
    submitButtonCol.className = "col-1"

    var deleteButtonCol = document.createElement('div')
    deleteButtonCol.className = "col-1"
    deleteButtonCol.style = "margin-left:50px"

    // document.body.appendChild(img);


    //input
    var form = document.createElement('form')
    var input = document.createElement('input')
    input.type = "text"
    input.className = "form-control"
    input.placeholder = "e.g. sunset"
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
        settingsSubmitted()
    })


    // document.body.appendChild(form);
    // document.body.appendChild(button);
    // document.body.appendChild(backButton);


    var delButton = document.createElement('button')

    delButton.type = "button"
    delButton.className = "btn btn-sm btn-primary"
    delButton.style = "margin-left: 10px;"

    delButton.textContent = 'Delete Tag'
    delButton.addEventListener('click', function() {
        deleteTag()
    })





    formCol.appendChild(form);
    submitButtonCol.appendChild(button);
    deleteButtonCol.appendChild(delButton);

    inputRow.appendChild(formCol);
    inputRow.appendChild(submitButtonCol);
    inputRow.appendChild(deleteButtonCol)

    imageAndInput.appendChild(inputRow);


    container.appendChild(imageAndInput);
}
