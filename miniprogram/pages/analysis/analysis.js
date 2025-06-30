Page({
    data: {
      mealLog: null,  // 最新的饮食打卡记录
      analysisResult: null,  // 分析结果
    },
  
    onLoad() {
      this.getLatestMealLog();
    },
  
    // 获取最新的饮食打卡记录
    getLatestMealLog() {
      const that = this;
      wx.cloud.callFunction({
        name: 'getMealLog',  // 调用云函数获取最新打卡记录
        success(res) {
          if (res.result.code === 200) {
            that.setData({
              mealLog: res.result.data,  // 保存最新的打卡记录
            });
  
            // 获取分析数据
            that.getMealAnalysis(res.result.data);
          } else {
            wx.showToast({
              title: '未找到打卡记录',
              icon: 'none',
            });
          }
        },
        fail(err) {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
          });
          console.error('云函数调用失败:', err);
        }
      });
    },
  
    // 调用 API 获取饮食分析数据
    getMealAnalysis(mealLog) {
      const that = this;
      // 获取打卡记录中的餐次和第一张图片
// 从打卡记录中获取餐次（meal_type）
// 确保 mealLog.meal_type 存在，否则用空字符串代替
const originalMealTime = mealLog.meal_type || "";  
// 去掉 "餐" 字
const mealTime = originalMealTime.replace("餐", "");
// 格式化后的餐次即为 formattedMealTime
console.log("格式化后的餐次：", mealTime);


      const firstImage = mealLog.images && mealLog.images.length > 0 ? mealLog.images[0] : null;
  
      if (firstImage && mealTime) {
        // 使用 wx.cloud.getTempFileURL 获取云存储图片的临时 URL
        wx.cloud.getTempFileURL({
          fileList: [firstImage],
          success: function (downloadRes) {
            if (downloadRes.fileList && downloadRes.fileList.length > 0) {
              const tempFileURL = downloadRes.fileList[0].tempFileURL;
  
              // 使用下载的 URL 调用 wx.downloadFile
              wx.downloadFile({
                url: tempFileURL,  // 云文件的临时 URL
                success: function (downloadFileRes) {
                  if (downloadFileRes.statusCode === 200) {
                    const localPath = downloadFileRes.tempFilePath;
  
                    // 把图片转换成 Base64
                    wx.getFileSystemManager().readFile({
                      filePath: localPath,  // 本地路径
                      encoding: 'base64',
                      success: res => {
                        const base64Image = res.data;
  // 输出 Base64 数据到控制台
  console.log("Base64 图片数据：", base64Image);
                        // 构造 API 请求体
                        const mealData = {
                          dish_image: base64Image,
                          weight: 100,             // 固定为 100 克
                          time: mealTime
                        };
                        console.log("发送给 API 的 weight：", mealData.weight);
                        // 发起请求
                        wx.request({
                          url: 'https://chat.shifang.co/vlm/jiankangyi_nuri', // 替换为你的 API 地址
                          method: 'POST',
                          data: {
                            mealData: mealData
                          },
                          success: res => {
                            if (res.data.code === "10000") {
                              // 处理成功的分析结果
                              console.log("分析成功:", res.data);
                            } else {
                              // 如果返回的 code 不是 10000，表示出现了问题
                              console.error("API 返回错误:", res.data);
                              wx.showToast({
                                title: res.data.message || '分析失败',
                                icon: 'none',
                              });
                            }
  
                            // 在这里处理返回的分析结果，比如 setData 到页面上
                            that.setData({
                              analysisResult: res.data  // 保存分析结果
                            });
                          },
                          fail: err => {
                            console.error("请求失败：", err);
                            wx.showToast({
                              title: '请求失败，请稍后重试',
                              icon: 'none'
                            });
                          }
                        });
                      },
                      fail: err => {
                        console.error("读取图片失败：", err);
                        wx.showToast({
                          title: '读取图片失败，请检查图片格式',
                          icon: 'none'
                        });
                      }
                    });
                  } else {
                    console.error("下载文件失败，状态码：", downloadFileRes.statusCode);
                    wx.showToast({
                      title: '下载图片失败，请稍后重试',
                      icon: 'none'
                    });
                  }
                },
                fail: err => {
                  console.error("下载文件失败：", err);
                  wx.showToast({
                    title: '下载图片失败，请稍后重试',
                    icon: 'none'
                  });
                }
              });
            }
          },
          fail: function (err) {
            console.error("获取临时 URL 失败：", err);
            wx.showToast({
              title: '获取图片失败，请稍后重试',
              icon: 'none'
            });
          }
        });
      } else {
        console.warn("缺少图片或餐次信息，无法调用 API");
        wx.showToast({
          title: '缺少图片或餐次信息，无法分析',
          icon: 'none'
        });
      }
    },
  });
  