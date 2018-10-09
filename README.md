# TeacherManagementModule
[![Build Status](https://travis-ci.org/kqummp/TeacherManagementModule.svg?branch=master)](https://travis-ci.org/kqummp/TeacherManagementModule)
[![Coverage Status](https://coveralls.io/repos/github/kqummp/TeacherManagementModule/badge.svg)](https://coveralls.io/github/kqummp/TeacherManagementModule)

Teacher Management Module

## 功能实现

* 登陆
* 注册
* 密码修改
* 提交可预约时间段
* 修改预约状态

## 数据库结构

* 用户数据

```json
{
  "uid": 1000000,
  "passwd": "asdasdasdasdasd"
}
```

* 单天数据

```json
{
  "week": 3,
  "day": 1,
  "teacher": 1000000,
  "available": [1, 3, 7],
  "reserved": [2, 4],
  "unavailable": [5, 6, 8]
}
```

* 单个预约详情

```json
{
  "week": 3,
  "day": 1,
  "time": 2,
  "timestamp": 1537363911,
  "uid": 2017220301024,
  "title": "sth",
  "reason": "sth",
  "info": "sth",
  "remark": "sth",
  "status": "pending",
  "teacher": 1000000
}
```
