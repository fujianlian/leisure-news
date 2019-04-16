Page({
  data: {
    /** 
     * 导航数据 
     */
    topNavs: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],

    newsList: [],

    /** 
     * 当前激活的当航索引 
     */
    currentActiveNavIndex: 0,

    /** 
     * 上一个激活的当航索引 
     */
    prevActiveNavIndex: -1,

    /** 
     * scroll-view 横向滚动条位置 
     */
    scrollLeft: 0
  },

  /** 
   * 顶部导航改变事件，即被点击了 
   * 1、如果2次点击同一个当航，则不做处理 
   * 2、需要记录本次点击和上次点击的位置 
   */
  topNavChange: function(e) {
    var nextActiveIndex = e.currentTarget.dataset.currentIndex,
      currentIndex = this.data.currentActiveNavIndex;
    if (currentIndex != nextActiveIndex) {
      this.setData({
        currentActiveNavIndex: nextActiveIndex,
        prevActiveNavIndex: currentIndex
      });
    }
  },

  /** 
   * swiper滑动时触发 
   * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
   * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
   */
  swiperChange: function(e) {
    var prevIndex = this.data.currentActiveNavIndex,
      currentIndex = e.detail.current;
    this.setData({
      currentActiveNavIndex: currentIndex
    });
    if (prevIndex != currentIndex) {
      this.setData({
        prevActiveNavIndex: prevIndex
      });
    }
    this.scrollTopNav();
  },

  /** 
   * 滚动顶部的导航栏 
   * 1、这个地方是大致估算的 
   */
  scrollTopNav: function() {
    /** 
     * 当激活的当航小于4个时，不滚动 
     */
    if (this.data.currentActiveNavIndex <= 3 && this.data.scrollLeft >= 0) {
      this.setData({
        scrollLeft: 0
      });
    } else {
      /** 
       * 当超过4个时，需要判断是向左还是向右滚动，然后做相应的处理 
       */
      var plus = this.data.currentActiveNavIndex > this.data.prevActiveNavIndex ? 60 : -60;
      this.setData({
        scrollLeft: this.data.scrollLeft + plus
      });
    }
  },

  onLoad: function(options) {
    this.getNewsList('gn')
  },

  /**
   * 获取新闻列表
   * 
   * type 新闻类型
   * callback 请求完成回调
   */
  getNewsList(type, callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: type
      },
      success(res) {
        let result = res.data.result
        for (let i = 0; i < result.length; i++) {
          if (!result[i].firstImage.startsWith("http")) {
            result[i].firstImage = "https://" + result[i].firstImage
          }
          if (result[i].firstImage === "") {
            result[i].firstImage = "../../images/placeholder.png"
          }
          result[i].time = result[i].date.substring(11, 16)
        }
        that.setData({
          newsList: result
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  /**
   * 点击跳转详情页
   */
  goDetail(event) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + event.currentTarget.id
    })
  },
})