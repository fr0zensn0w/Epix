var fs = require('fs');
var d3 = require('d3');
var ExifImage = require('exif').ExifImage;
var path = require('path');
var process = require('process');

var appDirectory = __dirname + "/Photos";

// allows us to upload an image, which is essentially just
// copying it to another folder on the same machine currently
// also extracts the exif data and updates the json

function uploadImage(fp) {
  // first, we need to read in the old json so we can append our new data
  var oldJSON
  d3.json("data.json", function(err, data) {
    if (err) throw err;
    oldJSON = data;

      // now we need to parse the new image for its exif data
    var exifSuccess = 0;
    try {
      new ExifImage({image : fp}, function(err, data) {
        if (err) throw err;
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
        // now we push it into the JSON array
        oldJSON.push(imgObj);
        fs.writeFileSync("data.json", JSON.stringify(oldJSON, null, 4));
        exifSuccess = 1;
      });
    } catch (error) {
      throw error;
    }
  });

  

  // if we actually got the exif data, we can save the image
  if (exifSuccess) {
    fs.readFile(fp, function(err, data) {
      if (err) throw err;
      var fpSplit = fp.split('/')
      var lastFP = fpSplit[fpSplit.length - 1]
      try {
        // we need to come up with a consistent and safe naming system for the files
        fs.writeFile("Photos/" + lastFP, data, function(err) {
          if (err) throw err;
        });
      }
    });
  } 
}

// a function to get all image names that have tags/exif

function getImages(slideshowSettings) {
  // split up our string of tags
  var tagStr = slideshowSettings.Tags;
  var images[]
  var tags = tagStr.split(' ')
  // now read in the JSON detailing all of the images
  d3.json("data.json", function(err, data) {
    if (err) throw err;
    var pushed = 0;
    for (i = 0; i < data.length; i++) {
      var imgTagStr = data[i].Tags;
      var imgTags = imgTagStr.split(' ');
      for (j = 0; j < imgTags.length; j++) {
        if (tags[i] == imgTags[j]) {
          images.push(data[i].FileName)
          j = imgTags.length
          pushed = 1;
        }
      }
      if (!pushed) {
        // we need to figure out how to effective check the exifs here
      }
    }
  });
  return images
}

// converts year, month, day to a discrete 'day of the year'

function getDayOfYear(year, month, day) {
    
    N1 = Math.floor(275 * month / 9)
    N2 = Math.floor((month + 9) / 12)
    N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3))
    N = N1 - (N2 * N3) + day - 30

    return N
}
