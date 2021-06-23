const expect = require('chai').expect;
const request = require('supertest');

const conn = require('../../../config/db.js');

const app = require('../../../server.js');

describe('News Test Fields', () => {
  before((done) => {
    conn
      .connectDB()
      .then(() => done())
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it('OK, Adding NewsFeed to the database', (done) => {
    request(app)
      .post('/api/v1/news/channel/follow')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng News pagination in page=1 with limit=10', (done) => {
    request(app)
      .get('/api/v1/news/channel/follow/feeds?page=1&limit=10')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng News pagination in page=2 with limit=10', (done) => {
    request(app)
      .get('/api/v1/news/channel/follow/feeds?page=2&limit=10')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng News pagination in page=1 with limit=5', (done) => {
    request(app)
      .get('/api/v1/news/channel/follow/feeds?page=1&limit=5')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        done();
      })
      .catch((err) => done(err));
  });
});
