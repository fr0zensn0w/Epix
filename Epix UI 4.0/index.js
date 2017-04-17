// what is called from index.html to add the two buttons
// old preProcessing and node Processing

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')
const sql = require('sql.js')
const ssHandler = require('./slideshow')

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

function loadDatabase() {
    try {
        //https://github.com/kripken/sql.js/
        var inBuff = fs.readFileSync('./database.sqlite')
        // console.log("database found!")
        var db = new sql.Database(inBuff)
    } catch (e) {
        // console.log(e)
        // console.log("database not found");
        var db = new sql.Database();
        var sqlStr = "CREATE TABLE Image (\
                imageName varchar(255) NOT NULL,\
                Model varchar(255),\
                Make varchar(255),\
                LensModel varchar(255),\
                ExposureTime int,\
                iso int,\
                Height int,\
                Width int,\
                Month int,\
                Year int,\
                DayoftheYear int,\
                GPSLatitude float,\
                GPSLongitude float,\
                PRIMARY KEY (imageName)\
            );"
        db.run(sqlStr);
        sqlStr = "CREATE TABLE Slideshow (\
                slideshowName varchar(255) NOT NULL,\
                Model varchar(255),\
                Make varchar(255),\
                ExposureTime int,\
                Today int,\
                Month int,\
                Year int,\
                StartMonth int,\
                StartYear int,\
                StartDayoftheYear int,\
                EndMonth int,\
                EndYear int,\
                EndDayoftheYear int,\
                GPSLatitude float,\
                GPSLongitude float,\
                GPSRadius float,\
                PRIMARY KEY (slideshowName)\
            );"
        db.run(sqlStr)
        sqlStr = "CREATE TABLE ImageTags (\
                imageName varchar(255) NOT NULL,\
                tag varchar(255) NOT NULL,\
                PRIMARY KEY (imageName, tag)\
            );"
        db.run(sqlStr)
        sqlStr = "CREATE TABLE SlideshowTags (\
                slideshowName varchar(255) NOT NULL,\
                tag varchar(255) NOT NULL,\
                PRIMARY KEY (slideshowName, tag)\
            );"
        db.run(sqlStr)
        sqlStr = "INSERT INTO Slideshow (slideshowName, Today)\
            VALUES ('Default', 7);"
        db.run(sqlStr)
        var dbBinary = db.export()
        var buff = new Buffer(dbBinary)
        fs.writeFileSync("database.sqlite", buff)

    }
    db.close()
}

// this function should load images into the frames for the slideshows
window.onload = function populateImages() {
    loadDatabase()

    var inBuff = fs.readFileSync('./database.sqlite')
    console.log("database found!")
    var db = new sql.Database(inBuff)


    var allSettings = db.exec("SELECT * FROM Slideshow")
    console.log(allSettings)
    var deck = document.getElementById("card-deck")
    console.log(allSettings[0].values.length)
    for (j = 0; j < allSettings[0].values.length; j++) {
        console.log('creating card')
        console.log(allSettings[0].values[j])
        var div = document.createElement("div")
        var img = document.createElement("img")

        div.className = "card card-default"


        img.style.height = '250px'
        img.style.width = '350px'
        img.id = allSettings[0].values[j][0]

        var imgName = (ssHandler.getSlideshowImages(db, img.id))

        if (imgName) {
            img.src = 'Photos/' + imgName[0][0]
        } else {
            img.src = 'http://placehold.it/350x250'
        }
        
        img.className = "card-img-top img-fluid w-100"


        img.addEventListener('click', function(e) {
            openSelectedSlideshow(e.path[0].id);
        })
        var cardBlock = document.createElement('div')
        cardBlock.className = "card-block"

        //Card title
        var h4 = document.createElement("h4")
        h4.textContent = img.id
        h4.className = "card-title"

        // //Card tags
        // var p = document.createElement("p")
        // // p.textContent = "Tags: "
        // // p.className = "card-text"

        cardBlock.appendChild(h4)
        // cardBlock.appendChild(p)

        console.log("Appending stuff " + j)
        div.appendChild(img)
        div.appendChild(cardBlock)
        deck.appendChild(div)
    }

    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    db.close()

}


