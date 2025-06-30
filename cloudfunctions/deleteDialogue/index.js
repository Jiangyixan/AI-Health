const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const { dialogueId } = event

  const result1 = await db.collection('dialogue')
  .doc(dialogueId).remove()
  const result2 = await db.collection('dialogue_content')
  .where({ dialogue_id: dialogueId }).remove()

  return {
    code: 200,
    message: '删除成功'
  }
}