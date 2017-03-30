// what is called from index.html to add the two buttons
// old preProcessing and node Processing


const remote = require('electron').remote
const main = remote.require('./main.js')

var button = document.createElement('button')

button.textContent = 'old preProcessing'

button.addEventListener('click', () => {
    // var window = remote.getCurrentWindow()
    // button to open preprocessing from old
    main.openWindow('preProcessing')
    // window.close() //close the old window
}, false)
document.body.appendChild(button)

//creating another button
var button2 = document.createElement('button')
button2.textContent = 'node processing'

button2.addEventListener('click', () => {
    // call the processing on the images from processing.js
    parsePhotos()
    console.log("node processing finished")
})
document.body.appendChild(button2)