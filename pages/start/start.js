import StartModel from '../../models/Start.js'
const startModel = new StartModel();
const app = getApp();
Page({
	data:{
		rct:'',
		rcj:'',
		uid:''
	},
	onLoad: function(options) {
		
		if(options.rct){
			this.setData({
				rct:options.rct
			})
			if(options.rcj){
				let rcj = decodeURIComponent(options.rcj);
				rcj = JSON.parse(rcj)
        if (rcj.uid){
          this.setData({
            uid: rcj.uid
          })
        }
				this.setData({
					rcj
				})
			}
		}
    // 二维码
		if(options.scene){
			 let scene = decodeURIComponent(options.scene);
			 let [rct,uid,rcj]=scene.split('$');
			 console.log(rct,uid,rcj)
			 this.setData({
				 rct,
				 uid,
				 rcj, 
			 })
		}
		this.render()
	},
	render() {
		
		startModel.wxLogin().then(
			res => {
				if (res) {
					// 获取code
					let params = {
						code: res.code
					}
					if(this.data.uid){
						params.flag=this.data.uid;
					}
					return startModel.login(params)
				}
			}
		).then(res => {
			if (res) {
				// 将用户信息存入全局
				app.globalData.userInfo = res;
				return startModel.getconfig({
					type: 2
				})
			}
		}).then(res => {
			if (res) {
				// 将配置信息存入全局
				app.globalData.category_info = res.category_info;
				app.globalData.myShare = res.config_info;
				app.globalData.send_goods_submsg=res.send_goods_submsg
				startModel.getSystemInfo();
				let {rct,rcj} = this.data;
				if(rct){
					if(rct==1){
						// 详情
						wx.redirectTo({
							url:`/pages/goods-detail/goods-detail?good_id=${rcj.good_id}`
						})
					}else if(rct==2){
						// 去首页
						wx.switchTab({
							url:'/pages/index/index'
						})
					}else if(rct==3){
            //二维码去详情
						wx.redirectTo({
							url:`/pages/goods-detail/goods-detail?good_id=${rcj}`
						})
          } else if (rct == 4) {
            //待收货页面
            wx.redirectTo({
              url: `/pages/order-list/order-list?type=2`
            })
          }
				}else{
					// 进入首页
					wx.switchTab({
						url: '/pages/index/index',
					})
				}
				
			}
		})
	}

})
