const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route to render the HTML file
app.get('/', (req, res) => {
  const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp - 273.15)); 
    temperature = temperature.replace("{%tempmin%}", Math.round(orgVal.main.temp_min - 273.15));
    temperature = temperature.replace("{%tempmax%}", Math.round(orgVal.main.temp_max - 273.15));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
  };




  const fs = require('fs');
  const homeFile = fs.readFileSync('public/home.html', 'utf-8');

  const requests = require('requests');
  requests("https://api.openweathermap.org/data/2.5/weather?q=haldia&appid=886705b4c1182eb1c69f28eb8c520e20")
    .on("data", (chunk) => {
      const objData = JSON.parse(chunk);
      const arrData = [objData];
      const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join();
      res.send(realTimeData);
    })
    .on("end", function (err) {
      if (err) return console.log("Connection closed due to error");
      res.end();
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

