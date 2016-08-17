/**
 * Created by tsengdavid on 11/13/15.
 */
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);

$(function () {

//highcharts
    $('#overviewCharts').highcharts({
        credits: {
            enabled: false
        },
        title: {
            text: '今日激活设备与活跃设备'
            //x: -20 //center
        },
        subtitle: {
            text: ''
            //x: -20
        },
        xAxis: {
            categories: strdate,
            tickInterval: 1,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: '量数'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '个'
        },
        /*
         legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'middle',
         borderWidth: 0
         },
         */
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        series: [{
            name: '激活设备数',
            data: strcreate
        }, {
            name: '活跃设备数',
            data: stractivate
        }]
    });

    $('#overviewCharts2').highcharts({
        credits: {
            enabled: false
        },
        title: {
            text: '今日使用次数'
            //x: -20 //center
        },
        subtitle: {
            text: ''
            //x: -20
        },
        xAxis: {
            categories: strdate,
            tickInterval: 1,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: '数次'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '个'
        },
        /*
         legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'middle',
         borderWidth: 0
         },
         */
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        series: [{
            name: '开关次数',
            data: strswitchNum
        }, {
            name: '风速调整次数',
            data: strspeedchangeNum
        }, {
            name: '照明次数',
            data: strlightchangeNum
        }, {
            name: '应用使用次数',
            data: strwarnNum
        }, {
            name: '异常次数',
            data: strappuseNum
        }]
    });
    $(function () {
        var cols = [{
            title: '设备编号', width: 100, name: 'id', align: 'center', sortable: true
        }, {
            title: '操作时间', width: 180, name: 'created', align: 'center', sortable: true
        }, {
            title: '操作类别', width: 170, name: 'category', align: 'center'
        }, {
            title: '动作', width: 120, name: 'type', align: 'center'
        }, {
            title: 'ip地址', width: 200, name: 'ip', align: 'center'
        }]

        var mmg = $('#myGrid').mmGrid({
            height: "auto"
            ,
            cols: cols
            ,
            url: 'statistics_status_hour_service'
            ,
            params: {
                'year': $.getUrlParam('year'),
                'month': $.getUrlParam('month'),
                'day': $.getUrlParam('day'),
                'did': $.getUrlParam('did')
            }
            //, method: 'get'
            //, remoteSort:true
            //, items: items
            ,
            loadingText: '正在加载中...'
            ,
            sortName: 'created'
            ,
            sortStatus: 'desc'
            //, multiSelect: true
            //, checkCol: true
            ,
            fullWidthRows: true
            ,
            showBackboard: false
            ,
            nowrap: true
            ,
            autoLoad: true
            ,
            plugins: [
                $('#pg').mmPaginator({})
            ]
        });
    });
    //求某天的日期
    function disDate(oDate, iDate) {
        var ms = oDate.getTime();
        ms += iDate * 24 * 60 * 60 * 1000;
        return new Date(ms);
    }

    function getFullUrl(dt) {
        var jumpUrl = "statistics_status_hour?year=" + dt.getFullYear();
        jumpUrl += "&month=" + (dt.getMonth() + 1);
        jumpUrl += "&day=" + dt.getDate();
        return jumpUrl;
    }

    //前一天，后一天处理
    function executeDayJump() {
        var year = $.getUrlParam("year");
        var month = $.getUrlParam("month");
        var day = $.getUrlParam("day");
        var date;
        if (year != null && month != null && day != null) {
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
            date = new Date();
        }
        var nextDate = disDate(date, 1);
        var previousDate = disDate(date, -1);
        $("#nextDay").attr("href", getFullUrl(nextDate));
        $("#previousDay").attr("href", getFullUrl(previousDate));

    }

    executeDayJump();
    //单个日期
    $('#timepoint').daterangepicker({singleDatePicker: true});
    $('#btnsubmit').bind('click', function () {
        var deviceId = $("#txtDeviceId").val();
        if (!/^\s*$/gi.test(deviceId)) {
            location.href = '/device/statistics_status_device' + '?dnum=' + deviceId;
            return;
        }
        value = $('#timepoint').val()
        if (/^\s*$/gi.test(value)) {
            bootbox.alert("请输入查询条件");
            return false;
        }
        fromlist = value.split('-')
        fromyear = fromlist[0]
        frommonth = fromlist[1]
        fromday = fromlist[2]
        location.href = '/device/statistics_status_hour' + '?year=' + fromyear + '&month=' + frommonth + '&day=' + fromday;
    });
});