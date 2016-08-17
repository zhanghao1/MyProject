/**
 * Created by tsengdavid on 6/1/15.
 */
//全局配置对象
var dataconf = {

    // 获取所有数据
    all_data: "/device/device/freezer_detail",
    //设备编号
    "deviceId": devid,
    //报警状态(0:取消报警，1：继续报警，2：工作正常)
    "alertStatus": buzzing_flag_init,
    //箱内灯状态
    "lightStatus": light_flag,
    last_notify: ""
};

$(function () {

    /**
     * 从url中获取参数
     * @return {string}
     */
    function GetUrlValueByParas(url, paras) {
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        var i, j;
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }



    // 设置图表数据，使没有数据的时间段用靠近他的下一个时刻的数据，
    // 最后一个时刻如果没有数据则用最靠近的前一个时刻的数据
    var set_chart_data = function (data) {
        var last = 0;
        var len = data.length;
        var temp = 0;
        for (var i = 0; i < len; i++) {
            if (data[i] != null) {
                temp = data[i];
                for (var j = last; j < i; j++) {
                    data[j] = temp;
                }
                last = i + 1;
            }
        }
        if (data[len - 1] == null) {
            for (i = last; i < len; i++) {
                data[i] = temp;
            }
        }
    };


    var global_data_hw = [];
    var global_data_gw = [];
    var global_data_hm = [];
    var cate = [];
    $(function () {
        //如果设备离线或者数据未上传时弹窗提示用户
        if ($("#modelText").val() == "设备离线") {
            setTimeout(function () {
                console.log("设备离线")

            }, 1000);
        }

        $(document).ready(function () {

            $("#currentDate").html("柜温<span style=\"font-size:16px;\">℃ " + show() + "</span>");
            $("#currentDate2").html("柜湿<span style=\"font-size:16px;\">% " + show() + "</span>");
            $("#currentDate3").html("环温<span style=\"font-size:16px;\">℃ " + show() + "</span>");
            $(".table-g").hide();

            $(".ui-border-tb").hide();
            Highcharts.setOptions({
                colors: ['#058DC7', '#ff8247', '#ff8247'],
                global: {
                    useUTC: false
                }
            });

            $('#temperature-gui').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: '',
                    x: -20
                },
                subtitle: {
                    text: '',
                    x: -20

                },
                xAxis: {
                    tickInterval: 1,
                    categories: [],
                    title:{
                        text: '最近24小时数据（共48点，1点/半小时）',
                        align: 'high'
                    }
                },
                yAxis: {
                    tickPositions: [-30, -20, -10, 0, 10, 20, 30, 40],
                    max: 40,
                    min: -30,
                    minorTickInterval: 5,
                    minorTickLength: 10,
                    startOnTick: false,
                    title: {
                        text: null
                    },

                    plotLines: [{//设置两条警戒线
                        value: 8,
                        width: 1,
                        color: '#ff8247',
                        zIndex: 5,
                        dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                        id: 'plotline-2'

                    }]

                },
                tooltip: {
                    formatter: function () {

                var s = '<p>'+this.x+'<br>'+cate[this.x]+'</p>';

                $.each(this.points, function () {
                    s += '<br/><b>' + this.series.name + ': ' +
                        this.y + '℃</b>';
                });

                return s;
            },
            shared: true
                },

                series: [{
                    name: '柜温',
                    data: []
                }, {
                    name: '警界线',
                    data: []
                }]
            });
            $("#temperature-gui svg").children(":last").remove();
            $("svg path:first").remove();


            $('#temperature-huan').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: '',
                    x: -20
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    //tickInterval: 1,
                    categories: [],
                    title:{
                        text: '最近24小时数据（共48点，1点/半小时）',
                        align: 'high'
                    }
                },
                yAxis: {
                    max: 50,
                    min: -20,
                    minorTickInterval: 5,
                    minorTickLength: 10,
                    title: {
                        text: null
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: function () {

                var s = '<p>'+this.x+'<br>'+cate[this.x]+'</p>';

                $.each(this.points, function () {
                    s += '<br/><b>' + this.series.name + ': ' +
                        this.y + '℃</b>';
                });

                return s;
            },
            shared: true
                },

                series: [{
                    name: '环温',
                    data: []
                }]
            });
            $("#temperature-huan svg path:first").remove();
            $("#temperature-huan svg").children(":last").remove();

            $('#freezer-humidity').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: '',
                    x: -20
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    //tickInterval: 1,
                    categories: [],
                    title:{
                        text: '最近24小时数据（共48点，1点/半小时）',
                        align: 'high'
                    }
                },
                yAxis: {
                    tickPositions: [0, 20, 40, 60, 80, 100],
                    max: 100,
                    min: 0,
                    minorTickInterval: 10,
                    minorTickLength: 10,
                    title: {
                        text: null
                    },
                    plotLines: [{//设置两条警戒线
                        value: 35,
                        width: 1,
                        color: '#ff8247',
                        zIndex: 5,
                        dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                        id: 'plotline-4'

                    }, {//设置两条警戒线
                        value: 75,
                        width: 1,
                        color: '#ff8247',
                        zIndex: 5,
                        dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                        id: 'plotline-5'

                    }]
                },
                tooltip: {
                    formatter: function () {

                var s = '<p>'+this.x+'<br>'+cate[this.x]+'</p>';

                $.each(this.points, function () {
                    s += '<br/><b>' + this.series.name + ': ' +
                        this.y + '%</b>';
                });

                return s;
            },
            shared: true
                },

                series: [{
                    name: '湿度',
                    data: []
                }, {
                    name: '警界线',
                    data: []
                }]
            });
            $("#freezer-humidity svg path:first").remove();
            $("#freezer-humidity svg").children(":last").remove();

            //ajax异步请求mongodb数据库数据
            var el;

            $.ajax({
                type: "POST",
                url: dataconf.all_data + location.search,
                data: {devid: dataconf.deviceId},
                dataType: "json",

                success: function (data) {

                    try {
                        var gw = '';


                        for (var j = 0; j < data['hm'].length; j++) {
                            cate.push(data['gw'][j]['date']);
                            //柜温
                            var gw_value = data['gw'][j]['value'];
                            var hm_value =data['hm'][j]['value'];

                            var hw_value = data['hw'][j]['value'];

                            if (gw_value == 'null') {
                                gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td></td><td></td><td></td></tr>");
                                global_data_gw.push(null);
                                global_data_hm.push(null);
                                global_data_hw.push(null);
                            } else {
                                if ($("#modelText").val() == '冷藏模式') {
                                    if (parseFloat(gw_value) >= 2 && parseFloat(gw_value) <= 8) {
                                        if(parseFloat(hm_value) >= 35 && parseFloat(hm_value) <= 75){
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td>" + gw_value + "°C</td><td style='color: #68cc93;'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }
                                        else{
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td>" + gw_value + "°C</td><td style='color:#ff8247'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }

                                    }
                                    else {
                                        if(parseFloat(hm_value) >= 35 && parseFloat(hm_value) <= 75){
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td style='color:#ff8247'>" + gw_value + "°C</td><td style='color: #68cc93;'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }
                                        else{
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td style='color:#ff8247'>" + gw_value + "°C</td><td style='color:#ff8247'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }

                                    }

                                }
                                else if ($("#modelText").val() == '阴凉模式') {
                                    if (parseFloat(gw_value) >= 8 && parseFloat(gw_value) <= 20) {
                                        if(parseFloat(hm_value) >= 35 && parseFloat(hm_value) <= 75){
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td>" + gw_value + "°C</td><td style='color: #68cc93;'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }
                                        else{
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td>" + gw_value + "°C</td><td style='color:#ff8247'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }

                                    }
                                    else {
                                        if(parseFloat(hm_value) >= 35 && parseFloat(hm_value) <= 75){
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td style='color:#ff8247'>" + gw_value + "°C</td><td style='color: #68cc93;'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }
                                        else{
                                            gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td style='color:#ff8247'>" + gw_value + "°C</td><td style='color:#ff8247'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                        }

                                    }
                                }
                                else {
                                    gw += ("<tr><td>" + data['gw'][j]['date'] + "</td><td >" + gw_value + "°C</td><td style='color: #68cc93;'>" + hm_value + "%</td><td>" + hw_value + "°C</td></tr>");
                                }

                                global_data_gw.push(parseFloat(gw_value));
                                global_data_hm.push(parseFloat(hm_value));
                                global_data_hw.push(parseFloat(hw_value));
                            }


                        }
                        // 设置表格数据

                        $("#tbody-guiwen").append(gw);
                       // $("#tbody-huanwen").append(hw);
                       // $("#tbody-humidity").append(hm);

                        //set_chart_data(global_data_gw);
                        //set_chart_data(global_data_hm);
                        //set_chart_data(global_data_hw);

                        var chart2 = $('#temperature-gui').highcharts();
                        try {
                            if ($("#modelText").val() == '冷藏模式') {
                                chart2.yAxis[0].addPlotLine({//设置两条警戒线
                                    value: 2,
                                    width: 1,
                                    color: '#ff8247',
                                    zIndex: 5,
                                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                                    id: 'plotline-1'

                                })
                            }
                            else if ($("#modelText").val() == '阴凉模式') {
                                chart2.yAxis[0].addPlotLine({//设置两条警戒线
                                    value: 20,
                                    width: 1,
                                    color: '#ff8247',
                                    zIndex: 5,
                                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                                    id: 'plotline-3'

                                })
                            }
                            else {
                                chart2.yAxis[0].addPlotLine({//设置两条警戒线
                                    value: 2,
                                    width: 1,
                                    color: '#ff8247',
                                    zIndex: 5,
                                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                                    id: 'plotline-1'

                                })
                            }

                        }
                        catch (e) {

                        }

                        chart2.series[0].setData(global_data_gw);
                        var chart = $('#freezer-humidity').highcharts();
                        chart.series[0].setData(global_data_hm);
                        var chart3 = $('#temperature-huan').highcharts();
                        chart3.series[0].setData(global_data_hw);

                    } catch (e) {

                    }
                    $("#warnBtn").show();
                    $(".ui-switch").show();
                },
                error: function () {
                   console.log("系统错误")

                },
                complete: function () {
                   // el.loading("hide");
                }
            });


            $(".guiwen-listshow").bind("click", function () {
                if ($(".guiwen-listshow").attr('src') == list_nomal_src) {
                    $(".guiwen-listshow").attr('src', list_press_src);
                    $(".guiwen-tableshow").attr('src', table_nomal_src);
                    $(".ui-tab").show();
                    $(".table-g").hide();
                }
            });

            $(".guiwen-tableshow").bind("click", function () {
                if ($(".guiwen-tableshow").attr('src') == table_nomal_src) {
                    $(".guiwen-tableshow").attr('src', table_press_src);
                    $(".guiwen-listshow").attr('src', list_nomal_src);
                    $(".table-g").show();
                    $(".ui-tab").hide();
                }
            });

        });




        /**
         * 箱内灯控制
         */
        var control_light = function () {

        };


        // 箱内灯控制
        $("#light-check").bind("tap", function () {


        });
        //初始化灯当前状态
        if (dataconf.lightStatus == 1) {
            $("#light-check").attr('src', light_open);

        }
        else if (dataconf.lightStatus == 0) {
            $("#light-check").attr('src', light_close);

        }
        //初始化报警样式状态
        if (dataconf.alertStatus == 1) {
            $("#warnBtn").removeClass("btn-success").addClass(
                "btn-warning").text("取消报警");
        } else if (dataconf.alertStatus == 0) {
            $("#warnBtn").removeClass("btn-warning").addClass(
                "btn-success").text("继续报警");
        }
        else if (dataconf.alertStatus == 2) {
            $("#warnBtn").removeClass("btn-warning").addClass(
                "btn-success").text("工作正常");
        }
        $("#warnBtn").bind("tap", function () {

        });

        $("svg text:last").remove();
        $("svg path:first").remove();


    });


    //推送过来的消息处理
    function current_show(data) {
        var current_data = data['msg']['value'];
        //处理离线消息
        if (current_data == "-1|-1|-1|-1|-1|-1||-1") {
            Zepto.tips({
                content: '设备离线',
                stayTime: 1000,
                type: "warn"
            });
            $("#modelText").val("设备离线");
        }

        var temp = current_data.split("|");
        var gw = temp[1];//柜温
        var hw = temp[0];//环温
        var hm = temp[2];//柜湿
        var light = temp[3];//灯箱灯
        var buzzing = temp[5];//蜂鸣器
        var warnText = temp[6];//错误信息
        var dev_model = temp[7];//药柜工作模式


        $("#temperature").text(gw + "°C");
        $("#htemp").text(hw + "°C");
        $("#humidity").text(hm + "%");
        $("#warnText").val(warnText);
        if (dev_model == "0") {
            $("#modelText").val("阴凉模式");
        }
        else if (dev_model == "1") {
            $("#modelText").val("冷藏模式");
        }
        //没有报警信息时显示“工作正常”
        if (/^\s*$/gi.test(warnText)) {
            dataconf.alertStatus = 2;
            $("#warnBtn").removeClass("btn-warning").addClass(
                "btn-success").text("工作正常");
        } else {
            if (buzzing == "0") {
                dataconf.alertStatus = 0;
                $("#warnBtn").removeClass("btn-warning").addClass(
                    "btn-success").text("继续报警");
            }
            else if (buzzing == "1") {
                dataconf.alertStatus = 1;
                $("#warnBtn").removeClass("btn-success").addClass(
                    "btn-warning").text("取消报警")
            }
        }

        if (light == "1") {
            $("#light-check").attr('src', light_open);
            dataconf.lightStatus = 1;
        }
        else if (light == "0") {
            $("#light-check").attr('src', light_close);
            dataconf.lightStatus = 0;
        }

    }

    //获取年月日
    function show() {
        var my_date = new Date();
        var str = (my_date.getMonth() + 1) + "月";
        str += my_date.getDate() + "日";
        return str;
    }
});