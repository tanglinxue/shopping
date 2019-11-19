import HomeModel from '../../models/Home.js'
const homeModel = new HomeModel()
// 首页
Page({
	data: {
		banners: [], //banners集合
		lists: [], //商品集合
		indexMenus: [ //menu数据
			{
				src: 'https://cdn.it120.cc/apifactory/2019/01/15/194c9c85d68360a6da67f25952fb3b1d.png',
				name: '类别'
			},
			{
				src: 'https://cdn.it120.cc/apifactory/2019/01/15/853402dac05c9b25fbe493d5dce44638.png',
				name: '购物车'
			},
			{
				src: 'https://cdn.it120.cc/apifactory/2019/01/15/3e4a6ebb4acfdfc9033c30102b36fef5.png',
				name: '订单'
			}
		],
		page:1//页数
	},
	onLoad() {
		this.render()
	},
	render(){
		homeModel.showLoading()
		this.getBanners()
		this.getGoodsList()
	},
	// 获取banner数据
	getBanners() {
		let params = {
			type: 'home'
		}
		homeModel.getHomeBanner(params)
			.then(res => {
				this.setData({
					banners: res.data
				});
			})
	},
	//获取商品列表
	getGoodsList() {
		let page = this.data.page
		let params = {
			type: 1,
			page
		}
		homeModel.getGoodsList(params)
			.then(res => {
        if(res){
          let { data:lists } = res.goods_list;
          this.setData({
            lists
          })
        }
				
				wx.hideLoading()
			})
	},
	// 跳转
	jumptap(e) {
		let index = e.currentTarget.dataset.index;
		if (index === 0) {
			//类别
			wx.switchTab({
				url: '/pages/cate/cate'
			})
		} else if (index === 1) {
			//购物车
			wx.switchTab({
				url: '/pages/cart/cart'
			})
		} else if (index === 2) {

		}
	}

})
