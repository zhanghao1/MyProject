/**
 * Created by Administrator on 2016/3/4.
 */


var operate = function (val, item) {  //对“禁用”，“启用”按钮进行功能设定
    var res = '  <a style="color: #3c8dbc" class="id-control" href="javascript:"  agency_uid="' + item.agency_uid + '"  >' + item.role + '</a>';
    return res
};

//列宽自适应表格宽度

var cols = [{
    title: "代理商编号",
    name: 'agency_id',
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.agency_id;
    }
}, {
    title: '厂商',
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.factory_id;
    }
}, {
    title: '代理商',
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.agency_name;
    }
}, {
    title: '代理商标识',
    width: 60,
    renderer: function (val, item) {
        return item.agency_uid;
    }
}, {
    title: '地址',
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.agency_address;
    }
}, {
    title: '联系方式',
    width: 60,
    renderer: function (val, item) {
        return item.agency_contact;
    }
}, {
    title: '备注',
    width: 60,
    renderer: function (val, item) {
        return item.agency_remarks;
    }
}, {
    title: '操作',
    name: null,
    width: 60,
    align: 'center',
    renderer: operate
}];


function renderGrid(url) {
    var mmg = $('#table6-1').mmGrid({
        cols: cols,
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
            var agency_name = $("#txt-agent-name").val();
            var factory_name = $("#txt-factory-name").val();

            if (!isNull(factory_name)) {
                obj.factory_name = factory_name;
            }
            if (!isNull(agency_name)) {
                obj.agency_name = agency_name;
            }
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
    var mmg = renderGrid("/manage/get_agency_data");
    var agency_name = $('#agency_name').val();
    var factory_name = $('#factory_name').val();
    $.ajax({
        type: "POST",
        url: "/manage/get_agency_data",
        data: {"agency_name": agency_name, "factory_name": factory_name}
    });


    $("#btnFilter").bind("click", function () {
        // 筛选后重新加载表格数据
        mmg.load();
    });

});


$(document).delegate(".id-control", "click", function () {
    var uid = $(this).attr("agency_uid");
    // 得到options
    $.ajax({
        type: "POST",
        url: location.href,
        data: {"action": "get_id_option", "uid": uid},
        success: function (msg) {
            var obj = JSON.parse(msg);
            $(".user-list").remove();  // 先将上一个的option进行删除

            if (obj["role_name"] == -1) {                                     // 没有被分配过
                var txt1 = ('<option class="user-list" value="-1"> --请选择-- </option>');
                $("#ui-user-type").append(txt1);
            }
            else {
                var txt1 = ('<option class="user-list" value="-1"> ' + obj["role_name"] + ' </option>');   // 分配过，在第一条显示option
                $("#ui-user-type").append(txt1);
            }
            for (var i = 0; i < obj["all_items"].length; i++) {                     // 加载其他的options
                var txt2 = ('<option class="user-list" value="' + obj["all_items"][i]["id"] + '">' + obj["all_items"][i]["name"] + '</option>');
                $("#ui-user-type").append(txt2);
            }
            $('#myModal').modal({show: true});
        }
    });


    $("#btn-save-agency").unbind();  // 取消上次的绑定“保存”的功能

    $('#btn-save-agency').click(function () {

        // 分配角色弹框的保存按钮
        $('#myModal').modal('hide');
        console.log("..", this);
        if (confirm("确定要对" + uid + "分配角色吗？")) {
            var user_role = $('#ui-user-type option:selected').val();

            $.ajax({
                type: "POST",
                url: location.href,
                data: {"action": "save_role", "uid": uid, "user_role": user_role},
                success: function (msg) {
                    var obj = JSON.parse(msg);
                    alert(obj);
                     location.href = location.href;
                }
            });
        }
        else {
            $('#myModal').modal('hide');
        }
    });

});