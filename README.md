## Release Notes Epix 1.0

New features
* Ability to create slideshows.
* Ability to use tags as a filtering criteria.
* Ability to use location with the map as a search criteria.
* Ability to use the date range picker to choose images only from a date range.
* Ability to select multiple search criteria to narrow down what photos are included
* Ability to sort by camera Make, Model and a photo's exposure time.
* Ability to Import photos
* Ability to add and remove tags from photos
* Ability to see tooltips on what the different filtering criteria were.

Missing Functionality
* Ability to edit an existing slideshow
* Deleting a slideshow
* Feedback on the create new slideshow page that you have chosen to filter by location


Know Bugs
* Errors out while making a slideshow that has no matched photos.
* packaged into an application (issues with packaging the database)


## Install Guide

To run our application you must have node.js installed. This can be found at [nodejs.org](nodejs.org).
To install and run use these commands when inside of the Epix UI 4.0 folder:
`npm install`
`npm start`

After the application is built the first time, only `npm start` needs to be run to start the application.

Packaging Instructions (not currently working)
`npm package-mac`
`npm package-win`
