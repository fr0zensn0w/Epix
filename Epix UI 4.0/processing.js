// processing file that is called by the electron handler in index.js
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
// console.log("hello I have been imported into gallery.js")
var path = require( 'path' );
var process = require( "process" );

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

    fs.readdir(currentDirectory, function(err, files) {
        console.log("number of files = ", files.length)

        // if the number of images is the same as the number in the db then don't process
        fs.readFile('./data.json', function(err, data) {
            var imgData = JSON.parse(data)
            if (imgData.length == files.length) {
              // dont need to process because its done
              return
            }
        })
        files.forEach(function(file, index) {
            // get number of photos in the folder
            // console.log(numberOfPhotos.push(index))
            // print out all the names of the files
            // console.log(file)
            // have to go to where the photos are.
            file2 = "Photos/" + file
            console.log(file2)
            try {

                new ExifImage({ image : file2 }, function (error, exifData) {
                    if (error) {
                        console.log('Error: '+error.message);
                    }
                    else {
                        // console.log(exifData); // Do something with your data!
                        // console.log((exifData))
                        counter++
                        //uploadDB(file);
                        //dataArray.push(exifData)
                        // console.log(counter)
                        var imgObj = new Object();
                        imgObj.DateTimeOriginal = exifData.exif['DateTimeOriginal'];
                        imgObj.TimeYear = parseInt(exifData.exif['DateTimeOriginal'].substring(0,4))
                        imgObj.TimeMonth = parseInt(exifData.exif['DateTimeOriginal'].substring(5,8))
                        imgObj.TimeDayofMonth = parseInt(exifData.exif['DateTimeOriginal'].substring(8,10))
                        imgObj.TimeOfDayHour = parseInt(exifData.exif['DateTimeOriginal'].substring(11,13))
                        imgObj.TimeOfDayMin = parseInt(exifData.exif['DateTimeOriginal'].substring(14,16))
                        imgObj.TimeOfDaySec = parseInt(exifData.exif['DateTimeOriginal'].substring(17,19))
                        imgObj.TimeDayOfYear = getDayOfYear(imgObj.TimeYear, imgObj.TimeMonth, imgObj.TimeDayofMonth)
                        // console.log("day of the year", imgObj.TimeDayOfYear)
                        imgObj.FileName = file;



                        // Make (Apple)
                        imgObj.Make = exifData.image['Make']
                        // Model (iPhone 7 Plus)
                        imgObj.Model = exifData.image['Model']
                        // Exposure Time (fraction, DO NOT ROUND)
                        imgObj.Exposure = exifData.exif['ExposureTime']
                        // ISO (20-16000 ish?)
                        imgObj.iso = exifData.exif['ISO']
                        // DateTimeOriginal - Above
                        ///// done see above
                        // UserComment - Added later in image.js file
                        ///// Done see image.js
                        // ExifImageWidth
                        imgObj.Width = exifData.exif['ExifImageWidth']
                        // ExifImageHeight
                        imgObj.Height = exifData.exif['ExifImageHeight']
                        // LensModel (iPhone 7 Plus back iSight Duo)
                        // imgObj.LensModel = exifData.exif['LensModel']
                        // GPSLatitude (Hours, Minutes, Seconds)
                        imgObj.GPSLatitude = exifData.gps['GPSLatitude']
                        // GPSLatitudeRef (N S E W)
                        imgObj.GPSLatitudeRef = exifData.gps['GPSLatitudeRef']
                        // GPSLongitude (Hours, Minutes, Seconds)
                        imgObj.GPSLongitude = exifData.gps['GPSLongitude']
                        // GPSLongitudeRef (N S E W)
                        imgObj.GPSLongitudeRef = exifData.gps['GPSLongitudeRef']
                        // GPSAltitude
                        imgObj.GPSAltitude = exifData.gps['GPSAltitude']
                        // GPSAltitudeRef (0 for above sea level, 1 for below sea level)
                        imgObj.GPSAltitudeRef = exifData.gps['GPSAltitudeRef']

                        //optional
                        // GPSDestBearingRef (T for true north, M for Magnetic North)
                        // GPSDestBearing (0-359.99 range. I think to tell degrees off of north



                        JSONarray.push(imgObj);
                        fs.writeFileSync('data.json', JSON.stringify(JSONarray, null, 4));
                        // fs.appendFile('data.json', JSON.stringify(imgObj), function(err) {
                        //     if (err) {
                        //         throw err;
                        //     } else {
                        //         //console.log('file saved');
                        //     }
                        //     });


                        if (files.length == counter) {
                            //makeCSV()
                            //console.log("make CSV file")
                            //console.log(exifData);
                            console.log(JSONarray)
                            console.log("done!");
                        } else {
                            //////// UNCOMMENT FOR MY RATCHET CSV WRITING ///////////
                        }
                    }
                });
            } catch (error) {
                console.log('Error: ' + error.message);
            }
            // console.log(JSONarray);
            fs.appendFile('data.json', JSONarray, function(err) {
                if (err) {
                    throw err;
                } else {
                    //console.log('file saved');
                }
                });
        })
    })
}
