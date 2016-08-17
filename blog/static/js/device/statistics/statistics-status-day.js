/**
 * Created by tsengdavid on 11/13/15.
 */
$(function () {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
//highcharts
    $('#overviewCharts').highcharts({
        credits: {
            enabled: false
        },
        title: {
            text: '设备使用情况统计表'
            //x: -20 //center
        },
        subtitle: {
            text: '近一个月使用情况'
            //x: -20
        },
        xAxis: {
            categories: strdate,
            tickInterval: 7,
            tickmarkPlacement: 'on'
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
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        series: [{
            name: '当天激活设备数',
            data: strcreate
        }, {
            name: '当天活跃设备数',
            data: stractivate
        }]
    });
//highcharts
    $('#overviewCharts2').highcharts({
        credits: {
            enabled: false
        },
        title: {
            text: '设备使用情况统计表'
            //x: -20 //center
        },
        subtitle: {
            text: '近一个月使用情况'
            //x: -20
        },
        xAxis: {
            categories: strdate,
            tickInterval: 7,
            tickmarkPlacement: 'on'
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
//mmGrid
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
    }];

    var mmg = $('#myGrid').mmGrid({
        height: "auto",
        cols: cols,
        url: 'statistics_status_day_service',
        params: {
            'year': $.getUrlParam('year'),
            'month': $.getUrlParam('month'),
            'day': $.getUrlParam('day'),
            'toyear': $.getUrlParam('toyear'),
            'tomonth': $.getUrlParam('tomonth'),
            'today': $.getUrlParam('today'),
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

    $(document).ajaxSend(function (event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        function sameOrigin(url) {
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                    // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:).*/.test(url));
        }

        function safeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });
    $("#ajaxbtn").on('click', function () {
        alert('start');
        var fid = 123456789;
        $.ajax({
            type: "POST",
            url: location.href,
            cache: false,
            async: true,
            dataType: "text",
            data: {'fid': fid},
            success: function (ret) {
                alert(ret);
            },
            error: function () {
                alert('error');
            }
        })
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