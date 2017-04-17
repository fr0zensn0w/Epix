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

window.onload = function setupForm() {
    $(function() {

      $('input[name="datefilter"]').daterangepicker({
          autoUpdateInput: false,
          locale: {
              cancelLabel: 'Clear'
          }
      });

      $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
          $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      });

      $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
      });

    });

    var inBuff = fs.readFileSync('./database.sqlite')
    console.log("database found!")
    var db = new sql.Database(inBuff)

    var allMakes = db.exec("SELECT DISTINCT Make FROM Image;")
    var allModels = db.exec("SELECT DISTINCT Model FROM Image;")

    if (allMakes) {
        console.log(allMakes)
        var makeOpt = document.getElementById('make-options')
        for (i = 0; i < (allMakes[0].values).length; i++) {
            var opt = document.createElement('option')
            opt.text = allMakes[0].values[i][0]
            makeOpt.appendChild(opt)

        }
    }

    if (allModels) {
        console.log(allModels)
        var makeOpt = document.getElementById('model-options')
        for (i = 0; i < (allModels[0].values).length; i++) {
            var opt = document.createElement('option')
            opt.text = allModels[0].values[i][0]
            makeOpt.appendChild(opt)

        }
    }

    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    db.close()
}

function saveSlideshowSettings() {
    var inBuff = fs.readFileSync('./database.sqlite')
    console.log("database found!")
    var db = new sql.Database(inBuff)

    var tags = $('#tag').val()

    if (tags) {
        var splitTags = tags.split(',')
        for (i = 0; i < splitTags.length; i++){
            splitTags[i] = splitTags[i].trim()
        }
    }

    // get the name of the slideshow
    var name = $('#name').val()
    console.log(name)

    // get the today value if it's there, otherwise get year/month values
    var today = 0
    var month = null
    var year = null
    if ($('#day-checkbox').prop('checked')) {
        today = 1
    } else {
        month = $('#month').text()
        // console.log(month)
        year = null
    }


    // get the coordinate details
    var lat = null
    var lon = null
    var rad = null
    if (remote.getGlobal('sharedObj')) {
        var coordinates = remote.getGlobal('sharedObj').coordinates
        console.log(coordinates)
        lat = coordinates[0]
        lon = coordinates[1]
        rad = coordinates[2]
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
            today + "," +
            (month ? month : 'NULL') + "," +
            (year ? year : 'NULL') + "," +
            "NULL,NULL,NULL,NULL,NULL,NULL," +
            (lat ? lat : 'NULL') + "," +
            (lon ? lon : 'NULL') + "," +
            (rad ? rad : 'NULL') + ");"
        db.run(query)

        var tagQuery = ""
        if (splitTags) {
            for (i = 0; i < splitTags.length; i++) {
                tagQuery += "INSERT INTO SlideshowTags VALUES ('" +
                    name + "','" + splitTags[i] + "');"
            }
            db.run(tagQuery)
            console.log(db.exec("SELECT * FROM SlideshowTags"))
        }

    } catch (e) {
        console.log(e)
    }

    console.log(db.exec("SELECT * FROM ImageTags"))
    var dbBinary = db.export()
    var buff = new Buffer(dbBinary)
    fs.writeFileSync("database.sqlite", buff)
    db.close()
}
