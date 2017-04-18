const remote = require('electron').remote
const main = remote.require('./main.js')
const {shell} = require('electron')
const fs = require('fs')
const geo = require('geolib')


// function to see if a point is inside a given circle given
// center point and radius
function calculateInCircle(newLat, newLong, lat, long, radius) {
  return geo.isPointInCircle(
    {latitude: newLat, longitude: newLong},
    {latitude: lat, longitude: long}, radius
  );
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

function getSlideshowName() {
    return remote.getGlobal('sharedObj').SSN
}

exports.getSlideshowImages = (db, ssn) => {
    var slideshowName = ssn
    console.log("Slideshow Name " + slideshowName)

    console.log("All the data from the image database",db.exec("SELECT * FROM Image;"))

    var settings = db.exec("SELECT * FROM Slideshow WHERE slideshowName='" + slideshowName + "';")
    console.log(settings)

    var checkTags = db.exec("SELECT COUNT(*) FROM SlideshowTags WHERE slideshowName='" + slideshowName + "';")
    var query
    console.log(checkTags[0].values[0][0])
    if (checkTags[0].values[0][0] < 1) {
        query = "   SELECT * \
                    FROM Image AS i \
                    WHERE "
    } else {
        query = "   SELECT i.imageName, i.Model, i.Make, i.LensModel, \
                        i.ExposureTime, i.iso, i.Height, i.Width, i.Month, \
                        i.Year, i.DayoftheYear, i.GPSLatitude, i.GPSLongitude \
                        FROM Image AS i \
                        INNER JOIN ( \
                            SELECT it.imageName \
                            FROM ImageTags AS it \
                            INNER JOIN ( \
                                SELECT * \
                                FROM SlideshowTags \
                                WHERE slideshowName='" + slideshowName + "' \
                                ) AS sst ON sst.tag=it.tag \
                            ) AS iwt ON iwt.imageName=i.imageName \
                            WHERE "
    }

    // select by model
    if (settings[0].values[0][1]) {
      query += "(i.Model='" + settings[0].values[0][1] + "')  AND  "
    }

    // select by make
    if (settings[0].values[0][2]) {
      query += "(i.Make='" + settings[0].values[0][2] + "')  AND  "
    }

    // select by today within range
    if (settings[0].values[0][4]) {
      var date = new Date()
      var endDayOfYearMS
      var startDayOfYear
      dateMS = date.getTime()
      endDayOfYearMS = (dateMS % 31556952000) / 86400000
      endDayOfYearMS = parseInt(endDayOfYearMS, 10)
      endDayOfYearMS++

      startDayOfYear = endDayOfYearMS - settings[0].values[0][4]
      query += "(i.DayoftheYear BETWEEN " + startDayOfYear + "  AND  " +
         + endDayOfYearMS + ")  AND  "
    }

    // select by month
    if (settings[0].values[0][5]) {
      query += "(i.Month=" + settings[0].values[0][5] + ")  AND  "
    }

    // select by specific date range
    if (settings[0].values[0][8] && settings[0].values[0][11]) {
      query += "(i.DayoftheYear BETWEEN " + settings[0].values[0][8] +
        "  AND  " + settings[0].values[0][11] + ")  AND  "
    }

    query = query.substring(0, (query.length - 7)) + ";"

    // console.log("Car tags:")
    // console.log(db.exec("SELECT ImageTags.imageName FROM ImageTags INNER JOIN SlideshowTags ON ImageTags.Tag=car;"))

    console.log(query)

    var correctImages = []
    var imageQuery = (db.exec(query))
    if (imageQuery[0]) {
        var images = imageQuery[0].values
        // filter through images and if they are in the GPS coords then leave them
        // if not then take them out
        // check settings to see if GPS coords are there first
        // console.log("gps coords present? ", settings[0].values[0][13])
        // if the GPS coords are present, do the processing
        if (settings[0].values[0][13] != null) {
            requestedLat = settings[0].values[0][12]
            requestedLong = settings[0].values[0][13]
            requestedRadius = settings[0].values[0][14]
            console.log("slideshow settings",settings[0])
            console.log("requested coordinates + radius", requestedLat, requestedLong, requestedRadius)
            // the settings for this slideshow contain radius and GPS coords
            for (i = 0; i < images.length; i++) {
                // console.log(images[i][11])
                lat = images[i][11]
                long = images[i][12]
                // console.log("lat and long for image", lat, long)
                var inRadius = calculateInCircle(lat, long, requestedLat, requestedLong, requestedRadius)
                // console.log(inRadius)

                // check to see if the coordinates are in the requested
                if (inRadius == true) {
                    correctImages.push(images[i])
                    console.log("image is in the radius", images[i][0])
                }
            }
        } else {
            for (i = 0; i < images.length; i++) {
                correctImages.push(images[i])
            }
        }

    } else {
        correctImages = null
    }






    // var dbBinary = db.export()
    // var buff = new Buffer(dbBinary)
    // fs.writeFileSync("database.sqlite", buff)
    // db.close()

    // console.log("Correct images " + correctImages)

    return correctImages
}
