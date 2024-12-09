const express = require('express');
const app = express();
const startTime = Date.now();


app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    uptime: `${(Date.now() - startTime) / 1000}s`
  });
});

app.listen(80, () => console.log('App running on port 80'));
