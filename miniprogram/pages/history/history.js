var globalData = getApp().globalData

Page({
  data:{
    pageMode: null,
    dialogueList: []
  },

  click:function(e) {
    wx.navigateTo({
      url: '/pages/list/list?dialogueId='+e.currentTarget.dataset.text._id,
    })
  },

  onShow() {
    if (globalData.userUsername === null) {
      this.setData({
        pageMode: 1
      })
    }
    else{
      var that = this;
      var temp = []
      wx.cloud.callFunction({
        name: 'getDialogues',
        data: {
          userOpenId: globalData.userOpenId
        },
        success: res => {
          if (res.result.code === 201) {
            that.setData({
              pageMode: 2
            })
          }
          else if (res.result.code === 200) {
            for (let i = 0; i < res.result.data.data.length; i++) {
              if(res.result.data.data[i].msg_from_user_type==="image") {
                res.result.data.data[i].msg_from_user_content="请你分析这张图片的营养成分！"
              }
            }
            that.setData({
              pageMode: 3,
              dialogueList: res.result.data.data    
            })
          }
        }
      })
    }
  }
})