var globalData = getApp().globalData;

Page({
  data: {
    pageMode: 1,
    userUsername: null,
    userAvatar: null,
  },

  onLoad: function (options) {
    this.setData({
      pageMode: options.pageMode,
      userUsername: globalData.userUsername,
    });
  },

  login() {
    wx.navigateTo({
      url: "/pages/login/login",
    });
  },

  register() {
    wx.navigateTo({
      url: "/pages/register/register",
    });
  },

  logout() {
    this.setData({
      pageMode: 1,
    });
    (globalData.userUsername = null),
      (globalData.userMobilePhone = null),
      (globalData.userAvatar = null);
  },
});
