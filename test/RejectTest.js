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

describe('rejectTest', function () {
    let res_summary, res_detail, ins_id, ins_id_2;
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            res_summary = db.collection(summary_collection);
            res_detail = db.collection(detail_collection);
            await res_detail.deleteMany({});
            await res_summary.deleteMany({});
            await res_summary.insertOne({
                "week": 3,
                "day": 1,
                "teacher": 1000000,
                "available": [3, 7],
                "reserved": [1, 2, 4],
                "unavailable": [5, 6, 8]
              });
            let tmp_result = await res_detail.insertOne({
              "week": 3,
              "day": 1,
              "time": 1,
              "uid": 2017220301024,
              "title": "asd",
              "info": "asd",
              "reason": "asd",
              "remark": "asdasd",
              "status": "pending",
              "teacher": 1000000
            });
            let tmp_result_2 = await res_detail.insertOne({
              "week": 3,
              "day": 1,
              "time": 2,
              "uid": 2017220301024,
              "title": "asd",
              "info": "asd",
              "reason": "asd",
              "remark": "asdasd",
              "status": "accepted",
              "teacher": 1000000
            });
            ins_id = (tmp_result.insertedId).toString();
            ins_id_2 = (tmp_result_2.insertedId).toString();
        } catch (err) {
            throw err;
        }
    });

    it('rejectTest#1', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe0000";
      try {
        result = await tchmgr.Reject(oid, 1000000, 1000000);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });

    it('rejectTest#2', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe0000";
      try {
        result = await tchmgr.Reject(oid, 1000000, 1000001);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });

    it('rejectTest#3', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe0000";
      try {
        result = await tchmgr.Reject(oid, 1000000, "1000000");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('rejectTest#4', async function () {
      let result, catch_err;
      let oid = ins_id;
      try {
        result = await tchmgr.Reject(oid, 1000000, 1000000);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.equal(message.success);
      expect(catch_err).to.be.an("undefined");

      let detail_result;
      try {
        detail_result = await res_detail.find({ "week": 3, "day": 1, "time": 1 }).sort({}).toArray();
      } catch (err) {
        throw err;
      }

      expect(detail_result.length).to.be.equal(1);
      expect(detail_result[0].status).to.be.equal("rejected");

      let summary_result;
      try {
        summary_result = await res_summary.find({ "week": 3, "day": 1}).sort({}).toArray();
      } catch (err) {
        throw err;
      }

      expect(summary_result.length).to.be.equal(1);
      expect(summary_result[0].available).to.be.include(1);
      expect(summary_result[0].reserved).to.not.include(1);
    });

    it('rejectTest#5', async function () {
      let result, catch_err;
      let oid = ins_id;
      try {
        result = await tchmgr.Reject(oid, 1000000, 1000000);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.rejected);
    });

    it('rejectTest#6', async function () {
      let result, catch_err;
      let oid = ins_id_2;
      try {
        result = await tchmgr.Reject(oid, 1000000, 1000000);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.accepted);
    });

});
