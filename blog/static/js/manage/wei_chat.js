var linkApp4 = function (val, item) {
    return val
};
//列宽自适应表格宽度
var cols6 = [{

    title: '用户头像',
    name: 'nickname',
    width: 60,
    align: 'center',
    // renderer: linkApp4,
    renderer: function (val, item) {
        var temp = "<img style='width: 60px; height: 60px; border-radius: 50%;' src='" + item.headimgurl + "' onerror=this.src='http://a.56iq.net/images/share/head.png'>" +
            '<br/>' +
            '<span title = " ' + item.nickname + '">' + item.nickname + '</span>';
        return temp;
    }

},
    {
        title: 'openid',
        width: 60,
        align: 'center',
        renderer: function (val, item) {
            var temp = '<span title = " ' + item._id + '">' + item._id + '</span>';
            return temp;
        }
    },
    {
        title: '性别',
        width: 60,
        align: 'center',
        renderer: function (val, item) {

            if (item.sex == "1") {
                return "<span style='font-size: 15px;line-height: 50px;'>男</span>";
            } else if (item.sex == "2") {
                return "<span style='font-size: 15px;line-height: 50px;'>女</span>";
            }
            else {
                return "<span style='font-size: 15px;line-height: 50px;'>未知</span>";
            }

        }

    }, {
        title: '省份',
        name: 'province',
        width: 60,
        align: 'center',
        renderer: linkApp4
    }, {
        title: '城市',
        name: 'city',
        width: 60,
        align: 'center',
        renderer: linkApp4
    }, {
        title: '关注时间',
        width: 60,
        align: 'center',
        renderer: function (val, item) {

            var time = item.subscribe_time;
            var finall = time * 1000;
            var q = new Date(finall);
            var year = q.getFullYear();
            var month = q.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }

            var date = q.getDate();
            if (date < 10) {
                date = "0" + date;
            }

            var hour = q.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }

            var minute = q.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }

            var second = q.getSeconds();
            if (second < 10) {
                second = "0" + second;
            }

            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;

        }

    }];


function renderGrid(url) {
    var mmg = $('#table6-1').mmGrid({
        cols: cols6,
        height: "auto",
        url: url,
        method: 'get',
        remoteSort: true,
        fullWidthRows: true,
        sortName: 'SECUCODE',
        sortStatus: 'asc',
        nowrap: true,    // 超出表格长度就显示'...'
        plugins: [$('#paginator11-1').mmPaginator()],
        params: function () {
            //如果这里有验证，在验证失败时返回false则不执行AJAX查询。
            var obj = {};
            obj.action = "getdata";
            return obj
        }
    });
    return mmg;
}

$(function () {
    //渲染表格
    var mmg = renderGrid("/manage/wechat_user?action=getdata");

})