import express from 'express';  // Replacing require with import
import path from 'path';        // Replacing require with import

const app = express();
const startTime = Date.now();

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => {
          res.sendFile(path.join(__dirname, 'index.html'));  // Use __dirname here
});

app.get('/status', (req, res) => {
          res.json({
                      status: 'OK',
                      uptime: `${(Date.now() - startTime) / 1000}s`
                    });
});

const server = app.listen(80, () => {
  console.log('App running on port 80');
});
export { server }; 
export default app;  // Exporting app as default
