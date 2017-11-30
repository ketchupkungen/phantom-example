const express = require('express');
const app = express();

app.use(express.static(__dirname + '/www',{extensions:['.html']}));

app.listen(3004, function () {
  console.log('Webserver listening on port 3004');
});