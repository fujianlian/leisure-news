// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: "",
    contentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.getNewsDetail(id)
  },

  /**
   * 获取新闻详情
   * 
   * id 新闻id
   */
  getNewsDetail(id) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: id
      },
      success(res) {
        let result = res.data.result
        result.readCount = "阅读 " + result.readCount
        result.date = result.date.substring(11, 16)
        let contents = result.content
        let content = []

        for (let i = 0; i < contents.length; i++) {
          content.push({
            type: contents[i].type,
            show: contents[i].type === 'image' ? that.verify(contents[i].src) : contents[i].text,
          })
        }
        that.setData({
          detailData: result,
          contentList: content,
        })
      }
    })
  },

  /**
   * 验证图片url是否合法
   */
  verify(url) {
    if (!url.startsWith("http")) {
      url = "https://" + url
    }
    return url
  },
})