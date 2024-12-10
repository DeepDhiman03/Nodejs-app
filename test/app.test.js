import request from 'supertest';
import { assert } from 'chai';
import app { server } from '../app.js';  // Ensure the import path is correct

describe('App Tests', () => {

  // Test GET /
  it('should return index.html on GET /', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  // Test GET /status
  it('should return JSON with status and uptime on GET /status', async () => {
          const response = await request(app).get('/status');
          // Update the regex to allow more than one digit after the decimal point
           assert.match(response.body.uptime, /^\d+\.\d+s$/);
          });
 
  after(() => {
    if (server) {
      server.close();  // Close the server to stop the app
    }
  });
  
});
