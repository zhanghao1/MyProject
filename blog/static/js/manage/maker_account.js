/**
 * Created by tsengdavid on 11/13/15.
 */
$("#ui-maker-menu").show();

//本地数据
//列宽自适应表格宽度
var cols6 = [{
    title: '用户头像',
    width: 60,
    align: 'center',
    renderer: function (val, item) {

        return "<img style='width: 60px; height: 60px; border-radius: 50%;' src='" + item.ebf_user_headurl + "' onerror=this.src='http://a.56iq.net/images/share/head.png'>";
    }
}
    ,
    {
        title: "用户名称",
        name: 'ebf_user_id',
        sortable: true,
        width: 50,
        align: 'center',
        renderer: function (val, item) {

            return "<a href='get_maker_account?id=" + item.ebf_user_id + "' style='font-size: 15px;line-height: 50px;'>" + item.ebf_user_nickname + "</a>";
        }
    }, {
        title: "所属厂家",
        name: 'ebf_factory_id',
        sortable: true,
        width: 40,
        align: 'center',
        renderer: function (val, item) {

            return "<em style='font-size: 15px;line-height: 50px;'>" + item.ebf_factory_name + "</em>";
        }
    }, {
        title: '性别',

        width: 30,
        align: 'center',
        renderer: function (val, item) {
            if (item.ebf_user_gender == "0") {
                return "<span style='font-size: 15px;line-height: 50px;'>保密</span>";
            } else if (item.ebf_user_gender == "1") {
                return "<span style='font-size: 15px;line-height: 50px;'>男</span>";
            }
            else {
                return "<span style='font-size: 15px;line-height: 50px;'>女</span>";
            }

        }
    }, {
        title: '在线状态',
        name: 'ebf_user_is_online',
        sortable: true,
        width: 30,
        align: 'center',
        renderer: function (val, item) {
            if (item.ebf_user_is_online == "0") {
                return "<span style='font-size: 15px;line-height: 50px;'>离线</span>";
            } else if (item.ebf_user_is_online == "1") {
                return "<span style='font-size: 15px;line-height: 50px;color:green'>在线</span>";
            }
            else {
                return "<span style='font-size: 15px;line-height: 50px;'>未知</span>";
            }

        }
    }, {
        title: '最近一次登录',
        name: 'ebf_user_login_date',
        sortable: true,
        width: 50,
        align: 'center',
        renderer: function (val, item) {
            return "<span style='font-size: 15px;line-height: 50px;'>" + item.ebf_user_login_date + "</span>";
        }
    }, {
        title: '创建时间',
        name: 'ebf_user_create_date',
        sortable: true,
        width: 60,
        align: 'center',
        renderer: function (val, item) {
            return "<span style='font-size: 15px;line-height: 50px;'>" + item.ebf_user_create_date + "</span>";
        }
    }, {
        title: '编辑',

        width: 60,
        align: 'center',
        renderer: function (val, item) {
            var user_id = item.ebf_user_id;
            return "<input class='btn btn-default'  type='button' value='编辑账户信息' onclick=editFun('" + user_id + "')>";

        }
    }];
function renderGrid(url) {
    var mmg = $('#table8-1').mmGrid({
        cols: cols6,
        height: "auto",
        url: url,
        method: 'get',
        remoteSort: true,
        fullWidthRows: true,
        sortName: 'SECUCODE',
        sortStatus: 'asc',
        nowrap: true,
        plugins: [$('#paginator11-1').mmPaginator()],
        params: function () {
            //如果这里有验证，在验证失败时返回false则不执行AJAX查询。
            var obj = {};

            //设备编号
            var maker_alias = $("#txtId").val();
            var factory_id = $("#ui-factory-id").val();
            if (!isNull(maker_alias)) {
                obj.maker_alias = maker_alias;
            }
            obj.factory_id = factory_id;

            return obj
        }
    });
    return mmg;
}
function isNull(data) {
    if (data.indexOf("请") > -1) {
        return true
    }
    return /^\s*$/gi.test(data)
}

$(function () {
    //渲染表格

    var mmg = renderGrid("get_maker_account");
    $("#btnFilter").bind("click", function () {

        // 筛选后重新加载表格数据
        var ha = {'page': 1};
        mmg.load(ha);
    })

});
function editFun(id) {

    window.location.href = 'set_maker_account?action=edit&user_id=' + id;
    //   alert(id);
}