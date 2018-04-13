// import {el} from "../../../../vue-dev/types/options";

// import {value} from "../../../../vue-dev/types/vnode";

// import {el} from "../../../../vue-dev/types/options";

new Vue({
    el:'#app',
    data:{
        //购物车里面的数据
        shopListArr:[],
        //是否全选
        isSelectedAll:false,
        //商品总价格
        totalPrice:0,
        //要删除的商品
        currentDelShop:{}
    },
    //组件以及加载完毕请求网络数据，业务办理
    mounted(){
        //请求本地数据
        this.getLocalData();
    },

    filters:{
        monenyFormat(money){
            return '￥' + money.toFixed(2);
        }
    },

    methods: {
        //1.获取本地数据
        getLocalData() {

            //1. 请求本地数据（0）
            this.$http.get('./data/shop.json').then(response => {
                const res = response.body;
                if (res) {
                    this.shopListArr = res.allShops.shopList;
                }
            },response =>{
                alert('请求数据失败')
            })

        },

        //2.数量加减控制
        getAddNumber(shop,flag){
            if (flag){
                shop.shopNumber += 1;
            }else {
                if (shop.shopNumber <= 1){
                    shop.shopNumber = 1;
                }else{
                    shop.shopNumber -= 1;
                }
            }
            this.getTotalPrice();
        },

        //3.选中全部商品
        selectAll(flag){
            this.isSelectedAll=!flag;

            //遍历所有商品的CheckBox
            this.shopListArr.forEach((value,index) => {
                if(typeof value.checked === 'undefined'){
                    this.$set(value, 'checked',true);
                }else {
                    value.checked = !flag;
                }
            })
            this.getTotalPrice();
        },

        //4.计算选中商品总价格
        getTotalPrice(){
            let totalPrice = 0;
            this.shopListArr.forEach((value,index) => {
                if (value.checked){
                   totalPrice += value.shopPrice * value.shopNumber;
                }
            });
            this.totalPrice = totalPrice;
        },

        //5.单个商品选中（包含计算价格）
        singerShopSelected(shop){
            //遍历所有商品选中状态
            if(typeof shop.checked === 'undefined'){
                this.$set(shop, 'checked',true);
            }else {
                shop.checked = !shop.checked;
            }
            this.getTotalPrice();
            this.hasSelectedAll();
        },

        //6.判断是否全选
        hasSelectedAll(){
            let flag = true;
            this.shopListArr.forEach((value,index) => {
                if (!value.checked){
                    flag = false;
                }

            });
            this.isSelectedAll = flag;
        },

        //7.删除商品弹出面板 记录元素
        clickTrash(shop){
            this.currentDelShop = shop;
        },

        //8.点击确认 删除商品
        deletShop(){
            const index = this.shopListArr.indexOf(this.currentDelShop);
            this.shopListArr.splice(index,1);
        },

    },
})
