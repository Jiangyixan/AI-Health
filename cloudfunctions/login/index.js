const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  const { openId, mobilePhone, password } = event
  const userInfo = await db.collection('user_info').where({open_id: openId}).get()

  if (userInfo.data.length === 0) {
    return {
      code: 500,
      msg: '用户未注册'
    }
  } else {
    if (userInfo.data[0].mobile_phone === mobilePhone && userInfo.data[0].password === password) {
      return {
        code: 200,
        msg: '登录成功',
        data: userInfo
      }
    } else {
      return {
        code: 400,
        msg: '手机或密码错误'
      }
    }
  }
}