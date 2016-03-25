/**
 * Created by wyn on 3/25/16.
 */

import chai from 'chai'
import mongoose from 'mongoose'
import Tag from '../../models/Tag'

const assert = chai.assert;

describe('test tag', () => {
  before(async () => {
    mongoose.connect('mongodb://localhost/newQA');
    await Tag.remove({});
  });
  after(async () => mongoose.connection.close());
  
  it('should create parent tags', async () => {
    let python = new Tag({
      name: 'python',
      memo: 'python是一门简单的语言'
    });
    let ruby = new Tag({
      name: 'ruby',
      memo: 'ruby是一门优美的语言'
    });
    let javascript = new Tag({
      name: 'javascript',
      memo: 'javascript是一门坑爹的语言'
    });
    
    try {
      await Promise.all([
        python.save(),
        ruby.save(),
        javascript.save()
      ]);
    } catch(err) {
      throw err;
    }
    
  });
  
  it('should create create child tags', async () => {
    let javascript = await Tag.find({ name: 'javascript' });
    
    let koa = new Tag({
      name: 'koa',
      memo: 'koa是javascript的一个简单的web框架',
      parentId: javascript._id
    });
    
    let express = new Tag({
      name: 'express',
      memo: 'express是一个js的web框架, 模仿ruby的sinatra'
    });
    
    try {
      await Promise.all([
        koa.save(),
        express.save()
      ]);
    } catch (err) {
      throw err;
    }
    
  })
});