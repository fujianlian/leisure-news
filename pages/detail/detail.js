// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 新闻列表
    newsList: [],
    // 当前详情页所在下标
    currentIndex: 0,
    // 详情数据列表
    detailDatas: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let list = JSON.parse(options.list)
    let index = options.index
    let d = []
    for (let i = 0; i < list.length; i++) {
      d.push([])
    }
    this.setData({
      detailDatas: d,
      newsList: list,
      currentIndex: index,
    })
    this.getNewsDetail(this.data.currentIndex)
  },

  /**
   * 获取新闻详情
   */
  getNewsDetail(index) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.newsList[index].id
      },
      success(res) {
        let result = res.data.result
        result.readCount = "阅读 " + result.readCount
        result.date = result.date.substring(11, 16)
        let contents = result.content
        let c = []
        for (let i = 0; i < contents.length; i++) {
          c.push({
            type: contents[i].type,
            show: contents[i].type === 'image' ? that.verify(contents[i].src) : contents[i].text,
          })
        }
        result.content = c
        let d = that.data.detailDatas
        d[index] = result
        that.setData({
          detailDatas: d,
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

  /** 
   * swiper滑动时触发 
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
   */
  swiperChange: function(e) {
    let current = e.detail.current
    if (this.data.currentIndex !== current) {
      this.setData({
        currentIndex: current
      });
      this.swiperRequest(current)
    }
  },

  /**
   * swiper切换请求数据
   */
  swiperRequest(current) {
    if (current === 0) {
      this.judgeRequest(0)
      this.judgeRequest(1)
    } else if (current === this.data.detailDatas.length - 1) {
      this.judgeRequest(current)
      this.judgeRequest(current - 1)
    } else {
      this.judgeRequest(current)
      this.judgeRequest(current - 1)
      this.judgeRequest(current + 1)
    }
  },

  /**
   * 判断页面切换是否需要请求数据
   */
  judgeRequest(index) {
    if (this.data.detailDatas[index].length === 0) {
      this.getNewsDetail(index)
    }
  },
})