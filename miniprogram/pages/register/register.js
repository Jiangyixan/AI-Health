var globalData = getApp().globalData;

Page({
  data: {
    userUsername: null,
    userMobilePhone: null,
    userPassword: null,
  },
  inputUsername: function (e) {
    this.setData({
      userUsername: e.detail.value,
    });
    console.log("输入用户名:", e.detail.value);
  },

  inputMobilePhone: function (e) {
    this.setData({
      userMobilePhone: e.detail.value,
    });
    console.log("输入手机号:", e.detail.value);
  },

  inputPassword: function (e) {
    this.setData({
      userPassword: e.detail.value,
    });
    console.log("输入密码:", e.detail.value);
  },

  register: function () {
    console.log("===== 开始注册流程 =====");
    console.log("当前用户OpenID:", getApp().globalData.userOpenId);
    console.log("注册信息:", {
      username: this.data.userUsername,
      mobilePhone: this.data.userMobilePhone,
      password: this.data.userPassword ? "******" : "未填写", // 出于安全考虑不显示实际密码
    });

    wx.showLoading({
      title: "注册中...",
    });

    wx.cloud.callFunction({
      name: "register",
      data: {
        openId: getApp().globalData.userOpenId,
        username: this.data.userUsername,
        mobilePhone: this.data.userMobilePhone,
        password: this.data.userPassword,
      },
      success: (res) => {
        console.log("云函数返回结果:", res.result);
        wx.hideLoading();
        if (res.result.code === 200) {
          console.log("注册成功，用户信息:", res.result.data);
          wx.showToast({
            title: "注册成功！",
            icon: "success",
            duration: 1500,
          });
          globalData.userUsername = res.result.data.data.username;
          globalData.userMobilePhone = res.result.data.data.mobile_phone;
          console.log("全局数据已更新:", {
            username: globalData.userUsername,
            mobilePhone: globalData.userMobilePhone,
          });
          setTimeout(function () {
            console.log("跳转到个人页面");
            wx.reLaunch({
              url: "../home/home?pageMode=2",
            });
          }, 1500);
        } else if (res.result.code === 501) {
          console.log("用户已注册");
          wx.showToast({
            title: "您已注册！",
            icon: "error",
            duration: 1500,
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1500);
        } else if (res.result.code === 502) {
          console.log("用户名已被注册");
          wx.showToast({
            title: "用户名已注册！",
            icon: "error",
            duration: 1500,
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1500);
        } else if (res.result.code === 503) {
          console.log("手机号已被注册");
          wx.showToast({
            title: "手机号码已注册！",
            icon: "error",
            duration: 1500,
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1500);
        }
      },
      fail: (err) => {
        console.error("云函数调用失败:", err);
        wx.hideLoading();
        wx.showToast({
          title: "注册失败，请重试",
          icon: "none",
          duration: 2000,
        });
      },
      complete: () => {
        console.log("===== 注册请求完成 =====");
      },
    });
  },
});
