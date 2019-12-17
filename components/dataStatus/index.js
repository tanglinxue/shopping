Component({
    properties: {
        title1: {
            type: String,
            value: "↓ 下拉加载更多商品 ↓",
        },
        title2: {
            type: String,
            value: "商品已加载完毕",
        },
        title3: {
            type: String,
            value: "暂无商品数据",
        },
		haveData:{
			type: Boolean,
			value: false,
		},
		loadEnd:{
			type: Boolean,
			value: false,
		}
    },
    methods: {},
});