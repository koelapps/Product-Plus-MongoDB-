const expect = require('chai').expect;
const request = require('supertest');

const conn = require('../../../config/db.js');

const app = require('../../../server.js');

describe('Register Test Fields', () => {
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

  it('OK, User Registered Successfully..!', (done) => {
    request(app)
      .post('/api/v1/register')
      .send({
        firstName: 'ahfghfghsad',
        lastName: 'mohafghfghfgmmad',
        email: 'asad123456@gmail.com',
        password: '12345',
        gender: 'male',
        dateOfBirth: '07/10/1998',
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, User with the given mail ID already exists', (done) => {
    request(app)
      .post('/api/v1/register')
      .send({
        firstName: 'ahfghfghsad',
        lastName: 'mohafghfghfgmmad',
        email: 'asad123456@gmail.com',
        password: '12345',
        gender: 'male',
        dateOfBirth: '07/10/1998',
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('error');
        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('Fail, Please add a valid email address', (done) => {
    request(app)
      .post('/api/v1/register')
      .send({
        firstName: 'ahfghfghsad',
        lastName: 'mohafghfghfgmmad',
        email: 'asad123456',
        password: '12345',
        gender: 'male',
        dateOfBirth: '07/10/1998',
      })
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
