$(function () {
    // 加载头像
    // if ($.cookie("COOKIE_LOGIN_HEAD")) {
    // $("#imgHead").attr("src", $.cookie("COOKIE_LOGIN_HEAD"));
    // }
    // 初始化皮肤选项
    var skin = $("body").attr("class");
    var items = $("#changeSkin li");
    $.each(items, function (index, item) {
        if ($(item).attr("data-class") == skin) {
            //alert(1);
            $(item).children("a").text($(item).children("a").text() + "√");
        } else {
            //alert(2);
            $(item).children("a").text(
                $(item).children("a").text().replace("√", ""));
        }
    });
    // 换肤
    $("#changeSkin").delegate("li", "click", function () {
        var skin = $(this).attr("data-class");
        var items = $("#changeSkin li a");
        $.each(items, function (index, item) {
            var txt = $(item).text();
            txt = txt.replace("√", "");
            $(item).text(txt);
        });
        $("body").attr("class", skin);
        $(this).children("a").text($(this).children("a").text() + "√");
        // 将信息保存到服务器
        $.ajax({
            url: "/device/setup",
            type: "POST",
            data: {
                "t": "change-skin",
                "skin": skin
            },
            success: function (res) {
                if (res != 1) {
                    dwerror("修改失败");
                }
            }
        });
    });
    // 初始化左侧菜单样式
    var url = location.href.split('/');
    var uri = url[url.length - 1];
    uri = uri.split("#")[0];
    uri = uri.split("?")[0];
    // console.log(uri);
    var items = $(".sidebar-menu li a");
    $.each(items, function (index, item) {
        var hrefs = $(item).attr("href").split("/");
        var href = hrefs[hrefs.length - 1];
        // console.log("href:" + href);
        if (href == "#") {
            var childItems = $(item).siblings("ul").children("li")
                .children("a");
            $.each(childItems, function (index1, item1) {
                var href1s = $(item1).attr("href").split("/");
                var href1 = href1s[href1s.length - 1];
                href1 = href1.split("#")[0];
                href1 = href1.split("?")[0];
                // console.log("href1:" + href1);
                if (href1 == uri) {
                    $(item1).parent("li").addClass("active").parent("ul")
                        .show().parent("li").addClass("active");
                }
            });
        } else {
            href = href.split("#")[0];
            href = href.split("?")[0];
            if (href == uri) {
                $(item).parent("li").addClass("active");
            } else {
                $(item).parent("li").removeClass("active");
            }
        }
    });
});
// 右下角提示消息（成功）
function dwnotify(msg) {
    $(".bottom-right").notify({
        message: {
            text: msg
        }
    }).show();
    setTimeout(function () {
        $(".bottom-right").html("")
    }, 10000)
}
function dwerror(msg) {
    $(".bottom-right").notify({
        message: {
            text: msg
        },
        type: "danger"
    }).show();
    setTimeout(function () {
        $(".bottom-right").html("")
    }, 10000)
}
$(".close").click(function () {
    $(".bottom-right").hide();
});


/**
 * 消息提示框
 * @param msg
 * @param type
 */
function notify(msg, type) {
    $.notify({
        // options
        icon: 'glyphicon glyphicon-warning-sign',
        title: '提示： ',
        message: msg,
        url: '#',
        target: '_blank'
    }, {
        type: type,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        offset: 50,
        spacing: 10,
        z_index: 100000,
        delay: 2000,
        timer: 1000,
        placement: {
            from: "top",
            align: "center"
        },
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title"><b>{1}</b></span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
}

/**
 * 为mmgrid表格中的数据添加title属性
 * @param text
 * @returns {string}
 */
function createGridHtml(text) {
    if (text == '' || text == null) {
        return '';
    } else {
        return '<span title="' + text + '">' + text + '</span>';
    }
}
// 创建有链接的html,针对地址栏是id，页面上显示别名的情况
function createLinkGridHtml(text1, text2) {
    if (text2 == '' || text2 == null) {
        return '';
    } else {
        if (text1 == '' || text1 == null) {
            return '<span title="' + text2 + '">' + text2 + '</span>';
        }
        else {
            //兼容device_id为8位和9位的情况
            //if(text1.length==9){
            //    dev_id = String(base64encode(text1+String(random(0, 9)))).replace("==", "");
            //}
            //else if(text1.length==8){
            //    dev_id = String(base64encode(text1+String(random(10, 99)))).replace("==", "");
            //}

            return '<a title="' + text2 + '" target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + text1 + '">' + text2 + '</a>'
        }


    }
}
// 创建有链接的html,针对地址栏和页面显示一致的情况
function createNewLinkGridHtml(urlprefix, text2) {
    if (text2 == '' || text2 == null) {
        return '';
    } else {
        if (urlprefix == '' || urlprefix == null) {
            return '<span title="' + text2 + '">' + text2 + '</span>';
        }
        else {
            //兼容device_id为8位和9位的情况
            //if(text1.length==9){
            //    dev_id = String(base64encode(text1+String(random(0, 9)))).replace("==", "");
            //}
            //else if(text1.length==8){
            //    dev_id = String(base64encode(text1+String(random(10, 99)))).replace("==", "");
            //}

            return '<a title="' + text2 + '" target="_blank" style="color: #3c8dbc" href="' + urlprefix + text2 + '">' + text2 + '</a>'
        }


    }
}
/**
 * 获取url中指定的名称参数值
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}

//JSbase64加密
var base64encodechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64decodechars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);


function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64encodechars.charAt(c1 >> 2);
            out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += base64encodechars.charAt((c2 & 0xf) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64encodechars.charAt(c1 >> 2);
        out += base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
        out += base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
        out += base64encodechars.charAt(c3 & 0x3f);
    }
    return out;
}
// 产生范围内随机数
function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}


var WebSite = {
    get_pay: "/device/account/get_pay",
    get_refund: "/device/account/get_refund",
    device_clean: "/device/device/device_clean",
    clean_service: "/device/clean_service",
    // 需要额外拼参数的连接
    order_detail: "/device/account/order_detail/",
    user_detail: "/device/user/user_detail/",
    device_detail: "/device/device/detail/"
};


var Common = {
    /**
     * 设置日期选择控件的最大日期为当前时间
     * @param selector
     * @param single
     */
    setDataRange: function (selector, single) {
        selector.daterangepicker({
            "singleDatePicker": single,
            "maxDate": new Date()
        });
    },
    setLaterDateRange: function(selector, single){
          selector.daterangepicker({
            "singleDatePicker": single,
        });
    },
    /**
     * 判断浏览器是否为IE
     * @returns {boolean}
     */
    validateIE: function () {
        var explorer = window.navigator.userAgent;
        if (explorer.indexOf("Trident") >= 0) {
            // IE 需要使用 Trident 来判断
            return true;
        }
    },
    /**
     * 验证是否为数字
     * @param value
     * @returns {boolean}
     */
    validateNumber: function(value){
        value = value.trim();
        return /^\d+$/.test(value);
    },
    /**
     * 获取当前日期
     * @returns {string}
     */
    getNow: function () {
        var now = new Date();
        var yy = now.getFullYear();
        var mm = now.getMonth() + 1;
        var dd = now.getDate();
        return yy + "-" + mm + "-" + dd;
    },
    /**
     * 验证日期选择控件中的日期区间是否符合规则
     * @param rd
     * @returns {boolean}
     */
    validateRangeDate: function (rd) {
        rd = $.trim(rd);
        return /^\d{4}-\d{2}-\d{2}\s*~\s*\d{4}-\d{2}-\d{2}$/.test(rd);
    },
    /**
     * 判断是否为空值
     * @param data
     * @returns {boolean}
     */
    isNull: function (data) {
        if (data.indexOf("请") > -1) {
            return true
        }
        return /^\s*$/gi.test(data)
    },
    /**
     * 拼接参数
     * @param args
     */
    contactParams: function (args) {
        var obj = {};
        for (var key in args) {
            var val = args[key].val();
            if (!this.isNull(val)) {
                obj[key] = val;
            }
        }
        return obj;
    },
    /**
     * 渲染mmgrid
     * @param table
     * @param cols
     * @param url
     * @param method
     * @param plugins
     * @param paramsFunc
     */
    renderGrid: function (table, cols, url, method, plugins, paramsFunc) {
        return table.mmGrid({
            cols: cols,
            height: "auto",
            url: url,
            method: method,
            remoteSort: true,
            fullWidthRows: true,
            sortName: 'SECUCODE',
            sortStatus: 'asc',
            nowrap: true,
            plugins: [plugins.mmPaginator()],
            params: function () {
                return paramsFunc();
            }
        });
    },
    /**
     * mmgrid绑定过滤事件
     * @param selector
     * @param mmg
     */
    filterGrid: function(selector, mmg){
        selector.bind("click", function () {
            // 筛选后重新加载表格数据
            mmg.load({page: 1});
        });
    }
};

var Convert = {
    /**
     * 字符串转换成日期
     * @param value
     * @returns {Date}
     */
    str2date: function (value) {
        return new Date(value);
    },
    /**
     * 转换退款订单的状态
     * @param status
     * @returns {*}
     */
    convertStatus: function (status) {
        if (status == 0) {
            return "<span style='color:#FF9933'>待处理</span>";
        } else if (status == 1) {
            return "<span style='color:#339933'>已退款</span>";
        } else if (status == 2) {
            return "<span style='color:#FF6666'>拒绝退款</span>";
        } else {
            return "未知";
        }
    },
    /***
     * 转换支付类型
     * @param value
     * @returns {string}
     */
    convertPayType: function (value) {
        if (value == 1) {
            return "支付宝";
        } else if (value == 2) {
            return "微信";
        } else if (value == 3) {
            return "银联";
        } else if (value == 4) {
            return "账户余额";
        } else {
            return "";
        }
    },
    /***
     * 转换是否支付成功
     * @param value
     * @returns {string}
     */
    convertPayIsSuccess: function (value) {
        if (value === 1) {
            return "<span style='color:green'>成功</span>";
        } else {
            return "<span style='color:red'>失败</span>";
        }
    },
    /**
     * 订单类型转换
     * @param value
     * @returns {*}
     */
    convertPayTradeType: function(value){
        if (value === 1){
            return "消费订单";
        }else if(value === 2){
            return "账户充值订单";
        }else{
            return "未知类型";
        }
    },
    /**
     * 转换清洁来源
     * @param value
     * @returns {*}
     */
    convertCleanFrom: function(value){
        if(value == 1){
            return "远程命令";
        }else if(value == 2){
            return "按钮触发";
        }else{
            return "未知来源";
        }
    }
};

var Renderer = {
    /**
     * 渲染支付订单号
     * @param value
     * @param color
     * @returns {string}
     */
    renderPayTradeNo: function(value, color){
        return '<a title="订单号：' + value + '"  style="color: '+color+';" href="'+ WebSite.order_detail + value + '" target="_blank">' + value + '</a>'
    },
    /**
     * 渲染用户名称
     * @param value
     * @param color
     * @returns {string}
     */
    renderUserID: function(value, color){
        return '<a title="账号：' + value + '"  style="color: '+color+';" href="'+ WebSite.user_detail + value + '" target="_blank">' + value + '</a>'
    },

    renderDeviceID: function(id, alias, color){
        return '<a target="_blank" style="color: '+color+'" href="'+ WebSite.device_detail + id + '">' + alias + '</a>';
    },
    renderButton: function(url, name, font_class, a_class){
        return '<a href="'+url+'" class="btn '+a_class+'"> <i class="fa '+font_class+'"></i>'+name+'</a>';
    }
};