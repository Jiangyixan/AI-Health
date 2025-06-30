// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogue:null,
    imgPath:null,
    pageMode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name:"getDialogue",
      data:{
        dialogueId: options.dialogueId
      },
      success: res => {
        if (res.result.code === 200) {
          console.log(res.result.data.data[0])
          this.setData({
            pageMode:1,
            dialogue:res.result.data.data[0]
          })
          if(this.data.dialogue.msg_from_user_type === "image") {
            wx.cloud.downloadFile({
              fileID: this.data.dialogue.msg_from_user_content,
              success: res => {
                console.log(res.tempFilePath)
                this.setData({
                  pageMode: 2,
                  imgPath: res.tempFilePath
                })
              }
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})