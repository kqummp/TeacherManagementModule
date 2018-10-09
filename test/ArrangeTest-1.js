const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const summary_collection = "reserve_summary";
const detail_collection = "reserve_detail";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const tchmgr = require('../lib/tchmgr');

describe('arrangeTest-1', function () {
    let res_summary;
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            res_summary = db.collection(summary_collection);
            await res_summary.deleteMany({});
        } catch (err) {
            throw err;
        }
    });

    it('arrangeTest-1#1', async function () {
      let result, catch_err;
      try {
        result = await tchmgr.Arrange();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('arrangeTest-1#2', async function () {
      let result, catch_err;
      try {
        result = await tchmgr.Arrange(1000000);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#3', async function () {
      let result, catch_err;
      let data = {};
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#4', async function () {
      let result, catch_err;
      let data = {};
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#5', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": "1",
        "available": [1, 2, 3]
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#6', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "available": "123"
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#7', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": "$ne: 1",
        "available": [1, 2, 3]
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('arrangeTest-1#8', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "available": [1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10]
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.out_of_range);
    });

    it('arrangeTest-1#9', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "available": [1, 2, 10]
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.out_of_range);
    });

    it('arrangeTest-1#10', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "available": [1, 2, 10, 0]
      };
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.out_of_range);
    });


    it('arrangeTest-1#11', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "available": [1, 3, 5, 7]
      }
      try {
        result = await tchmgr.Arrange(1000000, data);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.equal(message.success);
      expect(catch_err).to.be.an("undefined");

      let summary_result;
      try {
        summary_result = await res_summary.find({ "week": 3, "day": 1}).sort({}).toArray();
      } catch (err) {
        throw err;
      }

      expect(summary_result.length).to.be.equal(1);
      expect(summary_result[0].available).to.be.eql([1, 3, 5, 7]);
      expect(summary_result[0].unavailable).to.be.eql([2, 4, 6, 8]);
      expect(summary_result[0].teacher).to.be.equal(1000000);
    });

});
