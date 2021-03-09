# 用户表-user
| Name           | Type    | Comment      | description    | default        | example                  |
| -------------- | ------- | ------------ | -------------- | -------------- | ------------------------ |
| **userId**     | String  | 用户唯一标识 | -              | 微信获取openid | dsdsdsd                  |
| **gender**     | Integer | 性别         | 1:男,0:女-默认 | 1              | 0                        |
| **nickname**   | String  | 昵称         | -              | 微信昵称>随机  | forever                  |
| **lastLogin**  | Date    | 最后登录时间 | -              | new Date()     | 2021-03-08T07:46:52.126Z |
| **loginCount** | Integer | 登录次数     | -              | 0              | 100                      |

# 活动表-activity
| Name            | Type    | Comment        | description          | default    | example    |
| --------------- | ------- | -------------- | -------------------- | ---------- | ---------- |
| **activityId**  | String  | 活动唯一标识   | 可用于扫码加入活动   | 方法生成   | ds78d7s87d |
| **userId**      | String  | 所属用户       | -                    | 来源user表 | dsdsdsd    |
| **name**        | String  | 活动名称       | -                    | 用户提供   | xx课程     |
| **description** | String  | 活动简介       | -                    | 用户提供   | bababab    |
| **nameFormat**  | String  | 姓名格式       | -                    | 用户提供   | 学号-姓名  |
| **peopleCount** | Integer | 预计签到人数   | 0:不填写 >1:预计人数 | 0          | 100        |
| pwd             | String  | 活动的唯一标识 | 可用于输入加入       | 方法生成   | dds89      |

# 活动签到表-sign_list
| Name              | Type      | Comment            | description                        | default          | example    |
| ----------------- | --------- | ------------------ | ---------------------------------- | ---------------- | ---------- |
| **signId**        | String    | 每个签到活动的标识 | -                                  | 方法生成         | ds78d7s87d |
| **activityId**    | String    | 关联的活动标识     | -                                  | 来源activity表   | ds78d7s87d |
| **method**        | Integer[] | 签到方式           | 1:二维码,2:定位,3:拍照 4: 教师修改 | [1]              | [2]        |
| **qrcode**        | String    | 二维码内容         | 一个json                           | 方法生成         | {}TODO     |
| **location**      | String    | 位置信息           | 一个json                           | 用户上传         | {}TODO     |
| **pwd**           | String    | 口令               | 用于定位签到                       |                  |            |
| **status**        | Integer   | 状态               | 1:进行中,0:暂停 -1 结束            | 0                | 0          |
| **startTime    ** | Date      | 开始时间           | -                                  | new Date()       | -          |
| **waitTime**      | Date      | 暂停时间           | -                                  | new Date()       | -          |
| **endTime**       | Date      | 结束时间           | -                                  | new Date()+delay | -          |

# 参加活动人员表-activity_people
| Name           | Type   | Comment            | description             | default        | example    |
| -------------- | ------ | ------------------ | ----------------------- | -------------- | ---------- |
| **peopleId**   | String | 活动成员的唯一标识 | -                       | 方法生成       | ds78d7s87d |
| **activityId** | String | 关联的活动标识     | -                       | 来源activity表 | ds78d7s87d |
| **userId**     | String | 用户的唯一标识     | -                       | 来源user表     | ddsds      |
| **name**       | String | 用户在活动中的名称 | 不可被更改,管理员可更改 | 用户填写       | 张三       |
| **joinTime**   | Date   | 加入时间           | 用户加入活动            |                |            |

# 签到记录 sign_record
| Name         | Type    | Comment            | description                  | default               | example      |
| ------------ | ------- | ------------------ | ---------------------------- | --------------------- | ------------ |
| **recordId** | String  | 签到动作的唯一标识 | -                            | 方法生成              | ds78d7s87d   |
| **peopleId** | String  | 关联的活动人员     | -                            | 来源activity_people表 | ds78d7s87d   |
| **userId**   | String  | 用户的唯一标识     | -                            | 来源user表            | ddsds        |
| **name**     | String  | 签到用户的姓名     | 用于校验peopleId对应身份信息 | 上传                  |              |
| **siginId**  | String  | 关联活动签到表     | -                            | 来源sign_list表       |
|              |
| activityId   | String  | 关联活动           | -                            | 来源Activity表        |              |
| **lastTime** | Date    | 最后签到时间       | -                            | new Date()            |              |
| **location** | String  | 签到位置信息       | -                            | 用户上传              |              |
| **method**   | Integer | 签到方式           |                              | 1                     |              |
| **photo**    | String  | 拍照方式的图片     |                              |                       |              |
| **status**   | Integer | 签到状态           | 0:成功,1:失败,2迟到3旷课     | 1                     |              |
| tips         | String  | 批注信息           | 教师填入                     |                       | 回答问题积极 |
| rank         | Integer | 排名               | 数据插入后生成               |                       |              |



