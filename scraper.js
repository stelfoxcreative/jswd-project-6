//Import required modules
const fs = require('fs');
//https://github.com/matthewmueller/x-ray
const Xray = require('x-ray');
const x = Xray();
//https://github.com/zemirco/json2csv
const json2csv = require('json2csv');
//Set website to crawl
const website = 'http://www.shirts4mike.com/shirts.php';
//Setup folder and files names
const directory = './data';
const fileName = new Date().toJSON().slice(0,10);
const fields = ['Title', 'Price', 'ImgURL', 'URL', 'Time'];

//Check if the data folder exists, if not create it
if (!fs.existsSync(directory)) fs.mkdirSync(directory);

//webScraper function using the x-ray library
!(function webScraper() {
  x(website, '.products li', [{
    Title: x('a@href', 'title'),
    Price: x('a@href', '.price'),
    ImgURL: x('a@href', '.shirt-picture img@src'),
    URL: 'a@href'
  }])
  ((err, data) => {
    if(!err){
      //Add date/time stamp to each item
      for (let item of data) item.Time = new Date();
      //Convert JSON to CSV Format
      let csv = json2csv({ data, fields });
      //Write contents to a CSV file
      fs.writeFile(`${directory}/${fileName}.csv`, csv, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    } else if (err.code === 'ENOTFOUND') {
      console.log(`Cannot connect, please try again later. Error code - ${err.code}`);
    } else {
      console.log(`An error has occured, please try again later. Error code - ${err.code}`);
    }
  })
})();
