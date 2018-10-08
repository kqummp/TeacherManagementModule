const tchmgr = require('../index.js');

const expect = require('chai').expect;

describe('diffTest', function(){
  it('diffTest#1', function(){
    let raw = [1, 2, 3, 4, 5, 6, 7, 8];
    let target = [2, 3, 5];
    let result = tchmgr.Diff(raw, target);

    expect(result).to.be.eql([1, 4, 6, 7, 8]);
    expect(result).to.not.include(2);
    expect(result).to.not.include(5);
    expect(result).to.not.include(3);
  });

  it('diffTest#2', function(){
    let raw = [1, 3, 6, 8, 2, 5];
    let target = [2, 3, 5];
    let result = tchmgr.Diff(raw, target);

    expect(result).to.be.eql([1, 6, 8]);
    expect(result).to.not.include(2);
    expect(result).to.not.include(5);
    expect(result).to.not.include(3);
  });

  it('diffTest#3', function(){
    let raw = [1, 3, 6, 8, 2, 5];
    let target = [];
    let result = tchmgr.Diff(raw, target);

    expect(result).to.be.eql([1, 3, 6, 8, 2, 5]);
  });

  it('diffTest#4', function(){
    let raw = [];
    let target = [];
    let result = tchmgr.Diff(raw, target);

    expect(result).to.be.eql([]);
  });
});
