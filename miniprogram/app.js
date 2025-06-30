App({
  globalData: {
    userOpenId: null,
    userUsername: null,
    userMobilePhone: null,
    userAvatar: null,
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "cloud1-0g9a4jwz0861e1be",
        traceUser: true,
      }),
        wx.cloud.callFunction({
          name: "getOpenId",
          success: (res) => {
            this.globalData.userOpenId = res.result.openid;
            console.log(this.globalData.userOpenId);
          },
        });
    }
  },
});
