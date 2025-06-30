const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ });

exports.main = async (event, context) => {
  const db = cloud.database();
  const { openId, username, password, mobilePhone } = event;
  const userInfo = await db
    .collection("user_info")
    .where({ open_id: openId })
    .get();

  if (userInfo.data.length === 1) {
    return {
      code: 501,
      msg: "用户已注册",
    };
  } else {
    const isUsernameExist = await db
      .collection("user_info")
      .where({ username: username })
      .get();
    if (isUsernameExist.data.length > 0) {
      return {
        code: 502,
        msg: "用户名已注册",
      };
    }

    const isMobilePhoneExist = await db
      .collection("user_info")
      .where({ mobile_phone: mobilePhone })
      .get();
    if (isMobilePhoneExist.data.length > 0) {
      return {
        code: 503,
        msg: "手机号码已注册",
      };
    }

    const newUserInfo = await db.collection("user_info").add({
      data: {
        open_id: openId,
        username: username,
        password: password,
        mobile_phone: mobilePhone,
      },
    });
    const userInfo = await db
      .collection("user_info")
      .doc(newUserInfo._id)
      .get();
    return {
      code: 200,
      msg: "注册成功",
      data: userInfo,
    };
  }
};
