/**
 * Created by lujin on 16-3-14.
 */


var CommonConvert=(function(){
    return {
        convertUserType: function (value) {
            var mapping = {
                0: "普通用户",
                1: "管理员",
                2: "厂商",
                3: "运营商"
            };
            return mapping[value]? mapping[value]: "未知类型";
        },

        convertAccountType: function (value) {
            var mapping = {
                0: "平台注册账号",
                1: "QQ帐号",
                2: "微信帐号",
                3: "新浪微博帐号"
            };
            return mapping[value]? mapping[value]: "未知类型";
        },

        convertGoodsLink: function (urls) {
            var url = JSON.parse(urls);
            var key = '';
            if ("taobao" in url) {
                key = 'taobao';
            } else if ("tmall" in url) {
                key = 'tmall';
            }
            else if ("suning" in url) {
                key = 'suning';
            }
            else if ("jd" in url) {
                key = 'jd';
            }
            if (key === ''){
                return '';
            }else{
                return url[key];
            }
        }
    }
})();