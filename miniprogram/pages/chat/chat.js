let chatInput = require("../../modules/chat-input/chat-input");
var utils = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    wxchatLists: [],
    friendHeadUrl: "",
    // textMessage: '',
    chatItems: [],
    scrollTopTimeStamp: 0,
    height: 0, //屏幕高度
    chatHeight: 0, //聊天屏幕高度
    normalDataTime: "",
    //onLaunchData:null,
    list: "",
    encodedImage: null,
  },

  onLoad: function (options) {
    let _this = this;
    var that = this;
    _this.initData();
    //获取屏幕的高度
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: wx.getSystemInfoSync().windowHeight,
          chatHeight: wx.getSystemInfoSync().windowHeight - 55,
        });
      },
    });
  },
  initData: function () {
    let that = this;
    let systemInfo = wx.getSystemInfoSync();
    chatInput.init(this, {
      systemInfo: systemInfo,
      minVoiceTime: 1,
      maxVoiceTime: 60,
      startTimeDown: 56,
      format: "mp3", //aac/mp3
      sendButtonBgColor: "mediumseagreen",
      sendButtonTextColor: "white",
      extraArr: [
        {
          picName: "choose_picture",
          description: "照片",
        },
        {
          picName: "take_photos",
          description: "拍摄",
        },
      ],
      // tabbarHeigth: 48
    });

    that.setData({
      pageHeight: systemInfo.windowHeight,
      normalDataTime: utils.formatTime(new Date()),
    });
    wx.setNavigationBarTitle({
      title: "AI营养师",
    });
    that.textButton();
    that.extraButton();
    that.voiceButton();
  },
  textButton: function () {
    var that = this;
    chatInput.setTextMessageListener(function (e) {
      let content = e.detail.value;
      console.log(content);

      var list = that.data.wxchatLists;
      var temp = {
        userImgSrc: "../../image/name.jpg",
        textMessage: content,
        dataTime: utils.formatTime(new Date()),
        msg_type: "text",
        msgFrom: "user",
      };
      list.push(temp);
      that.setData({
        wxchatLists: list,
      });

      // 构建对话历史
      const history = [];
      for (let i = 0; i < that.data.wxchatLists.length - 1; i++) {
        if (that.data.wxchatLists[i].msgFrom === "user") {
          history.push({
            role: "user",
            content: that.data.wxchatLists[i].textMessage,
          });
        } else if (that.data.wxchatLists[i].msgFrom === "server") {
          history.push({
            role: "assistant",
            content: that.data.wxchatLists[i].textMessage,
          });
        }
      }

      // 发起请求
      wx.request({
        url: "https://chat.shifang.co/vlm",
        method: "POST",
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          text: content,
          history: history,
        },
        success: function (res) {
          const response = res.data;
          console.log("服务器响应:", response);

          if (
            response.code === "10000" &&
            response.message &&
            Array.isArray(response.message)
          ) {
            // 查找助手回复内容
            let assistantMessage = "";

            // 从message数组中查找role为assistant的元素
            for (let i = response.message.length - 1; i >= 0; i--) {
              if (response.message[i].role === "assistant") {
                assistantMessage = response.message[i].content;
                break;
              }
            }

            // 如果没有找到assistant角色的消息，则尝试使用最后一个元素
            if (!assistantMessage && response.message.length > 0) {
              assistantMessage =
                response.message[response.message.length - 1].content;
            }

            console.log("提取的助手回复:", assistantMessage);

            // 请求成功
            var list1 = that.data.wxchatLists;
            var temp = {
              userImgSrc: "../../image/name.jpg",
              textMessage: assistantMessage,
              dataTime: utils.formatTime(new Date()),
              msg_type: "text",
              msgFrom: "server",
            };
            list1.push(temp);
            that.setData({
              wxchatLists: list1,
            });

            var date = new Date();
            wx.cloud.callFunction({
              name: "addDialogue",
              data: {
                userOpenId: app.globalData.userOpenId,
                msgFromUserType: "text",
                msgFromUserContent:
                  that.data.wxchatLists[that.data.wxchatLists.length - 2]
                    .textMessage,
                msgFromAIType: "text",
                msgFromAIContent: assistantMessage,
                msgTime: date,
                msgDate: new Date().toISOString().substring(0, 10),
              },
              success: function (res) {
                console.log("对话保存成功:", res);
              },
              fail: function (err) {
                console.error("对话保存失败:", err);
              },
            });
          } else {
            // 请求失败
            wx.showToast({
              title: "请求失败: " + (response.message || "未知错误"),
              icon: "none",
              duration: 2000,
            });
          }
        },
        fail: function (err) {
          console.error("请求错误:", err);
          wx.showToast({
            title: "网络请求失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
    });
  },

  voiceButton: function () {
    var that = this;
    chatInput.recordVoiceListener(function (res, duration) {
      let tempFilePath = res.tempFilePath;
      let vDuration = duration;
      console.log(tempFilePath);
      console.log(vDuration + "这是voice的时长");

      var list = that.data.wxchatLists;
      var temp = {
        userImgSrc: "../../image/chat/extra/close_chat.png",
        voiceSrc: tempFilePath,
        voiceTime: vDuration,
        dataTime: utils.formatTime(new Date()),
        msg_type: "voice",
        type: 1,
      };
      list.push(temp);
      that.setData({
        wxchatLists: list,
      });
    });
    chatInput.setVoiceRecordStatusListener(function (status) {
      switch (status) {
        case chatInput.VRStatus.START: //开始录音
          break;
        case chatInput.VRStatus.SUCCESS: //录音成功
          break;
        case chatInput.VRStatus.CANCEL: //取消录音
          break;
        case chatInput.VRStatus.SHORT: //录音时长太短
          break;
        case chatInput.VRStatus.UNAUTH: //未授权录音功能
          break;
        case chatInput.VRStatus.FAIL: //录音失败(已经授权了)
          break;
      }
    });
  },

  extraButton: function () {
    let that = this;
    chatInput.clickExtraListener(function (e) {
      console.log(e);
      let itemIndex = parseInt(e.currentTarget.dataset.index);
      if (itemIndex === 2) {
        that.myFun();
        return;
      }
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["compressed"],
        sourceType: itemIndex === 0 ? ["album"] : ["camera"],
        success: function (res) {
          let tempFilePath = res.tempFilePaths[0];
          console.log(tempFilePath);
          var fileId = null;
          wx.cloud.uploadFile({
            cloudPath: Math.random().toString(36).substring(2) + ".png",
            filePath: tempFilePath,
            success: (res) => {
              // get resource ID
              console.log(res.fileID);
              fileId = res.fileID;
            },
            fail: (err) => {
              // handle error
            },
          });

          // wx.uploadFile({
          //   url: 'http://118.25.98.83:8900/save_image',
          //   filePath: tempFilePath,
          //   name: 'image',
          //   success:function(res) {
          //     that.setData({
          //       encodedImage:res.data
          //     })
          //   }
          // }),

          // Upload the image to the Flask server
          wx.uploadFile({
            url: "https://dietary.shifang.co/process_image",
            filePath: tempFilePath,
            name: "image",
            success: function (res) {
              // Parse the response JSON
              const response = JSON.parse(res.data);
              console.log("服务器返回的消息:", response);

              // Add the uploaded image on the right side
              var list = that.data.wxchatLists;
              var temp = {
                userImgSrc: "../../image/name.jpg",
                sendImgSrc: tempFilePath,
                dataTime: utils.formatTime(new Date()),
                msg_type: "img",
                msgFrom: "user",
              };
              list.push(temp);

              // Add the response text on the left side
              var responseTemp = {
                userImgSrc: "../../image/name.jpg",
                textMessage: response.choices[0].message.content,
                dataTime: utils.formatTime(new Date()),
                msg_type: "text",
                msgFrom: "server",
              };
              list.push(responseTemp);

              that.setData({
                wxchatLists: list,
              });
              var date = new Date();
              wx.cloud.callFunction({
                name: "addDialogue",
                data: {
                  userOpenId: app.globalData.userOpenId,
                  msgFromUserType: "image",
                  msgFromUserContent: fileId,
                  msgFromAIType: "text",
                  msgFromAIContent:
                    that.data.wxchatLists[that.data.wxchatLists.length - 1]
                      .textMessage,
                  msgTime: date,
                  msgDate: new Date().toISOString().substring(0, 10),
                },
              });
            },
            fail: function (err) {
              console.error(err);
              wx.showToast({
                title: "Image upload failed",
                icon: "none",
              });
            },
          });
        },
      });
    });
    chatInput.setExtraButtonClickListener(function (dismiss) {
      console.log("Extra弹窗是否消息", dismiss);
    });
  },
  resetInputStatus: function () {
    chatInput.closeExtraView();
  },

  //播放录音
  playRecord: function (e) {
    let _this = this;
    // wx.playVoice({
    //   filePath: voiceSrc // src可以是录音文件临时路径
    // })
    console.log(e);
    console.log(_this);
  },
  //删除单条消息
  delMsg: function (e) {
    var that = this;
    var magIdx = parseInt(e.currentTarget.dataset.index);
    var list = that.data.wxchatLists;

    wx.showModal({
      title: "提示",
      content: "确定删除此消息吗？",
      success: function (res) {
        if (res.confirm) {
          console.log(e);
          list.splice(magIdx, 1);
          that.setData({
            wxchatLists: list,
          });
          // wx.showToast({
          //   title: '删除成功',
          //   mask: true,
          //   icon: 'none',
          // })
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  //点击图片 预览大图
  seeBigImg: function (e) {
    var that = this;
    var idx = parseInt(e.currentTarget.dataset.index);
    var src = that.data.wxchatLists[idx].sendImgSrc;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src], // 需要预览的图片http链接列表
    });
  },
});
