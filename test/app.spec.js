import app from '../app'
import supertest from 'supertest'

const request = supertest.agent(app.listen());

describe('Hello World', function () {
  it('should say "hello world"', function (done) {
    request
      .get('/')
      .expect(200,done)
  })
});



