const express = require('express');
const app = express();
const port = 2005;

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
