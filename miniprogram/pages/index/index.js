//index.js
Page(
  {
  data: 
  {
    //轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200
  },
  onLoad: function () {
    var that = this; 
    var data = {
      "datas": [
        {
          "id": 1,
          "imgurl": "../../image/1.jpg"
        },
        {
          "id": 2,
          "imgurl": "../../image/2.jpg"
        },
        {
          "id": 3,
          "imgurl": "../../image/3.jpg"
        }
      ]
    }; 
    that.setData({
      lunboData: data.datas
    })
  },
  redirectToTargetPage1: function() {
    // 跳转到目标页面
    wx.navigateTo({
      url: '/pages/week/week',
    })
  },
  redirectToTargetPage2: function() {
    // 跳转到目标页面
    wx.navigateTo({
      url: '/pages/day/day',
    })
  }
}
)