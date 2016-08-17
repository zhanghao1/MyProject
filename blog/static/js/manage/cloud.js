/**
 * Created by tsengdavid on 11/13/15.
 */
var edit = function (val, item) {      //对“操作”一栏禁用，启用进行设置
    var btnVal = "禁用";
    //var res = '<a style="color: #3c8dbc" href="statistics_app_detail?token=' + item._id + '">编辑</a>';
    if (item.is_forbid) {
        btnVal = "启用"
    }

    var res = '  <a style="color: #3c8dbc" class="cloud-control" href="javascript:"  data-token="' + item._id + '" data-status="' + item.is_forbid + '">' + btnVal + '</a>';

    return res
};

var is_forbid = function (val, item) {
    if (val) {
        return '<span style="color:red">禁用</span>';
    } else {
        return '<span style="color:green">启用</span>';
    }
}

var linkApp4 = function (val, item) {
    return val
};
//列宽自适应表格宽度
var cols6 = [{
    title: "token",
    name: '_id',
    width: 80,
    align: 'center',
    renderer: linkApp4
}, {
    title: '别名',
    name: 'alias',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '备注',
    name: 'remarks',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '状态',
    name: 'is_forbid',
    width: 60,
    align: 'center',
    renderer: is_forbid
}, {
    title: '允许文件类型',
    name: 'file_type',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '允许ip',
    name: 'ip_list',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '操作',
    name: null,
    width: 60,
    align: 'center',
    renderer: edit
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
    var mmg = renderGrid("/manage/cloud?action=getdata");

    $(document).delegate(".cloud-control", "click", function () {

        var token = $(this).attr("data-token");

        var status = $(this).attr("data-status") == "false" ? "禁用" : "启用";
        if (confirm("确定要" + status + "吗？")) {
            $.ajax({
                url: location.href,
                type: "POST",
                data: {"action": "change", "token": token, "status": status},
                success: function (res) {

                    var obj = JSON.parse(res);
                    if (obj.code == 0) {
                        location.reload();
                    } else {
                        alert("操作失败")
                    }
                }
            })
        }
    });
    //加载服务器信息
    $.ajax({
        url: location.href,
        type: "GET",
        data: {"action": "server-info"},
        success: function (res) {
            var obj = JSON.parse(res);
            if (obj.code != 0) {
            } else {
                var severObj = {};
                severObj.servers = [];
                $.each(obj.data, function (index, item) {
                    /*
                     * 需要获取的信息
                     * 1.磁盘总空间、剩余空间
                     * 2.各个服务器的健康状况
                     * */
                    if (item.indexOf("disk total space") >= 0) {
                        severObj.totalspace = item.split("=")[1];
                    }
                    if (item.indexOf("disk free space") >= 0) {
                        severObj.freespace = item.split("=")[1];
                    }
                    if (item.indexOf("ip_addr") >= 0) {
                        severObj.servers.push(item.split("=")[1]);
                    }
                });

                var html = new EJS({url: htmlTpl}).render(severObj);
                $("#serverInfo").html(html)
            }
        }
    })
})