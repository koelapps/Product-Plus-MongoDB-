const expect = require('chai').expect;
const request = require('supertest');

const conn = require('../../../config/db.js');

const app = require('../../../server.js');

describe('Login Test Fields', () => {
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

  it('OK, Logged into the Account', (done) => {
    request(app)
      .post('/api/v1/login')
      .send({ email: 'asad@gmail.com', password: '12345' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, Invalid Credentials', (done) => {
    request(app)
      .post('/api/v1/login')
      .send({ email: 'asad14578@gmail.com', password: '12345' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('error');
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, Please provide an Email and Password', (done) => {
    request(app)
      .post('/api/v1/login')
      .send({ email: 'asad@gmail.com' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('error');
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });
});
