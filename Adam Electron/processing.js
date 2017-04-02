// pre processing file that is used by calling node from the command line


var fs = require('fs');

var firebase = require('firebase');
var FBconfig = {
    apiKey: "AIzaSyCHINhK-Q0M5FIALMGszJCZ-RDv-ptOAXE",
    authDomain: "epix-88a72.firebaseapp.com",
    databaseURL: "https://epix-88a72.firebaseio.com",
    storageBucket: "epix-88a72.appspot.com",
    messagingSenderId: "925958180304"
};
firebase.initializeApp(FBconfig);

var Storage = require('@google-cloud/storage');
var GCStorage = Storage({
    projectID: 'epix-88a72'
});

var ExifImage = require('exif').ExifImage;

console.log("hello")

var dataArray = []
var fileNames = []
var JSONarray = []

// try {
//     new ExifImage({ image : 'Photos/IMG_0091.JPG' }, function (error, exifData) {
//         if (error)
//             console.log('Error: '+error.message);
//         else
//             console.log(exifData); // Do something with your data!
//     });
// } catch (error) {
//     console.log('Error: ' + error.message);
// }


var fs = require( 'fs' );
var path = require( 'path' );
var process = require( "process" );

//currentDirectory = "C:/Users/liqui/Desktop/AutoSlideshow-master/AutoSlideshow-master/Photos"
//currentDirectory = "/Users/liquidsn0w/OneDrive\ -\ Georgia\ Institute\ of\ Technology/16th\ Grade/Spring\ 2017/Junior\ Design\ Part\ 2\ -\ CS\ 3312/AutoSlideshow/Adam\ Node/Photos"
// currentDirectory = "/Users/anthonybonitatibus/Documents/AutoSlideshow/Adam Node/Photos"
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
                    imgObj.FileName = file;
                    imgObj.GPSLatitude = exifData.gps['GPSLatitude']
                    imgObj.GPSLongitude = exifData.gps['GPSLongitude']
                    imgObj.Tags = "";
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
                        console.log("done!");
                    } else {
                        //////// UNCOMMENT FOR MY RATCHET CSV WRITING ///////////
                        // //make csv for testing purposes
                        // // var fields = ['ExposureTime', 'FNumber', 'ExposureProgram', 'ISO', 'ExifVersion','DateTimeOriginal','CreateDate','ComponentsConfiguration','ShutterSpeedValue','ApertureValue','BrightnessValue','ExposureCompensation','MeteringMode','Flash','FocalLength','SubjectArea'];
                        // var result = json2csv({ data: exifData.gps});
                        // console.log(result)
                        // result += ","
                        // fs.appendFile('data.csv', result, function(err) {
                        //     if (err) {
                        //         throw err;
                        //     } else {
                        //         console.log('file saved');
                        //     } 
                        // });

                    }
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        console.log(JSONarray);
        fs.appendFile('data.json', JSONarray, function(err) {
            if (err) {
                throw err;
            } else {
                //console.log('file saved');
            } 
            });
    })
})

//npm json2csv module
var json2csv = require('json2csv');


// console.log(dataArray)

function makeCSV() {
    // console.log("write to csv")
    var fields = ['FNumber', 'ISO', 'DateTimeOriginal', 'ExifImageWidth', 'ExifImageHeight'];
    try {

        for(i = 0; i < counter; i++) {
            // console.log("exif data for the first one", dataArray)
            // var result = json2csv({ data: dataArray[i].exif, fields: fields });
            var imgObj = new Object();
            imgObj.date = dataArray[i].exif['DateTimeOriginal'];
            imgObj.name = name;
            // console.log(result);
            //result += ","
            fs.appendFile('data.json', JSON.stringify(imgObj), function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log('file saved');
                } 
                });
        }
        
    } catch (err) {
    // Errors are thrown for bad options, or if the data is empty and no fields are provided. 
    // Be sure to provide fields if it is possible that your data array will be empty. 
    console.error(err);
    }
}

function uploadDB(fname) {
    var fpath = "Photos/" + fname;
    if (fname.includes('.')) {
        fname = fname.replace('.', '_');
    }
    
    var bucket = GCStorage.bucket('epix-88a72.appspot.com');
    bucket.upload(fpath, function(err, file) {
        if (!err) {
            console.log("Uploaded " + fname);
            try {
                firebase.database().ref(fname).set(fpath)
                    .then(function() { console.log("Sync success"); })
                    .catch(function(error) { console.log("Sync failed"); });
            } catch (err) {
                console.log("Error adding to database: " + err);
            }

        } else {
            console.log(err);
        }
    });
}






// var fields = ['field1', 'field2', 'field3'];
// var fields = ['field1', 'field2'];

// var myData = [{
//     "field1": 1,
//     "field2": 2,
//     "field3": 3
// }];

// try {
//   var result = json2csv({ data: myData, fields: fields });
//   console.log(result);
//   fs.writeFile('file.csv', result, function(err) {
//     if (err) {
//         throw err;
//     } else {
//         console.log('file saved');
//     } 
//     });
// } catch (err) {
//   // Errors are thrown for bad options, or if the data is empty and no fields are provided. 
//   // Be sure to provide fields if it is possible that your data array will be empty. 
//   console.error(err);
// }
