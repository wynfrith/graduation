import should from 'should';
import QaService from "../../services/QaService";
import mongoose from "mongoose";
import Qa from "../../models/Qa"

describe.skip('qa service', () => {
  before(() => mongoose.connect('mongodb://localhost/newQA'));
  after(() => mongoose.connection.close());

  describe('query operate', () => {
    it('should return all questions', async () => {
      let questions = await QaService.getQuestions({});
      // console.log(questions);
      questions.length.should.equal(1);
    });
    it('should return questions brief', async () => {
      let questions = await QaService.getQuestions({
        fields: {tags: 1, answerNum: 1, views: 1, title: 1, author: 1, updatedAt: 1, createdAt: 1, like: 1, hate: 1}
      });
      questions.length.should.equal(1);
      should.not.exist(questions[0].type);
    });
  });



});