const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const historyDialogueList = await db.collection('dialogue').where({user_openid: event.userOpenId}).get()
  if (historyDialogueList.data.length >= 1) {
    return{
      code: 200,
      msg: '获取成功，并且有历史记录',
      data: historyDialogueList
    }
  }
  else {
    return {
      code: 201,
      msg: '获取成功，但是没有历史记录'
    }
  }
}