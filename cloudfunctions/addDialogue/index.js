const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const newDialogueInfo = await db.collection("dialogue").add({
    data: {
      user_openid: event.userOpenId,
      msg_from_user_type: event.msgFromUserType,
      msg_from_user_content: event.msgFromUserContent,
      msg_from_ai_type: event.msgFromAIType,
      msg_from_ai_content: event.msgFromAIContent,
      msg_time: event.msgTime,
      msg_date: event.msgDate
    }
  })
  return {
    code: 200,
    msg: '添加成功'
  }
}