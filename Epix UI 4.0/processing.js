// processing file that is called by the electron handler in index.js
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
// console.log("hello I have been imported into gallery.js")
var path = require( 'path' );
var process = require( "process" );
var sql = require('sql.js').sql-memory-growth.js

var dataArray = []
var fileNames = []
var JSONarray = []


function getDayOfYear(year, month, day) {

    N1 = Math.floor(275 * month / 9)
    N2 = Math.floor((month + 9) / 12)
    N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3))
    N = N1 - (N2 * N3) + day - 30

    return N
}

// so the other page gallery.js can see this function wooot.
module.exports = {
    processPhotos: function() {
      parsePhotos()
    }
}
function parsePhotos() {
    currentDirectory = __dirname + "/Photos"
    var numberOfPhotos = []
    var counter = 0

    // var inBuff = fs.readFileSync('./database.sqlite')
    // console.log("database found!")
    // var db = new sql.Database(inBuff)

    // console.log(db.exec("SELECT * FROM Image;"))

    // db.run("INSERT INTO Image VALUES (\
    //             'first',\
    //             'Iphone',\
    //             'something',\
    //             6,\
    //             5,\
    //             'default',\
    //             4,\
    //             3,\
    //             1,\
    //             1,\
    //             1,\
    //             1,\
    //             1,\
    //             1,\
    //             1,\
    //             'urp',\
    //             'bleh',\
    //             'north',\
    //             'orb',\
    //             'west',\
    //             0,\
    //             1\
    //             );")



    fs.readdir(currentDirectory, function(err, files) {
        console.log("number of files = ", files.length)

        // var insStmt = db.prepare("INSERT INTO Image (imageName, Model, Make, ExposureTime, iso, Height, Width, Day, Month, Year, Second, Minute, Hour, DayoftheYear, GPSLatitude, GPSLatitudeRef, GPSLongitude, GPSLongitudeRef, GPSAltitude, GPSAltitudeRef) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

        files.forEach(function(file, index) {

            file2 = "Photos/" + file
            console.log(file2)
            try {
                var inBuff = fs.readFileSync('./database.sqlite')
                console.log("database found!")
                var db = new sql.Database(inBuff)

                var insStmt = "INSERT INTO Image VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"


                // Prepare an sql statement
                var stmt = db.prepare("SELECT COUNT(*) FROM Image WHERE imageName=:file");

                // Bind values to the parameters and fetch the results of the query
                var result = stmt.getAsObject({':file' : file});

                //console.log(result['COUNT(*)']);

                stmt.free();
                db.close()


            } catch (e) {
                console.log(e)
            }

            if (result['COUNT(*)'] == 0) {

                try {

                    new ExifImage({ image : file2 }, function (error, exifData) {
                        if (error) {
                            console.log('Error: '+error.message);
                        } else {

                            var inBuff = fs.readFileSync('./database.sqlite')
                            console.log("database found!")
                            var db = new sql.Database(inBuff)


                            var imgObj = new Object();
                            if (exifData.exif['DateTimeOriginal']) {
                                imgObj.DateTimeOriginal = exifData.exif['DateTimeOriginal'];
                                imgObj.TimeYear = parseInt(exifData.exif['DateTimeOriginal'].substring(0,4))
                                imgObj.TimeMonth = parseInt(exifData.exif['DateTimeOriginal'].substring(5,8))
                                imgObj.TimeDayofMonth = parseInt(exifData.exif['DateTimeOriginal'].substring(8,10))
                                imgObj.TimeOfDayHour = parseInt(exifData.exif['DateTimeOriginal'].substring(11,13))
                                imgObj.TimeOfDayMin = parseInt(exifData.exif['DateTimeOriginal'].substring(14,16))
                                imgObj.TimeOfDaySec = parseInt(exifData.exif['DateTimeOriginal'].substring(17,19))
                                imgObj.TimeDayOfYear = getDayOfYear(imgObj.TimeYear, imgObj.TimeMonth, imgObj.TimeDayofMonth)
                            } else {
                                imgObj.DateTimeOriginal = 0;
                                imgObj.TimeYear = 0
                                imgObj.TimeMonth = 0
                                imgObj.TimeDayofMonth = 0
                                imgObj.TimeOfDayHour = 0
                                imgObj.TimeOfDayMin = 0
                                imgObj.TimeOfDaySec = 0
                                imgObj.TimeDayOfYear = 0
                            }
                            imgObj.imageName = file;


                            imgObj.LensModel = (exifData.image['LensModel'] ? exifData.image['LensModel'] : 'unknown')
                            // Make (Apple)
                            imgObj.Make = (exifData.image['Make'] ? exifData.image['Make'] : 'unknown')
                            // Model (iPhone 7 Plus)
                            imgObj.Model = (exifData.image['Model'] ? exifData.image['Model'] : 'unknown')
                            // Exposure Time (fraction, DO NOT ROUND)
                            imgObj.Exposure = (exifData.exif['ExposureTime'] ? exifData.exif['ExposureTime'] : 0)
                            // ISO (20-16000 ish?)
                            imgObj.iso = (exifData.exif['ISO'] ? exifData.exif['ISO'] : 0)
                            // DateTimeOriginal - Above
                            ///// done see above
                            // UserComment - Added later in image.js file
                            imgObj.Tag = " default "
                            ///// Done see image.js
                            // ExifImageWidth
                            imgObj.Width = (exifData.exif['ExifImageWidth'] ? exifData.exif['ExifImageWidth'] : 0)
                            // ExifImageHeight
                            imgObj.Height = (exifData.exif['ExifImageHeight'] ? exifData.exif['ExifImageHeight'] : 0)
                            // LensModel (iPhone 7 Plus back iSight Duo)
                            imgObj.LensModel = (exifData.exif['LensModel'] ? exifData.exif['LensModel'] : 'unknown')
                            // GPSLatitude (Hours, Minutes, Seconds)
                            imgObj.GPSLatitude = (exifData.gps['GPSLatitude'] ? exifData.gps['GPSLatitude'] : 'unknown')
                            // GPSLatitudeRef (N S E W)
                            imgObj.GPSLatitudeRef = (exifData.gps['GPSLatitudeRef'] ? exifData.gps['GPSLatitudeRef'] : 'unknown')
                            // GPSLongitude (Hours, Minutes, Seconds)
                            imgObj.GPSLongitude = (exifData.gps['GPSLongitude'] ? exifData.gps['GPSLongitude'] : 'unknown')
                            // GPSLongitudeRef (N S E W)
                            imgObj.GPSLongitudeRef = (exifData.gps['GPSLongitudeRef'] ? exifData.gps['GPSLongitudeRef'] : 'unknown')
                            // GPSAltitude
                            imgObj.GPSAltitude = (exifData.gps['GPSAltitude'] ? exifData.gps['GPSAltitude'] : 0)
                            // GPSAltitudeRef (0 for above sea level, 1 for below sea level)
                            imgObj.GPSAltitudeRef = (exifData.gps['GPSAltitudeRef'] ? exifData.gps['GPSAltitudeRef'] : 0)

                            //console.log(imgObj)
                            db.run("INSERT INTO Image VALUES ('" +
                                                imgObj.imageName + "','" +
                                                imgObj.Model + "','" +
                                                imgObj.Make + "'," +
                                                imgObj.Exposure + "," +
                                                imgObj.iso + ",'" +
                                                imgObj.Tag + "'," +
                                                imgObj.Height + "," +
                                                imgObj.Width + "," +
                                                imgObj.TimeDayofMonth + "," +
                                                imgObj.TimeMonth + "," +
                                                imgObj.TimeYear + "," +
                                                imgObj.TimeOfDaySec + "," +
                                                imgObj.TimeOfDayMin + "," +
                                                imgObj.TimeOfDayHour + "," +
                                                imgObj.TimeDayOfYear + ",'" +
                                                imgObj.LensModel + "','" +
                                                imgObj.GPSLatitude + "','" +
                                                imgObj.GPSLatitudeRef + "','" +
                                                imgObj.GPSLongitude + "','" +
                                                imgObj.GPSLongitudeRef + "'," +
                                                imgObj.GPSAltitude + "," +
                                                imgObj.GPSAltitudeRef +
                                                ");")
                            var dbBinary = db.export()
                            var buff = new Buffer(dbBinary)
                            fs.writeFileSync("database.sqlite", buff)
                            db.close()
                            //console.log(ret)
                            // try {
                            //     db.run(insStmt,[imgObj.imageName, imgObj.Model, imgObj.Make, imgObj.Exposure, imgObj.iso, imgObj.Tag, imgObj.Height, imgObj.Width, imgObj.TimeDayofMonth, imgObj.TimeMonth, imgObj.TimeYear, imgObj.TimeOfDaySec, imgObj.TimeOfDayMin, imgObj.TimeOfDayHour, imgObj.TimeDayOfYear, imgObj.LensModel, imgObj.GPSLatitude, imgObj.GPSLatitudeRef, imgObj.GPSLongitude, imgObj.GPSLongitudeRef, imgObj.GPSAltitude, imgObj.GPSAltitudeRef]);
                            // } catch (e) {
                            //     console.log(e)
                            // }
                            console.log(db.exec("SELECT * FROM Image;"))
                        }

                    });
                } catch (error) {
                    console.log('Error: ' + error.message);
                }
                
            }
            var dbBinary = db.export()
            var buff = new Buffer(dbBinary)
            fs.writeFileSync("database.sqlite", buff)
            db.close()
            //insStmt.free()
            // var dbBinary = db.export()
            // var buff = new Buffer(dbBinary)
            // fs.writeFileSync("database.sqlite", buff)

        })
        // console.log(db.exec("SELECT * FROM Image;"))
        // insStmt.free()
    })
    // console.log(db.exec("SELECT * FROM Image;"))
    // console.log(db.exec("SELECT * FROM Image"))
    // var dbBinary = db.export()
    // var buff = new Buffer(dbBinary)
    // fs.writeFileSync("database.sqlite", buff)
}
