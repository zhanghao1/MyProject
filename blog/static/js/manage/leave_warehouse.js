/**
 * Created by rdy on 12/24/15.
 */

//列宽自适应表格宽度
var cols = [{
    title: "设备编号",
    name: 'device_alias',
    sortable: true,

    renderer: function (val, item) {

        return '<a style="color:rgb(51, 51, 51)">' + item.alias + '</a>';

    }
}, {
    title: '在线状态',
    name: 'device_is_online',
    sortable: true,
    width: 60,
    align: 'center',
    renderer: function (val, item) {

        if (item.is_online == "0") {
            return "离线";
        }
        else if (item.is_online == "1") {
            return "<span style='color:green'>在线</span>";


        }
        else {
            return "未知";
        }

    }
}, {
    title: '设备类别',
    name: 'pay_trade_no',
    // sortable: true,
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        var dt_id = item.dt_id;
        if (dt_id == 1) {
            return "油烟机";
        }
        else if (dt_id == 2) {
            return "集成灶";
        }
        else {
            return "未知";
        }
    }
}, {
    title: '激活时间',
    name: 'device_create_date',
    width: 60,
    sortable: true,
    align: 'center',
    renderer: function (val, item) {
        return item.create_date;
    }
}, {
    title: '所属厂家',
    name: 'factory_name',
    width: 60,
    //sortable: true,
    align: 'center',
    renderer: function (val, item) {
        return item.factory_name;
    }
}, {
    title: '省市',
    name: 'pay_trade_no',
    // sortable: true,
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.address;

    }
}, {
    title: '当前版本',
    name: 'pay_trade_no',
    // sortable: true,
    width: 60,
    align: 'center',
    renderer: function (val, item) {
        return item.version
    }
}];
function renderGrid(url) {
    var mmg = $('#table7-1').mmGrid({
        cols: cols,
        height: "auto",
        url: url,
        method: 'get',
        remoteSort: true,
        fullWidthRows: true,
        checkCol: true,  //表格显示checkbox
        multiSelect: true, //行多选
        sortName: 'SECUCODE',
        sortStatus: 'asc',
        nowrap: true,
        plugins: [$('#paginator11-1').mmPaginator()],
        params: function () {
            //如果这里有验证，在验证失败时返回false则不执行AJAX查询。
            var obj = {};
            obj.action = 'getonlinestatus';
            //设备编号
            var device_alias = $("#txtId").val();
            if (!isNull(device_alias)) {
                obj.device_alias = device_alias;
            }
            return obj
        }
    });
    return mmg;

}
function isNull(data) {

    if (data.indexOf("请") > -1) {     //查找是否存在"请"
        return true
    }
    return /^\s*$/gi.test(data)
}
function removeErrorHtml(selector) {
    selector.next().remove();
    selector.parent().removeClass('has-error');
}

function insertErrorHtml(selector, msg) {
    selector.next().remove();
    selector.after('<label class="control-label" for="inputError"><i class="fa fa-times-circle-o"></i>' + msg + '</label>');
    selector.parent().addClass('has-error');
}
$(function () {

    //渲染表格
    var mmg = renderGrid(url.get_device_data);


    $("#btnFilter").bind("click", function () {        // 选的是什么 ？
        ($('#reservation').val());
        // 筛选后重新加载表格数据
        var ha = {'page': 1};
        mmg.load(ha);
    });


    $("#infoSave").bind("click", function () {        // 资料维护
        var items = mmg.selectedRows();
        var alias_list = [];
        for (var i = 0; i < items.length; i++) {
            alias_list.push(items[i].alias)
        }


        var ejs = new EJS({url: url.edit_device_info});   //"资料维护按钮"
        if (items.length > 0) {
            bootbox.dialog({
                title: "统一编辑所选设备",
                message: ejs.render(datas),
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn"
                    },
                    success: {
                        label: "保存",
                        className: "btn-success",
                        callback: function () {
                            var factory_id = $('#factory-sel option:selected').val();
                            var agency_id = $('#agency-sel option:selected').val();
                            var device_type = $('#device-type-sel option:selected').val();
                            var batch = $("#batch-info");
                            var batch_info = batch.val();
                            if (factory_id == '0') {
                                insertErrorHtml($('#factory-sel'), '请选择厂家帐号');
                                return false;
                            }
                            //else if (agency_id == '0') {
                            //    insertErrorHtml($('#agency-sel'), '请选择代理商帐号');
                            //    return false;
                            //}
                            else {
                                removeErrorHtml($('#factory-sel'));
                                removeErrorHtml($('#agency-sel'));
                                console.log(alias_list);
                                var data_obj = {
                                    action: 'save',
                                    factory_id: factory_id,
                                    agency_id: agency_id,
                                    device_type: device_type,
                                    batch_info: batch_info,
                                    alias_list: JSON.stringify(alias_list)
                                };
                                $.ajax({
                                    url: location.href,
                                    type: "POST",
                                    data: data_obj,
                                    beforeSend: function () {

                                    },
                                    success: function (res) {
                                        if (res == 'ok') {
                                            dwnotify('信息保存成功')
                                        }
                                        else {
                                            dwerror('信息保存失败')
                                        }


                                    },
                                    error: function (res) {
                                        dwerror('信息保存失败')
                                    }
                                })
                            }

                        }
                    }

                }
            });
        }
        else {
            bootbox.alert("请选择要处理的设备");
        }
    });
    $("#BtnExport").click(function () {
        alert('现在还不能导出')
    })
});



function my_bind() {                           // 哪里有 下拉菜单？？？？
    // 厂家下拉菜单改变绑定事件

    $("#factory-sel").change(function () {
        var factory_id = $('#factory-sel option:selected').val();
        removeErrorHtml($('#factory-sel'));
        console.log(factory_id);
        $.ajax({
            url: location.href,
            type: "POST",
            data: {action: 'ask', factory_id: factory_id},
            beforeSend: function () {

            },
            success: function (data) {
                if (data == 'no') {
                    $(".ui-add-option").remove();
                }
                else {
                    $(".ui-add-option").remove();
                    data = JSON.parse(data);
                    console.log(data);
                    $.each(data, function (index, item) {
                        var html = '<option class="ui-add-option" value="' + item.agency_id + '">' + item.agency_name + '</option>';
                        $("#agency-sel").append(html);
                    })
                }
            },
            error: function (res) {

            }
        })
    });
    $('#agency-sel').change(function () {
        removeErrorHtml($('#agency-sel'));
    })
}
