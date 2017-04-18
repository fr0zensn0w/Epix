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

// exports.coordAdded = () => {
//     coordinatesAdded()
// }

// module.exports = {
//     coordAdded: function() {
//       coordinatesAdded()
//     }
// }

function coordinatesAdded() {
    document.getElementById('gps-added').textContent = "GPS Coordinates Added!"
}

function getDayOfYear(year, month, day) {

    N1 = Math.floor(275 * month / 9)
    N2 = Math.floor((month + 9) / 12)
    N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3))
    N = N1 - (N2 * N3) + day - 30

    return N
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

function formValidation() {
    if ($('#name').val() == "") {
        alert("Please include a name for the slideshow")
        return false
    } else {
        return true
    }
}

function saveSlideshowSettings() {
    if (formValidation()) {
        var inBuff = fs.readFileSync('./database.sqlite')
        console.log("database found!")
        var db = new sql.Database(inBuff)

        var tags = $('#tag').val()
        var splitTags = null
        if (tags) {
            splitTags = tags.split(',')
            for (i = 0; i < splitTags.length; i++){
                splitTags[i] = splitTags[i].trim()
            }
        }

        // get the name of the slideshow
        var name = $('#name').val()
        console.log(name)

        // get the today value if it's there, otherwise get year/month values
        var today = null
        var month = null
        // var year = null

        if ($('#day-radio').prop('checked') && $('#day').val()) {
            today = $('#day').val()
        }

        // grab the date range
        var startMonth = null
        var startYear = null
        var startDayoftheYear = null
        var endMonth = null
        var endYear = null
        var endDayoftheYear = null
        if ($('#range-radio').prop('checked') && $('#date-range').val()) {
            var dateRange = (($('#date-range').val()).replace(' - ', '/')).split('/')
            startDayoftheYear = getDayOfYear(parseInt(dateRange[2]), parseInt(dateRange[0]), parseInt(dateRange[1]))
            endDayoftheYear = getDayOfYear(parseInt(dateRange[5]), parseInt(dateRange[3]), parseInt(dateRange[4]))
            startYear = parseInt(dateRange[2])
            endYear = parseInt(dateRange[5])
            startMonth = parseInt(dateRange[0])
            endMonth = parseInt(dateRange[3])
        }

        // get specific month
        if ($('#month-radio').prop('checked')) {
            switch($('#month option:selected').text()) {
                case 'January': month = 1; break;
                case 'February': month = 2; break;
                case 'March': month = 3; break;
                case 'April': month = 4; break;
                case 'May': month = 5; break;
                case 'June': month = 6; break;
                case 'July': month = 7; break;
                case 'August': month = 8; break;
                case 'September': month = 9; break;
                case 'October': month = 10; break;
                case 'November': month = 11; break;
                case 'December': month = 12; break;
                default: break;
            }
        }


        var exp = null
        if ($('#exp-picker option:selected').text() == 'Less than 1.0') {
            exp = 0
        } else if ($('#exp-picker option:selected').text() == 'More than 1.0') {
            exp = 1
        }

        var make = null
        if ($('#make-picker option:selected').text()) {
            make = $('#make-picker option:selected').text()
        }

        var model = null
        if ($('#model-picker option:selected').text() != "") {
            model = $('#model-picker option:selected').text()
        }


        // get the coordinate details
        var lat = null
        var lon = null
        var rad = null
        if (remote.getGlobal('sharedObj') && remote.getGlobal('sharedObj').coordinates) {
            var coordinates = remote.getGlobal('sharedObj').coordinates
            console.log(coordinates)
            lat = coordinates[0]
            lon = coordinates[1]
            rad = coordinates[2]
        }

        // console.log("Tags: ", tags)
        // console.log("Split Tags: ", splitTags)
        // console.log("Today: ", today)
        // console.log("Month: ", month)
        // console.log("startMonth: ", startMonth)
        // console.log("startYear: ", startYear)
        // console.log("startDayoftheYear: ", startDayoftheYear)
        // console.log("endMonth: ", endMonth)
        // console.log("endYear: ", endYear)
        // console.log("endDayoftheYear: ", endDayoftheYear)
        // console.log("Make: ", make)
        // console.log("Model: ", model)
        // console.log("Exposure: ", exp)
        // console.log("Lat: ", lat)
        // console.log("Lon: ", lon)
        // console.log("Rad: ", rad)
        


        try {
            var query = "INSERT INTO Slideshow VALUES ('" +
                name + "'," +
                (model ? ("'" + model + "'") : 'NULL') + "," +
                (make ? ("'" + make + "'") : 'NULL') + "," +
                (exp ? exp : 'NULL') + "," +
                (today ? today : 'NULL') + "," +
                (month ? month : 'NULL') + "," +
                ('NULL') + "," +
                (startMonth ? startMonth : 'NULL') + "," +
                (startYear ? startYear : 'NULL') + "," +
                (startDayoftheYear ? startDayoftheYear : 'NULL') + "," +
                (endMonth ? endMonth : 'NULL') + "," +
                (endYear ? endYear : 'NULL') + "," +
                (endDayoftheYear ? endDayoftheYear : 'NULL') + "," +
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

        // console.log(db.exec("SELECT * FROM ImageTags"))
        var dbBinary = db.export()
        var buff = new Buffer(dbBinary)
        fs.writeFileSync("database.sqlite", buff)
        db.close()
    }
}
