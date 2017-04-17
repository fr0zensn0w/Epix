// what is called from index.html to add the two buttons
// old preProcessing and node Processing

// TODO REMOVE ALL OF THIS, JUST COPIED OVER FROM ANOTHER FILE

const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')
const path = require('path')
const sql = require('sql.js')



// TODO put functions here that handle what goes on in the create new slideshow page
// All buttons should be placed in the newSlideshow.html file
function openMap() {
    window = remote.getCurrentWindow()
    main.openWindow("map")
    setTimeout(function() {window.close}, 1700)
}


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

function saveSlideshowSettings() {
    var inBuff = fs.readFileSync('./database.sqlite')
    console.log("database found!")
    var db = new sql.Database(inBuff)
        

    var today = $('#day-checkbox').prop('checked')
    if(today) {
        console.log('today')
    }
    var tags = $('#tag').val()

    if (tags) {
        var splitTags = tags.split(',')
        for (i = 0; i < splitTags.length; i++){
            splitTags[i] = splitTags[i].trim()
        }
    }

    var name = $('#name').val()
    console.log(name)
    var month = null
    if (!today) {
        month = $('#month').text()
        console.log(month)
    }
    var year = null
    var lat = null
    var lon = null
    var rad = null
    var coordinates = remote.getGlobal('sharedObj').coordinates
    if (location.length < 4) {
        console.log(location)
        lat = location[0]
        lon = location[1]
        rad = location[2]
    }
    var make = $('#make-picker option:selected').text()
    console.log(make)
    var model = $('#model-picker option:selected').text()
    var exp = null


    try {
        var query = "INSERT INTO Slideshow VALUES ('" +
            name + "'," +
            (model ? ("'" + model + "'") : 'NULL') + "," +
            (make ? ("'" + make + "'") : 'NULL') + "," +
            "NULL,NULL,NULL,NULL,NULL,NULL,NULL," +
            (lat ? lat : 'NULL') + "," +
            (lon ? lon : 'NULL') + "," +
            (rad ? rad : 'NULL') + ");"
        db.run(query)

        var tagQuery = ""
        for (i = 0; i < splitTags.length; i++) {
            tagQuery += "INSERT INTO SlideshowTags VALUES ('" +
                name + "','" + splitTags[i] + "');"
        }
        db.run(tagQuery)
        console.log(db.exec("SELECT * FROM SlideshowTags"))

    } catch (e) {
        console.log(e)
    }

    
    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    // console.log(db.exec("SELECT * FROM Slideshow;"))
    db.close()
    // var dateStart = document.getElementById('date-start')
    // var dateEnd = document.getElementById('date-end')
    

    
    // we probably don't need this anymore
    // fs.stat('./settings.json', function(err, stat) {
    //     if (err == null) {
    //         fs.readFile('./settings.json', function(err, data) {
    //             json = JSON.parse(data);
    //             json.push(ssObj);
    //             fs.writeFileSync('settings.json', JSON.stringify(json, null, 4));
    //         })
    //     } else {
    //         json.push(ssObj)
    //         fs.writeFileSync('settings.json', JSON.stringify(json, null, 4));
    //     }
    // });
}
