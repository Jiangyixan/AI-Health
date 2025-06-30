var globalData = getApp().globalData

Page({
  data: {
    userMobilePhone: null,
    userPassword: null
  },

  inputMobilePhone: function (e) {
    this.setData({
      userMobilePhone: e.detail.value
    })
  },

  inputPassword: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  },

  login: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {
        openId: globalData.userOpenId,
        mobilePhone: this.data.userMobilePhone, 
        password: this.data.userPassword
      },
      success: res => {
        if (res.result.code === 200) {
          console.log(res.result.data.data[0])
          wx.showToast({
            title: '登录成功！',
            icon: 'success',
            duration: 1500,
          })
          globalData.userUsername = res.result.data.data[0].username
          globalData.userMobilePhone = res.result.data.data[0].mobile_phone
          setTimeout(function(){
            wx.reLaunch({
              url: '../home/home?pageMode=2'
            })
          }, 1500)
        }
        else if (res.result.code === 500) {
          wx.showToast({
            title: '请先注册！',
            icon: 'error',
            duration: 1500,
          })
          setTimeout(function(){
            wx.navigateBack()
          }, 1500)
        }
        else if (res.result.code === 400) {
          wx.showToast({
            title: '手机或密码错误！',
            icon: 'error',
            duration: 1500,
          })
          setTimeout(function(){
            wx.navigateBack()
          }, 1500)
        }
      }
    })
    
  }
});
