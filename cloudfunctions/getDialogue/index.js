const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const dialogue = await db.collection('dialogue').where({ _id:event.dialogueId }).get()
  if (dialogue.data.length === 1) {
    return{
      code: 200,
      msg: '获取成功',
      data: dialogue
    }
  }
  else {
    return {
      code: 400,
      msg: '获取失败'
    }
  }
}