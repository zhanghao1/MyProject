/**
 * Created by lujin on 16-3-14.
 *
 * 简化mmgrid创建
 */


var mmgrid = (function () {
    return {
        initCol: function (setting) {
            var defaultSetting = {
                title: "",
                width: 60,
                align: 'center',
                name: '',
                sortable: false,
                nowrap: false,
                hidden: '',
                // 表示 转换函数
                convert: '',
                renderer: function (val, item) {
                    return val;
                }
            };
            $.extend(defaultSetting, setting);
            if (setting.render) {
                defaultSetting['renderer'] = function (val, item) {
                    return setting.render(val, item, defaultSetting);
                };
            }
            return defaultSetting;
        },

        /**
         * 表格适配
         * @param value
         * @returns {boolean}
         */
        adapter: function(value){
            return window.screen.width < parseInt(value);
        },

        generateGridCols: function(cols){
            var items = [];
            for (var i=0; i<cols.length; i++){
                items.push(mmgrid.initCol(cols[i]));
            }
            return items;
        },

        renderHeaderHtml: function (val, item) {
            var defaultHead = '/static/img/head.png';
            var html = '<dl class="user-info"><dt>';
            html += '<img src="' + item.user_head_url + '" width="40" height="40" onerror="this.src=\'' + defaultHead + '\'" alt=""/>';
            html += "</dt><dd>";
            html += item.user_nickname;
            html += "</dd></dl>";
            return html;
        },

        _renderDetail: function (prefix, val) {
            if (val === '' || val === null) {
                return '';
            } else {
                if (prefix === '' || prefix === null) {
                    return '<span title="' + val + '">' + val + '</span>';
                } else {
                    return '<a title="' + val + '" target="_blank" style="color: #3c8dbc" href="' + prefix + val + '">' + val + '</a>'
                }
            }
        },
        /**
         * 渲染用户详情页面
         * @param val
         * @param item
         * @returns {*}
         */
        renderUserDetail: function (val, item) {
            var prefix = '/device/user/user_detail/';
            return mmgrid._renderDetail(prefix, val)
        },
        /**
         * 渲染厂商微信公众号详情页面
         * @param val
         * @param item
         * @returns {*}
         */
        renderWechatDetail: function (val, item) {
            var prefix = '/device/wechat_detail/';
            return mmgrid._renderDetail(prefix, val)
        },
        /**
         * 渲染设备详情页
         * @param val
         * @param item
         * @returns {*}
         */
        renderDeviceDetail: function(val, item){
            var prefix = '/device/device/detail/';
            return mmgrid._renderDetail(prefix, val)
        },
        /**
         * 渲染订单详情页
         * @param val
         * @param item
         * @returns {*}
         */
        renderOrderDetail: function(val, item){
            var prefix = '/device/account/order_detail/';
            return mmgrid._renderDetail(prefix, val)
        },


        /**
         * 渲染普通的html,可以进行字段转换,设置convert字段一个转换函数即可
         * @param val
         * @param item
         * @param setting
         * @returns {*}
         */
        renderHtml: function (val, item, setting) {
            var convert = setting.convert;
            var text = "";
            if (convert) {
                text = convert(val);
            } else {
                text = val;
            }
            if (text === '') {
                return '';
            } else {
                return '<span title="' + text + '">' + text + '</span>';
            }
        },

        renderLink: function(val, item, setting){
            var convert = setting.convert;
            var text = '';
            if (convert){
                text = convert(val);
            }else{
                text = val;
            }
            if (text === ''){
                return '';
            }else{
                return "<a class='commodity-url' href='" + text + "' target=_blink>浏览</a>";
            }
        },
        
        renderImg: function (val, item, setting) {
            var convert = setting.convert;
            var text = '';
            if (convert){
                text = convert(val);
            }else{
                text = val;
            }
            if (text === ''){
                return '';
            }else{
                return "<img src='" + text + "' width=50 height=50>";
            }
        },

        /**
         * 渲染表格
         * @param table
         * @param setting
         */
        renderGrid: function (table, setting) {
            var defaultSetting = {
                cols: [],
                height: "auto",
                url: '',
                method: 'get',
                remoteSort: true,
                fullWidthRows: true,
                sortName: '',
                sortStatus: 'asc',
                nowrap: true,
                plugins: [],
                params: function () {
                    return {};
                }
            };
            $.extend(defaultSetting, setting);
            if (setting.params){
                defaultSetting.params = function(){
                    return setting.params();
                }
            }
            return table.mmGrid(defaultSetting);
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
})();