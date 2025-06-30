Page({
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
  skip() {
    wx.switchTab({
      url: "/pages/index/index",
    });
  },
});
