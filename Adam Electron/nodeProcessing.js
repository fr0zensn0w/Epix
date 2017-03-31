// processing file that is called by the electron handler in index.js
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
console.log("hello im in the nodeProcessing.js file")
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

function parsePhotos() {
    currentDirectory = __dirname + "/Photos"
    var numberOfPhotos = []
    var counter = 0

    fs.readdir(currentDirectory, function(err, files) {
        console.log("number of files = ", files.length)
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
                        console.log("day of the year", imgObj.TimeDayOfYear)
                        imgObj.FileName = file;
                        imgObj.GPSLatitude = exifData.gps['GPSLatitude']
                        imgObj.GPSLongitude = exifData.gps['GPSLongitude']
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