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

        // new, DB method

        // first, get the database file
        var inBuff = fs.readFileSync('./database.sqlite')
        console.log("database found!")
        var db = new sql.Database(inBuff)
        console.log(db.exec("SELECT * FROM Image"))

        // prepare some statments, one to read the old tags, one to set the new ones
        var readTagStmt = "SELECT Tags FROM Image WHERE imageName=" + imgName + ";"
        var writeTagStmt = db.prepare("UPDATE Image SET Tags=:newTags WHERE imageName=:imgName;")

        // bind values for read
        //readTagStmt.bind({':imageName' : imgName})

        // read in old tags from DB using query
        var oldTags = db.exec(readTagStmt)
        console.log(oldTags)

        // concatenate with new tags
        var newTags = oldTags + tag + " ";
        console.log(newTags)

        // bind values for write
        writeTagStmt.bind({':imgName' : imgName, ':newTags' : newTags})

        // execute the query
        db.run(writeTagStmt)

        // free stmts
        readTagStmt.free()
        writeTagStmt.free()
        // old way using jsons
        // fs.readFile('./data.json', function(err, data) {
        //     var json = JSON.parse(data);
        //     // we should implement a more efficient search later
        //     var found = 0
        //     var i = 0
        //     while (!found && i < json.length) {
        //         console.log(json[i].FileName)
        //         console.log(imgName[imgName.length-1])
        //         var curImage = (imgName[imgName.length-1]).replace("%20", " ")
        //         if (json[i].FileName == curImage) {
        //             found = 1;
        //         } else {
        //             i++
        //         }
        //     }
        //     json[i].Tags = json[i].Tags + " " + tag
        //     fs.writeFileSync('data.json', JSON.stringify(json, null, 4));
        // })
    })
    document.body.appendChild(form);
    document.body.appendChild(button);
    document.body.appendChild(backButton);
}