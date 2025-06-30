Page({
  data: {
    historyList: [], // 打卡历史记录
  },

  onLoad: function (options) {
    // 页面初始化
    this.loadHistoryData();
  },

  onShow: function () {
    // 每次页面显示时刷新数据
    this.loadHistoryData();
  },

  // 跳转到对应餐点打卡页面
  navigateToMeal: function (e) {
    const mealType = e.currentTarget.dataset.type;
    console.log(`跳转到${mealType}打卡页面`);

    // 根据不同餐点类型跳转到不同打卡页面
    wx.navigateTo({
      url: `/pages/meallog/meallog?type=${mealType}`,
    });
  },

  // 加载打卡历史记录
  loadHistoryData: function () {
    const that = this;

    // 从用户的打卡记录中加载数据
    // 这里可以调用云函数或直接查询云数据库

    // 示例数据，实际应用中应从数据库获取
    /*
    that.setData({
      historyList: [
        { id: 1, date: '2025-04-14', mealType: '早餐' },
        { id: 2, date: '2025-04-14', mealType: '午餐' },
        { id: 3, date: '2025-04-13', mealType: '晚餐' }
      ]
    });
    */
  },
});
