var globalData = getApp().globalData
Page({
  data: {
    pageMode: null,
    weekDialogueList:null,
    weekResponse: null,
    nutritionIntake: null,
    dietaryAdvice: null,
    profileSummary: null
  },

  onShow() {
    if (globalData.userUsername === null) {
      this.setData({
        pageMode: 1
      })
    }
    else{
      var that = this;
      wx.cloud.callFunction({
        name: 'getPeriodDialogue',
        data: {
          period: 1,
          userOpenId: globalData.userOpenId
        },
        success: res => {
          if (res.result.code === 200) {
            that.setData({
              weekDialogueList: res.result.data.join(',')
            })
            wx.request({
              url: 'https://dietary.shifang.co/process_week',
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              data: {
                text: that.data.weekDialogueList
              },
              success: function (res) {
                const response = res.data;
                that.setData({
                  weekResponse: response.choices[0].message.content,
                  pageMode: 2
                })
                console.log(that.data.weekResponse)
                let index1 = that.data.weekResponse.indexOf('饮食建议')
                let index2 = that.data.weekResponse.indexOf('用户画像总结')
                that.setData({
                  nutritionIntake: that.data.weekResponse.substring(0+7, index1),
                  dietaryAdvice: that.data.weekResponse.substring(index1+5, index2),
                  profileSummary: that.data.weekResponse.substring(index2+7)
                })
              }
            });
          }
        }
      });
    }
  }
})