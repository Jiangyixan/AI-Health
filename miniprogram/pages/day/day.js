var globalData = getApp().globalData
Page({
  data: {
    pageMode: null,
    dayDialogueList:null,
    dayResponse: null,
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
          period: 2,
          userOpenId: globalData.userOpenId
        },
        success: res => {
          if (res.result.code === 200) {
            that.setData({
              dayDialogueList: res.result.data.join(',')
            })
            wx.request({
              url: 'https://dietary.shifang.co/process_day',
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              data: {
                text: that.data.dayDialogueList
              },
              success: function (res) {
                const response = res.data;
                that.setData({
                  dayResponse: response.choices[0].message.content,
                  pageMode: 2
                })
                console.log(that.data.dayResponse)
                let index1 = that.data.dayResponse.indexOf('饮食建议')
                let index2 = that.data.dayResponse.indexOf('用户画像总结')
                that.setData({
                  nutritionIntake: that.data.dayResponse.substring(0+7, index1),
                  dietaryAdvice: that.data.dayResponse.substring(index1+5, index2),
                  profileSummary: that.data.dayResponse.substring(index2+7)
                })
              }
            });
          }
        }
      });
    }
  }
})