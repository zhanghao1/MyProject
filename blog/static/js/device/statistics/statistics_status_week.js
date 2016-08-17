/**
 * Created by tsengdavid on 11/13/15.
 */
$(function () {
    $('#overviewCharts').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '设备使用情况统计表'
            //x: -20 //center
        },
        subtitle: {
            text: '近八周使用情况'
            //x: -20
        },
        xAxis: {
            categories: strdate
            //tickInterval: 7,
            //tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: '数量（单位：个）'
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
            name: '该周激活设备数',
            data: strcreate
        }, {
            name: '该周活跃设备数',
            data: stractivate
        }]
    });
//highcharts
    $('#overviewCharts2').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '设备使用情况统计表'
            //x: -20 //center
        },
        subtitle: {
            text: '近八周使用情况'
            //x: -20
        },
        xAxis: {
            categories: strdate
            //tickInterval: 7,
            //tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: '数量（单位：个）'
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
    $('#timerange').daterangepicker();
    $('#btnsubmit').bind('click', function () {
        var deviceId = $("#txtDeviceId").val();
        if (!/^\s*$/gi.test(deviceId)) {
            location.href = '/device/statistics_status_device' + '?dnum=' + deviceId;
            return;
        }
        value = $('#timerange').val()
        if (/^\s*$/gi.test(value)) {
            bootbox.alert("请输入查询条件");
            return false;
        }
        timelist = value.split(' ~ ');
        fromlist = timelist[0].split('-')
        tolist = timelist[1].split('-')
        fromyear = fromlist[0]
        frommonth = fromlist[1]
        fromday = fromlist[2]
        toyear = tolist[0]
        tomonth = tolist[1]
        today = tolist[2]
        location.href = 'statistics_status_day' + '?year=' + fromyear + '&month=' + frommonth + '&day=' + fromday + '&toyear=' + toyear + '&tomonth=' + tomonth + '&today=' + today;
    });
});