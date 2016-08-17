/**
 * Created by rdy on 11/16/15.
 */
    function conver_html(num, text){
    if(num==1){
        return "<span style='color:green' title='"+text+"'>"+text+"</span>";
    }
    else if(num==2){
        return "<span style='color:#3c8dbc' title='"+text+"'>"+text+"</span>";
    }
    else if(num==3){
        return "<span style='color:#ff9900' title='"+text+"'>"+text+"</span>";
    }
    else if(num==4){
        return "<span style='color:#b22222' title='"+text+"'>"+text+"</span>";
    }
    else{
        return "<span title='"+text+"'>"+text+"</span>";
    }
}
        //列宽自适应表格宽度
        var cols = [{
            title: "设备编号",
            name: 'device_alias',
            sortable: true,
            width: 60,
            align: 'center',
            renderer: function (val, item) {
                if (item.dt_id == 1) {
                    return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_alias + '</a>';
                }
                else if(item.dt_id == 2){
                    return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_alias + '</a>';
                }
                else if (item.dt_id == 3) {
                    return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_alias + '</a>';
                }
                else if (item.dt_id == 4) {
                    return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_alias + '</a>';
                }
                else if (item.dt_id == 5) {
                    return '<a target="_blank" style="color: #3c8dbc" href="http://a.56iq.net/manage/Summary.aspx">' + item.device_alias + '</a>';
                }
                else if (item.dt_id == 6) {
                    return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_alias + '</a>';
                }
                else {
                    return '<a style="color:rgb(51, 51, 51)">' + item.device_alias + '</a>';
                }


            }
        }, {
            title: '健康状态',
            name: 'dt_id',
            // sortable: true,
            width: 60,
            align: 'center',
            renderer: function (val, item) {

                //if (item.device_status == "1") {
                //    return "<span style='color:#3c8dbc'>工作中</span>";
                //}
                //else if (item.device_status == "2") {
                //    return "<span style='color:#b22222'>设备故障</span>";
                //}
                //else if (item.device_status == "3") {
                //    return "<span style='color:green'>良好</span>";
                //}
                //else if (item.device_status == "4") {
                //    return "<span style='color:#3c8dbc'>一般</span>";
                //}
                //else if (item.device_status == "5") {
                //    return "<span style='color:#ff9900'>待清洗</span>";
                //}
                //else {
                //    return "健康";
                //}
 // TODO 新的，待测试@rdy
                if (item.device_status == "0") {
                    return conver_html(1, '良好');
                }
                else if (item.device_status == "1") {
                    return conver_html(2, '一般');
                }
                else if (item.device_status == "2") {
                    return conver_html(3, '待清洗');
                }
                else if (item.device_status == "3") {
                    return conver_html(2, '工作中');
                }
                else if (item.device_status == "5") {
                    return conver_html(2, '自检中');
                }
                else if (item.device_status == "6") {
                    return conver_html(4, '进水超时');
                }
                else if (item.device_status == "7") {
                    return conver_html(4, '排水超时');
                }
                else if (item.device_status == "8") {
                    return conver_html(4, '脱水撞桶');
                }
                else if (item.device_status == "9") {
                    return conver_html(4, '脱水开盖');
                }
                else if (item.device_status == "10") {
                    return conver_html(4, '水位传感器异常');
                }
                else if (item.device_status == "11") {
                    return conver_html(4, '溢水报警');
                }
                else if (item.device_status == "12") {
                    return conver_html(4, '电机故障');
                }
                else {
                    return  conver_html(0, '健康');
                }



            }
        }, {
            title: '在线状态',
            name: 'device_is_online',
            sortable: true,
            width: 60,
            align: 'center',
            renderer: function (val, item) {

                if (item.device_is_online == "0") {
                    return "离线";
                }
                else if (item.device_is_online == "1") {
                    return "<span style='color:green'>在线</span>";
//
//{#                    /*#}
//{#                     var rand = Math.floor(Math.random() * 10);#}
//{#                     if (rand < 7) {#}
//{#                     return "<span style='color:green'>在线</span>";#}
//{#                     }#}
//{#                     else{#}
//{#                     return "离线";#}
//{#                     }*/#}

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
                hidden: MmGrid.adaptor(417),
            align: 'center',
            renderer: function (val, item) {
                var dt_id = item.dt_id;
                if (dt_id == 1) {
                    return "油烟机";
                }
                else if (dt_id == 2) {
                    return "集成灶";
                }
                else if (dt_id == 3) {
                    return "医疗冰柜";
                }
                else if (dt_id == 4) {
                    return "洗衣机"
                }
                else if (dt_id == 5) {
                    return "电视机"
                }
                else if (dt_id == 6) {
                    return "冰箱"
                }
                else {
                    return "未知"
                }
            }
        },
            {
            title: is_admin('text'),
            name: 'pay_trade_no',
            // sortable: true,
            hidden: MmGrid.adaptor(520),
            width: 60,
            align: 'center',
            renderer: function (val, item) {
                if (is_admin('num') == 1) {
                    if (item.agency_name) {
                        return "<span title='"+item.factory_name+"/"+item.agency_name+"'>"+item.factory_name+"/"+item.agency_name+"</span>"
                    }
                    else if (item.factory_name) {
                        return "<span title='"+item.factory_name+"'>"+item.factory_name+"</span>"
                }
                }
                else {
                    if (item.agency_name) {
                        return "<span title='" + item.agency_name + "'>" + item.agency_name + "</span>"
                    }

                }

            }
        },
            {
            title: '激活时间',
            name: 'device_create_date',
            width: 60,
            sortable: true,
            hidden: MmGrid.adaptor(665),
            align: 'center',
            renderer: function (val, item) {
                return createGridHtml(item.create_date);
            }
        }, {
            title: '地址',
            name: 'pay_trade_no',
            // sortable: true,
            width: 60,
            hidden: MmGrid.adaptor(360),
            align: 'center',
            renderer: function (val, item) {
                return createGridHtml(item.address);
//{#                /*#}
//{#                 var rand = Math.floor(Math.random() * 10);#}
//{#                 if (rand < 4) {#}
//{#                 return "浙江省杭州市";#}
//{#                 }#}
//{#                 else if (rand >= 4 && rand <= 5) {#}
//{#                 return "浙江省绍兴市";#}
//{#                 }#}
//{#                 else if (rand >= 6 && rand <= 7) {#}
//{#                 return "安徽省马鞍山市";#}
//{#                 } else if (rand == 8) {#}
//{#                 return "江苏省苏州市";#}
//{#                 }#}
//{#                 else{#}
//{#                 return "河南省郑州市";#}
//{#                 }*/#}
            }
        }, {
            title: '编辑',
            name: 'pay_trade_no',
            // sortable: true,
            width: 60,
            align: 'center',
            renderer: function (val, item) {
                return '<a href="edit_device?device_id=' + item.device_id + '" class="btn btn-default btn-edit"> <i class="fa fa-pencil-square-o"></i>编辑</a>'
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
                sortName: 'SECUCODE',
                sortStatus: 'asc',
                nowrap: true,
                plugins: [$('#paginator11-1').mmPaginator()],
                params: function () {
                    //如果这里有验证，在验证失败时返回false则不执行AJAX查询。
                    var obj = {};
                    // 设备类型
                    var device_type = $("#txtdevType").val();
                    //设备编号
                    var device_alias = $("#txtId").val();
                    // 时间段
                    var dateRange = $("#reservation").val();
                    var txtFaName = $("#txtFaName").val();
                    if (!isNull(device_alias)) {
                        obj.device_alias = device_alias;
                    }
                    if (!isNull(dateRange)) {
                        obj.dateRange = dateRange;
                    }
                    if (!isNull(txtFaName)) {
                        obj.txtFaName = txtFaName;
                    }
                    if (!isNull(device_type) && device_type != -1) {
                        obj.device_type = device_type;
                    }

                    if('device_alias' in obj || 'dateRange' in obj || 'txtFaName' in obj || 'device_type' in obj){
                        return obj
                    }
                    else{
                        var new_obj = {};
                        var is_online = $("#ui-device-isOnline").val();
                        var is_fault = $("#ui-device-isDefault").val();
                        if (is_online=='-1'){
                            if(is_fault == '0'){
                                new_obj.is_fault = 0
                            }
                            else if (is_fault == '1'){
                                new_obj.is_fault = 1
                            }
                        }
                        else if(is_fault=='-1'){
                            if(is_online == '0'){
                                new_obj.is_online = 0
                            }
                            else if(is_online == '1'){
                                new_obj.is_online = 1
                            }
                        }
                        return new_obj
                    }
                }
            });

            return mmg;

        }
        function isNull(data) {
            if (data.indexOf("请")>-1){
                return true
            }
            return /^\s*$/gi.test(data)
        }
function is_admin(text) {
    if (user_type != 1) {
        //console.log('代理商');
        if (text == 'text') {
            return '代理商';
        }
        else {
            return 2;
        }

    }
    else {
        if (text == 'text') {
            return '厂商/代理商';
        }
        else {
            return 1;
        }

        //console.log('厂商/代理商');
    }

}
        $(function () {
            $("#ui-get-agency").click(function () {
                $.ajax({
                    url: url.get_agency,
                    type: "POST",
                    data: {'factory_id': factory_id, 'flag': 'get'},
                    beforeSend: function () {

                    },
                    success: function (res) {

                        //res = JSON.parse(res);
                        //console.log(res);
                        var ejs = new EJS({url: url.get_agency_ejs});
                        bootbox.dialog({
                            title: "所有代理商",
                            message: ejs.render(res),
                            buttons: {
                                cancel: {
                                    label: "确认",
                                    className: "btn btn-success"
                                }

                            }
                        });
                    },
                    error: function (res) {
                        dwerror('请求代理商信息出错')
                    }
                })
            });
            $("#Btn-submit").bind('click', function () {

                var fd = new FormData();
                fd.append("upload", 1);
                fd.append('upfile', $("#upfile").get(0).files[0]);
                if ($(".ui-file-name").text() != "") {
                    $.ajax({
                        url: "/device/new_device",
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: fd,
                        beforeSend: function () {

                        },
                        success: function (res) {
                            alert(res)

                        },
                        error: function (res) {
                            dwerror('上传失败')
                        }
                    })
                }
                else {
                    notify('请选择上传文件', 'danger');
                }

            });
            $("#Btn-reset").click(function () {
                $(".ui-file-name").text('');
            });
            $(".filePrew").change(function () {
                $(".ui-file-name").text('');

                if ($(".filePrew").val().split("\\")[2].split(".")[1] != 'xls' && $(".filePrew").val().split("\\")[2].split(".")[1] != 'csv') {
                    notify('文件格式错误', 'danger');
                    //alert("文件格式错误");
                    $(".ui-file-name").text('');
                } else {
                    $(".ui-file-name").text($(".filePrew").val().split("\\")[2]);
                }

            });

            //加载日期控件
            $('#reservation').daterangepicker();
            //渲染表格
            var mmg = renderGrid("get_new_device");

            $("#btnFilter").bind("click", function () {
                ($('#reservation').val());
                // 筛选后重新加载表格数据
                var ha = {'page': 1};
                mmg.load(ha);
            });

            // 在线离线设备过滤，根据num判断是否是否请求，根据is_online区别加载什么数据
            function device_filter(num, device_status) {
                if (num != '0') {
                    var args = {};
                    if (device_status == 1) {
                        $("#ui-device-isOnline").val('1');
                        $("#ui-device-isDefault").val('-1');
                        args = {'page': 1, 'is_online': 1}
                    }
                    else if (device_status == 0) {
                        $("#ui-device-isOnline").val('0');
                        $("#ui-device-isDefault").val('-1');
                        args = {'page': 1, 'is_online': 0}
                    }
                    // 正在工作
                    else if (device_status == 3) {
                        $("#ui-device-isOnline").val('-1');
                        $("#ui-device-isDefault").val('1');
                        args = {'page': 1, 'working_fault': 1}
                    }
                    // 故障设备
                    else if (device_status == 4) {
                        $("#ui-device-isOnline").val('-1');
                        $("#ui-device-isDefault").val('0');
                        args = {'page': 1, 'working_fault': 0}
                    }
                    else {
                        args = {'page': 1}
                    }
                    mmg.load(args)

                }
            }

            $("#online-dev").click(function () {

                var num = $("#online-dev").text();
                device_filter(num, 1)
            });
            $("#offline-dev").click(function () {
                var num = $("#offline-dev").text();
                device_filter(num, 0)
            });
            $("#working-dev").click(function () {
                var num = $("#working-dev").text();
                device_filter(num, 3)
            });
            $("#fault-dev").click(function () {
                var num = $("#fault-dev").text();
                device_filter(num, 4)
            })


        });
