const expect = require('chai').expect;
const request = require('supertest');

const conn = require('../../../config/db.js');

const app = require('../../../server.js');

describe('Poll Test Fields', () => {
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

  it('OK, Adding Poll to the Database', (done) => {
    request(app)
      .post('/api/v1/poll/createpoll')
      .send({
        question: 'Choose the Answer 19?',
        answer: [
          { text: 'A.35' },
          { text: 'B.44' },
          { text: 'C.20' },
          { text: 'D.19', isCorrect: true },
          { text: 'E.45' },
        ],
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

  it('Fail, Adding Empty Qusetion', (done) => {
    request(app)
      .post('/api/v1/poll/createpoll')
      .send({
        question: '',
        answer: [
          { text: 'A.35' },
          { text: 'B.44' },
          { text: 'C.20' },
          { text: 'D.19', isCorrect: true },
          { text: 'E.45' },
        ],
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

  it('Fail, Adding Empty Answer', (done) => {
    request(app)
      .post('/api/v1/poll/createpoll')
      .send({
        question: 'Choose the Answer 19?',
        answer: [
          { text: '' },
          { text: 'B.44' },
          { text: 'C.20' },
          { text: 'D.19', isCorrect: true },
          { text: 'E.45' },
        ],
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

  it('OK, Updating Poll using ID', (done) => {
    request(app)
      .put('/api/v1/poll/updatepoll')
      .send({
        id: '6093b51aafeb4851e002788e',
        question: 'Choose the Answer 45?',
        answer: [
          { text: 'A.34' },
          { text: 'B.35' },
          { text: 'C.20' },
          { text: 'D.26' },
          { text: 'E.45', isCorrect: true },
        ],
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

  it('Fail, Updating Poll using Invalid ID', (done) => {
    request(app)
      .put('/api/v1/poll/updatepoll')
      .send({
        id: '6093b51aafeb4851e002788',
        question: 'Choose the Answer 45?',
        answer: [
          { text: 'A.34' },
          { text: 'B.35' },
          { text: 'C.20' },
          { text: 'D.26' },
          { text: 'E.45', isCorrect: true },
        ],
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

  it('Fail, Updating Poll using null Value', (done) => {
    request(app)
      .put('/api/v1/poll/updatepoll')
      .send({
        id: '6093b51aafeb4851e002788e',
        question: 'Choose the Answer 45?',
        answer: [
          { text: '' },
          { text: 'B.35' },
          { text: 'C.20' },
          { text: 'D.26' },
          { text: 'E.45', isCorrect: true },
        ],
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

  it('OK, Deleting Poll using ID', (done) => {
    request(app)
      .delete('/api/v1/poll/deletepoll')
      .send({
        id: '60d0893f61eba15050b4050b',
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

  it('Fail, Deleting Poll using Invalid ID', (done) => {
    request(app)
      .delete('/api/v1/poll/deletepoll')
      .send({
        id: '60d07787419db3370cc14f29',
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

  it('OK, Saving poll response to user db', (done) => {
    request(app)
      .post('/api/v1/poll/pollresponse')
      .send({
        user_id: '60ce2afe8abc5606cc1b9db4',
        question_id: '60d07b9ce044c92390b00cfd',
        answer_id: '60d07b9ce044c92390b00d02',
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

  it('Fail, Saving poll response to user db with invalid userID', (done) => {
    request(app)
      .post('/api/v1/poll/pollresponse')
      .send({
        user_id: '60ce2afe8abc5606cc1b9db',
        question_id: '60d07b9ce044c92390b00cfd',
        answer_id: '60d07b9ce044c92390b00d02',
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

  it('Fail, Saving poll response to user db using invalid qusetionID', (done) => {
    request(app)
      .post('/api/v1/poll/pollresponse')
      .send({
        user_id: '60ce2afe8abc5606cc1b9db4',
        question_id: '60d07b9ce044c92390b00cf',
        answer_id: '60d07b9ce044c92390b00d02',
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

  it('OK, Gettng poll pagination in page=1 with limit=10', (done) => {
    request(app)
      .get('/api/v1/poll/polls?page=1&limit=10')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');

        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng poll pagination in page=1 with limit=2', (done) => {
    request(app)
      .get('/api/v1/poll/polls?page=1&limit=2')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');

        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng poll pagination in page=1 with limit=10', (done) => {
    request(app)
      .get('/api/v1/poll/polls?page=1&limit=10')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');

        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, Gettng poll pagination in page=2 with limit=10', (done) => {
    request(app)
      .get('/api/v1/poll/polls?page=1&limit=10')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('success');
        expect(body).to.contain.property('data');

        console.log(body);
        done();
      })
      .catch((err) => done(err));
  });
});
