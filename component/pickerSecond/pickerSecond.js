Component({
    data: {
        firstList: [{
            name: '全部',
            id: 10,
            children: [{
                name: '全部',
                id: 110
            }]
        },
        {
            name: '小学',
            id: 1,
            children: [{
                name: '语文',
                id: 14
            },
            {
                name: '数学',
                id: 15
            },
            ]
        },
        {
            name: '初中',
            id: 2,
            children: [{
                id: 14,
                name: '语文'
            },
            {
                id: 15,
                name: '数学'
            },
            {
                id: 17,
                name: '英语'
            },
            {
                id: 16,
                name: '物理'
            },
            {
                id: 18,
                name: '化学'
            },
            {
                id: 20,
                name: '道法'
            },
            {
                id: 21,
                name: '历史'
            }
            ]
        }
        ],
        multiArray: [],
        multiIndex: [0, 0],
        industryOneId: 10,
        industryName:['全部','小学','初中'],
        showPickerFlag:false
    },
    methods: {
        bindMultiPickerChange: function (e) {
            var secondList = this.data.secondList;
            var select_key = e.detail.value[1];     //去二维数组中第二项的下标取出来，也就是二级下拉菜单的下标值
            this.setData({
                industryTwoId: secondList[select_key]['id']　　　　　　//  拿到下标值对应的value值就是我们要用的id
            })

            this.setData({
                multiIndex: e.detail.value,
                showPickerFlag:true
            });
            // 通过triggerEvent绑定的myEvent方法，把一级下拉的id和二级下拉的id拿出来
            this.triggerEvent('myEvent', { industryOneId: this.data.industryOneId, industryTwoId: this.data.industryTwoId })

        },

        bindMultiPickerColumnChange: function (e) {
            let that = this;
            var data = {
                multiArray: that.data.multiArray,
                multiIndex: that.data.multiIndex
            };
            data.multiIndex[e.detail.column] = e.detail.value;
            let industryOneId_session = that.data.industryOneId;

            console.log(industryOneId_session)
            switch (e.detail.column) {
                case 0:
                    let firstList = that.data.firstList;
                    var firstId = firstList[e.detail.value]['id'];
                    console.log(firstId)
                    if (industryOneId_session != firstId) { //每次滚动的时候都去和上一个做一次对比
                        that.searchIdInfo(firstId); // searchIdInfo()这个方法
                    }
                    data.multiIndex[1] = 0;
                    break;
            }
        },
        searchIdInfo: function (value) {
            let that = this;
            if (value) {
                that.setData({
                    industryOneId: value   //这个是一级列表中用户选中的value
                });
                that.data.firstList.map(m => {  //firstList是一级分类的数组，上方代码里有
                    if (m.id == value) {  //通过比对查出value对应的这一列
                        that.setData({
                            secondList: m.children   //用户选中的一级分类中的children就是第二列的列表
                        })
                    }
                });
                // console.log(that.data.secondList);
                let industryTwoName = that.data.secondList.map(m => {
                    return m.name    //再遍历secondList把所有的label取出来放入industryTwoName 中用于二级列表的展示
                });
                let industryName = that.data.industryName;
                that.setData({
                    multiArray: [industryName, industryTwoName],  //这就是一个完整的二级联动展示了
                    industryTwoName,
                })
            }
        },
       
    },
    ready: function () {
        this.searchIdInfo(10); 
    },
})