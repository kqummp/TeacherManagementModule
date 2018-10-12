"use strict";
/**
 ** TeacherManagement Module
 **
 ** @version 0.0.1
 **
 */

const url = "mongodb://localhost:27017";

const kqudie = require('kqudie')(url);

const filter = require('filter');

const encrypt = require('encryptor');

const message = require('./message');

const database = "kqummp";

const tch_collection = "tch_userinfo";

const reserve_summary = "reserve_summary"

const reserve_detail = "reserve_detail";

const max_classes = 8;

const min_classes = 1;

const raw_array = [1, 2, 3, 4, 5, 6, 7, 8];

var tchmgr = module.exports;


/**
 ** Login
 **
 ** @param uid
 ** @param passwd
 **
 */

tchmgr.Login = async function(uid, passwd){
  if (typeof uid === "undefined" || typeof passwd === "undefined" || passwd === "") {
    throw new Error(message.uid_or_password_invalid); //using err.message to get message
  }

  if (!(filter.judgeNumber(uid) && filter.filter(passwd))) {
    throw new Error(message.uid_or_password_invalid);
  }

  let encrypted = encrypt.encrypt(passwd);
  let query = {
    "uid": uid,
    "passwd": encrypted
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, tch_collection, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 1) {
    return message.success;
  } else {
    throw new Error(message.uid_or_password_error);
  }
}

/**
 ** ResetPassword
 **
 ** @param uid
 ** @param old_passwd
 ** @param new_passwd
 ** @param new_passwd_r
 **
 */

tchmgr.ResetPassword = async function(uid, old_passwd, new_passwd, new_passwd_r){
  if (typeof uid === "undefined" || typeof new_passwd === "undefined" ||
    new_passwd_r === "" || typeof old_passwd === "undefined" ||
    typeof new_passwd === "undefined" || typeof new_passwd_r == "undefined" ||
    new_passwd === "" || new_passwd_r === "") {
    throw new Error(message.uid_or_password_invalid);
  }

  if (!(filter.judgeNumber(uid) && filter.filter(old_passwd) &&
    filter.filter(new_passwd) && filter.filter(new_passwd_r))) {
    throw new Error(message.uid_or_password_invalid);
  }
  if (new_passwd !== new_passwd_r) {
    throw new Error(message.repeat_not_same);
  }

  let encrypted = encrypt.encrypt(old_passwd);
  let query = {
    "uid": uid,
    "passwd": encrypted
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, tch_collection, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.uid_or_password_error);
  }

  if (result[0].passwd === encrypt.encrypt(new_passwd)){
    throw new Error(message.not_modified);
  }

  let update_query = {
    "_id": result[0]._id
  };
  let new_encrypted = encrypt.encrypt(new_passwd);
  let update_json = {
    "uid": uid,
    "passwd": new_encrypted
  };

  let update_result;
  try {
    update_result = await kqudie.update(database, tch_collection, update_query, update_json);
  } catch (err) {
    throw err;
  }

  if (update_result.result.nModified === 1) {
    return message.success;
  } else {
    throw new Error(message.database_error);
  }
}

/**
 ** Query
 **
 ** @param week
 **
 */

tchmgr.Query = async function (week, session_user){
  if (typeof week === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (!(filter.judgeNumber(week) && filter.filter(week))) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "week": week,
    "teacher": session_user
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_summary, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.invalid_field);
  } else {
    let return_data = {
      "message": message.success,
      "data": result
    };

    return return_data;
  }
}

/**
 ** QueryList
 **
 ** @param uid
 ** @param session_user
 **
 */

tchmgr.QueryList = async function (uid, session_user){
  if (typeof uid === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  let query = {
    "teacher": uid
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.invalid_field);
  } else {
    let return_data = {
      "message": message.success,
      "data": result
    };

    return return_data;
  }
}

/**
 ** QueryByReserveId
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

tchmgr.QueryByReserveId = async function (reserve_id, session_user, uid) {
  if (typeof reserve_id === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  let oid;
  try {
    oid = kqudie.String2ObjectId(reserve_id);
  } catch (err) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "_id": oid,
    "teacher": session_user
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.not_permitted);
  } else {
    let return_data = {
      "message": message.success,
      "data": result[0]
    };

    return return_data;
  }
}

/**
 ** Status
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

tchmgr.Status = async function (reserve_id, session_user, uid) {
  if (typeof reserve_id === "undefined" || reserve_id === "") {
    throw new Error(message.invalid_field);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  let oid;
  try {
    oid = kqudie.String2ObjectId(reserve_id);
  } catch (err) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "_id": oid,
    "teacher": session_user
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.not_permitted);
  } else {
    let return_data = {
      "message": message.success,
      "status": result[0].status
    };

    return return_data;
  }
}

/**
 ** Accept
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

tchmgr.Accept = async function (reserve_id, session_user, uid) {
  let result;
  try {
    result = await tchmgr.Status(reserve_id, session_user, uid);
  } catch (err) {
    throw err;
  }

  if (result.message === message.success) {
    if (result.status === "accepted") {
      throw new Error(message.accepted);
    } else if (result.status === "rejected") {
      throw new Error(message.rejected);
    } else {

      let oid = kqudie.String2ObjectId(reserve_id);
      let update_query = {
        "_id": oid
      };
      let update_detail = {
        $set: {
          "status": "accepted"
        }
      };

      let update_result;
      try {
        update_result = await kqudie.update(database, reserve_detail, update_query, update_detail);
      } catch (err) {
        throw err;
      }

      if (update_result.result.nModified === 1) {
        return message.success;
      } else {
        throw new Error(message.database_error);
      }
    }
  } else {
    throw new Error(message.database_error);
  }
}

/**
 ** Reject
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

tchmgr.Reject = async function (reserve_id, session_user, uid) {
  let result;
  try {
    result = await tchmgr.Status(reserve_id, session_user, uid);
  } catch (err) {
    throw err;
  }

  if (result.message === message.success) {
    if (result.status === "accepted") {
      throw new Error(message.accepted);
    } else if (result.status === "rejected") {
      throw new Error(message.rejected);
    } else {

      let raw_reservation;
      try {
        raw_reservation = await tchmgr.QueryByReserveId(reserve_id, session_user, uid);
      } catch (err) {
        throw err;
      }

      let oid = kqudie.String2ObjectId(reserve_id);
      let update_detail_query = {
        "_id": oid
      };
      let update_detail = {
        $set: {
          "status": "rejected"
        }
      };
      let update_summary_query = {
        "week": raw_reservation.data.week,
        "day": raw_reservation.data.day
      };
      let update_summary = {
        $pull: {
          "reserved": raw_reservation.data.time
        },
        $addToSet: {
          "available": raw_reservation.data.time
        }
      };

      let update_detail_result, update_summary_result;
      try {
        update_detail_result = await kqudie.update(database, reserve_detail, update_detail_query, update_detail);
        update_summary_result = await kqudie.update(database, reserve_summary, update_summary_query, update_summary);
      } catch (err) {
        throw err;
      }

      if (update_summary_result.result.nModified === 1 && update_detail_result.result.nModified === 1) {
        return message.success;
      } else {
        throw new Error(message.database_error);
      }
    }
  } else {
    throw new Error(message.database_error);
  }
}

/**
 ** Arrange
 **
 ** @param session_user
 ** @param data
 ** @param data.week
 ** @param data.day
 ** @param data.available array
 **
 */

tchmgr.Arrange = async function (session_user, uid, data) {
  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (typeof data === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof data.week === "undefined" || typeof data.day === "undefined"
    || typeof data.available === "undefined") {
      throw new Error(message.invalid_field);
    }

  if (!filter.judgeArray(data.available)) {
    throw new Error(message.invalid_field);
  }

  for (let rec in data) {
    if (!filter.filter(data[rec])) {
      throw new Error(message.invalid_field);
      break;
    }
  }

  if (data.available.length > max_classes) {
    throw new Error(message.out_of_range);
  }

  if (!(filter.judgeNumber(data.week) && filter.judgeNumber(data.day))) {
    throw new Error(message.invalid_field);
  }

  for (let i in data.available) {
    if (!(filter.judgeNumber(data.available[i]))) {
      throw new Error(message.invalid_field);
    }

    if (data.available[i] > max_classes || data.available[i] < min_classes) {
      throw new Error(message.out_of_range);
      break;
    }
  }

  let raw_summary_query = {
    "week": data.week,
    "day": data.day
  };

  let raw_summary;
  try {
    raw_summary = await kqudie.find(database, reserve_summary, raw_summary_query);
  } catch (err) {
    throw err;
  }

  let unavailable_array = tchmgr.Diff(raw_array, data.available);

  if (raw_summary.length === 0) {
    let insert_summary = {
      "week": data.week,
      "day": data.day,
      "teacher": session_user,
      "available": data.available,
      "reserved": [],
      "unavailable": unavailable_array
    };

    let insert_result;
    try {
      insert_result = await kqudie.insert(database, reserve_summary, insert_summary);
    } catch (err) {
      throw err;
    }

    if (insert_result.result.ok === 1) {
      return message.success;
    } else {
      throw new Error(message.database_error);
    }

  } else {

    for (let i = 0; i < raw_summary[0].reserved.length; i++) {
      for (let j = 0; j < data.available.length; j++) {
        if (raw_summary[0].reserved[i] === data.available[j]) {
          throw new Error(message.unacceptable);
          break;
        }
      }
    }

    unavailable_array = tchmgr.Diff(unavailable_array, raw_summary[0].reserved);

    let update_query = {
      "week": data.week,
      "day": data.day,
    };
    let update_summary = {
      $set: {
        "available": data.available,
        "reserved": raw_summary[0].reserved,
        "unavailable": unavailable_array
      }
    };

    let update_result;
    try {
      update_result = await kqudie.update(database, reserve_summary, update_query, update_summary);
    } catch (err) {
      throw err;
    }

    if (update_result.result.nModified === 1) {
      return message.success;
    } else {
      throw new Error(message.database_error);
    }
  }
}

/**
 ** Diff
 **
 ** @param raw array
 ** @param target array
 **
 */

tchmgr.Diff = function (raw, target) {
  if (target.length === 0) {
    return raw;
  }

  for (let i = 0; i < raw.length; i++) {
    for (let j = 0; j < target.length; j++) {
      if (raw[i] === target[j]) {
        raw.splice(i, 1);
        i = i - 1;
      }
    }
  }

  return raw;
}
