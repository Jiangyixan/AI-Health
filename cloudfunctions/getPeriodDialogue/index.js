const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const db = cloud.database()
  console.log(event.userOpenId)
  if (event.period === 1) {
    var now = new Date();
    var firstDay = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
    var lastDay = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)+7));
    var date1 = new Date(firstDay);
    var date2 = new Date(lastDay);
    const periodDialogueList = await db.collection('dialogue').where({user_openid: event.userOpenId}).get()
    var result = []
    for (let i = 0; i < periodDialogueList.data.length; i++) {
      var temp = new Date(periodDialogueList.data[i].msg_time)
      console.log(temp)
      console.log(date1)
      console.log(date2)
      console.log(temp>=date1)
      console.log(temp<=date2)
      if(temp >= date1 && temp <= date2) {
        result.push(periodDialogueList.data[i].msg_time)
        //result.push(periodDialogueList.data[i].msg_from_user_content)
        result.push(periodDialogueList.data[i].msg_from_ai_content)
      }
    }
    console.log(result)
    return {
      code: 200,
      msg: '获取成功',
      data: result
    }
  }
  if (event.period === 2) {
    var now = new Date();
    var firstDay = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
    var lastDay = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)+1));
    var date1 = new Date(firstDay);
    var date2 = new Date(lastDay);
    const periodDialogueList = await db.collection('dialogue').where({user_openid: event.userOpenId}).get()
    var result = []
    for (let i = 0; i < periodDialogueList.data.length; i++) {
      var temp = new Date(periodDialogueList.data[i].msg_time)
      if(temp >= date1 && temp <= date2) {
        result.push(periodDialogueList.data[i].msg_time)
        // result.push(periodDialogueList.data[i].msg_from_user_content)
        result.push(periodDialogueList.data[i].msg_from_ai_content)
      }
    }
    return {
      code: 200,
      msg: '获取成功',
      data: result
    }
  }
}
