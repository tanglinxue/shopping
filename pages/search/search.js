// pages/search/search.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
  data: {
    search: true,
    noneHidden: true,
    searchHidden: true,
    recentSearch: [],
    searchValue: '',
  },
  getRecentSearch: function () {
    let recentSearch = wx.getStorageSync('recentSearch');
    this.setData({
      recentSearch
    });
  },
  clearHistory: function () {
    wx.clearStorageSync('recentSearch')
    this.setData({
      recentSearch: []
    })
  },
  goSearch: function (e) {
    this.search(e)
  },
  search: function (e) {
    let that = this
    let keywords;
    e.detail.value ? keywords = e.detail.value : keywords = e.currentTarget.dataset.text,
      that.data.searchValue = keywords;
    if (that.data.searchValue) {
      // 记录最近搜索
      let recentSearch = wx.getStorageSync('recentSearch') || [];
      if (!app.isStrInArray(keywords, recentSearch)) {
        recentSearch.unshift(that.data.searchValue);
        wx.setStorageSync('recentSearch', recentSearch)
        that.setData({
          recentSearch: recentSearch
        })
      }
    }

    wx.request({
      url: app.globalData.urls + '/shop/goods/list',
      data: {
        nameLike: keywords
      },
      success: function (res) {
        if (res.data.code == 0) {
          var searchs = [];
          for (var i = 0; i < res.data.data.length; i++) {
            searchs.push(res.data.data[i]);
          }
          that.setData({
            searchs: searchs,
            searchHidden: false,
            noneHidden: true
          });
        } else {
          that.setData({
            searchHidden: true,
            noneHidden: false
          });
        }
      }
    })

  },
  searchFocus: function () {
    this.setData({
      search: false,
      searchInput: true
    })
  },
  searchClose: function () {
    // this.getRecentSearch()
    this.setData({
      search: true,
      searchInput: false,
      searchHidden: true
    })
  },
  toDetailTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-detail/goods-detail?id=" + e.currentTarget.dataset.id
    })
  },
})
