const app = getApp();

Page({
  data: {
    mealType: "", // breakfast, lunch, dinner
    mealTitle: "饮食打卡",
    content: "",
    contentLength: 0,
    uploadedImages: [],
    foodTags: [
      "谷薯类",
      "蔬菜类",
      "水果类",
      "肉蛋类",
      "奶豆类",
      "油脂类",
      "调味品",
    ],
    selectedTags: {},
  },

  onLoad(options) {
    // 获取从上个页面传递的餐点类型
    const type = options.type || "早餐";

    let title = "早餐打卡";
    if (type === "午餐") {
      title = "午餐打卡";
    } else if (type === "晚餐") {
      title = "晚餐打卡";
    }

    this.setData({
      mealType: type,
      mealTitle: title,
    });
  },

  // 内容输入监听
  onContentInput(e) {
    const content = e.detail.value;
    this.setData({
      content: content,
      contentLength: content.length,
    });
  },

  // 选择图片
  chooseImage() {
    const that = this;
    const currentCount = this.data.uploadedImages.length;
    const remainCount = 9 - currentCount;

    if (remainCount <= 0) {
      wx.showToast({
        title: "最多上传9张图片",
        icon: "none",
      });
      return;
    }

    wx.chooseImage({
      count: remainCount,
      sizeType: ["compressed"], // 压缩图
      sourceType: ["album", "camera"],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          uploadedImages: [...that.data.uploadedImages, ...tempFilePaths],
        });
      },
    });
  },

  // 预览图片
  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.uploadedImages,
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.uploadedImages;
    images.splice(index, 1);
    this.setData({
      uploadedImages: images,
    });
  },

  // 切换标签选择状态
  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const selectedTags = this.data.selectedTags;

    selectedTags[tag] = !selectedTags[tag];
    this.setData({
      selectedTags: selectedTags,
    });
  },

  // 添加自定义标签
  addCustomTag() {
    const that = this;
    wx.showModal({
      title: "添加自定义标签",
      content: "",
      editable: true,
      placeholderText: "请输入食物名称",
      success(res) {
        if (res.confirm && res.content) {
          const customTag = res.content.trim();
          if (customTag) {
            // 添加到标签列表
            const foodTags = [...that.data.foodTags];
            const selectedTags = { ...that.data.selectedTags };

            // 检查标签是否已存在
            if (!foodTags.includes(customTag)) {
              foodTags.push(customTag);
              selectedTags[customTag] = true;

              that.setData({
                foodTags: foodTags,
                selectedTags: selectedTags,
              });
            } else {
              // 如果标签已存在，直接选中它
              selectedTags[customTag] = true;
              that.setData({
                selectedTags: selectedTags,
              });
            }
          }
        }
      },
    });
  },

  // 返回上一页
  goBack() {
    // 如果有输入内容或上传图片，提示用户是否放弃
    if (this.data.content || this.data.uploadedImages.length > 0) {
      wx.showModal({
        title: "提示",
        content: "是否放弃编辑？",
        success(res) {
          if (res.confirm) {
            wx.navigateBack();
          }
        },
      });
    } else {
      wx.navigateBack();
    }
  },

  // 发布打卡
  publishLog() {
    // 验证输入
    if (!this.data.content && this.data.uploadedImages.length === 0) {
      wx.showToast({
        title: "请输入内容或上传图片",
        icon: "none",
      });
      return;
    }

    // 显示加载状态
    wx.showLoading({
      title: "正在发布...",
      mask: true,
    });

    const that = this;

    // 上传图片到云存储
    const uploadTasks = this.data.uploadedImages.map((filePath) => {
      return new Promise((resolve, reject) => {
        const cloudPath = `meal_images/${Date.now()}-${Math.random()
          .toString(36)
          .substr(2)}.jpg`;
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: (res) => {
            resolve(res.fileID);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    });

    // 处理所有图片上传
    Promise.all(uploadTasks)
      .then((fileIDs) => {
        // 收集选中的标签
        const selectedTagsList = [];
        for (const tag in this.data.selectedTags) {
          if (this.data.selectedTags[tag]) {
            selectedTagsList.push(tag);
          }
        }

        // 保存打卡记录到云数据库
        const date = new Date();
        return wx.cloud.callFunction({
          name: "addMealLog",
          data: {
            userOpenId: app.globalData.userOpenId,
            mealType: this.data.mealType,
            content: this.data.content,
            imageFileIds: fileIDs,
            foodTags: selectedTagsList,
            mealDate: date.toISOString().split("T")[0], // 格式：YYYY-MM-DD
            createTime: date,
          },
        });
      })
      .then((result) => {
        wx.hideLoading();
        wx.showToast({
          title: "发布成功",
          icon: "success",
        });
      
        // 构建数据：用于跳转传参
        const fileIDs = result.result.fileIDs || []; // 从 addMealLog 云函数返回中获取
        const selectedTagsList = [];
        for (const tag in that.data.selectedTags) {
          if (that.data.selectedTags[tag]) {
            selectedTagsList.push(tag);
          }
        }
      
        const mealData = {
          content: that.data.content,
          imageFileIds: fileIDs,
          foodTags: selectedTagsList,
        };
      
        // 跳转到营养膳食分析页面
        setTimeout(() => {
          wx.navigateTo({
            url:
              "/pages/analysis/analysis?mealData=" +
              encodeURIComponent(JSON.stringify(mealData)),
          });
        }, 1500);
      
        // 延迟返回上一页的操作也在此 block 内进行
        setTimeout(() => {
         /* wx.navigateBack();*/wx.navigateTo({
    url: "/pages/analysis/analysis?mealData=" + encodeURIComponent(JSON.stringify(mealData)),
});
        }, 1500);
      })
      .catch((err) => {
        console.error("发布失败:", err);
        wx.hideLoading();
        wx.showToast({
          title: "发布失败，请重试",
          icon: "none",
        });
      });
    }
});