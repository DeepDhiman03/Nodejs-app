import request from 'supertest';
import { assert } from 'chai';
import app, { server } from '../app.js';  

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
    assert.match(response.body.uptime, /^\d+\.\d+s$/);
  });

  
  after((done) => {
    if (server) {
      server.close(() => {
        done();  
      });
    } else {
      done();
    }
  });

});
