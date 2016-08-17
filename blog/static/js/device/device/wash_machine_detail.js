/**
 * Created by tsengdavid on 11/13/15.
 */
$(function () {

    var device_msg = $('.device-msg');
    var device_way = $('.device-way');
    var msg = "";
    var way = "";

    var save_lng;
    var save_lat;
    var province;
    var city;
    var district;

    function set_mode() {
        $('#' + action + ' img').attr('src', '/static/img/wash/' + action + '1.png');
        $('#' + action).addClass('select_mode');
    }

    set_mode();
    /*----------------------------------------------Comet 整合 Begin-------------------------------------*/
    try {
        Orbited.settings.hostname = location.host;
        // comet封装
        function comet() {
            var stomp = new STOMPClient();
            stomp.onconnectedframe = function () {
                var id = device_id;
                if (!/^\s*$/gi.test(id)) {
                    stomp.subscribe("/" + id);
                }
            };
            stomp.onmessageframe = function (frame) {
                var data = $.parseJSON(frame.body);
                try {
                    //进行数据处理
                    deal_message(data.msg);
                } catch (e) {
                    console.log(e);
                }
            };
            stomp.connect("localhost", 61613);
        }

        comet();
    } catch (e) {
    }
    /*----------------------------------------------Comet 整合 End--------------------------------------*/

    function set_status() {
        device_msg.text(msg);
        device_way.text(way);
    }

    function deal_message(data) {
        var type = data.type;
        if (type == 50001) {
            var status = data.status;
            var count = data.count;
            var value = '';
            wash_status = status['wash_status'];
            var wash_mode = '空闲中';
            if (wash_status == 0) {
                action = 'free';
                wash_mode = '空闲中';
                msg = "";
                way = "";
            } else if (wash_status == 1) {
                action = 'order';
                wash_mode = '预约中';
                msg = "";
                way = "";
            } else if (wash_status == 2) {
                action = 'disinfection';
                wash_mode = '桶消毒';
                msg = "";
                way = "";
            } else if (wash_status == 3) {
                var last_cmd = status['mode'];
                wash_mode = map_status(last_cmd[1]);
                value = data.value;
                msg = "";
                way = "";
            } else if (wash_status == 6) {
                msg = "进水超时";
                way = "检查进水阀或者水龙头";
            } else if (wash_status == 7) {
                msg = "进水超时";
                way = "检查进水阀或者水龙头";
            } else if (wash_status == 8) {
                msg = "进水超时";
                way = "检查进水阀或者水龙头";
            } else if (wash_status == 9) {
                msg = "进水超时";
                way = "检查进水阀或者水龙头";
            } else if (wash_status == 10) {
                msg = "进水超时";
                way = "检查进水阀或者水龙头";
            }
            set_status();
            $('.right-device-count').text(count);
            $('.right-device-rest').text(value);
            $('.right-device-mode').text(wash_mode);
            set_mode();
        }
    }

    function map_status(mode) {
        if (mode == 1) {
            action = 'strong';
            return '加强洗';
        } else if (mode == 2) {
            action = 'standard';
            return '标准洗';
        } else if (mode == 3) {
            action = 'quick';
            return '快速洗';
        } else if (mode == 4) {
            action = 'molt';
            return '单脱水';
        } else if (mode == 5) {
            action = 'disinfection';
            return '桶消毒';
        } else if (mode == 6) {
            action = 'self_check';
            return '洗衣机自检';
        } else {
            action = 'free';
            return '空闲中';
        }
    }

    // 百度地图API功能
    var marker;
    var address = $('.device-address').val();
    var is_show_info = false;
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    map.enableScrollWheelZoom(true);
    var geoc = new BMap.Geocoder();

    var opts = {
        width: 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title: device_alias // 信息窗口标题
    };

    /**
     * 以城市名称设置地图中心点
     */
    function myFun(result) {
        var cityName = result.name;
        map.setCenter(cityName);
    }

    /**
     * 编写自定义函数,创建标注
     */
    function addMarker(point, address) {
        marker = new BMap.Marker(point);
        var infoWindow = new BMap.InfoWindow("地址：" + address, opts);  // 创建信息窗口对象
        marker.addEventListener("click", function () {
            is_show_info = true;
            map.openInfoWindow(infoWindow, point); //开启信息窗口
        });
        if (!is_show_info) {
            deletePoint();
            map.addOverlay(marker);
        } else {
            is_show_info = false;
        }
    }

    /**
     * 删除标注
     */
    function deletePoint() {
        map.clearOverlays();
    }

    //单击获取点击的经纬度
    map.addEventListener("click", function (e) {
        // 根据获取的经纬度创建一个坐标点
        save_lat = e.point.lat;
        save_lng = e.point.lng;
        var point = new BMap.Point(save_lng, save_lat);
        var pt = e.point;
        geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents;
            province = addComp.province;
            city = addComp.city;
            district = addComp.district;
            address = province + city + district + addComp.street + addComp.streetNumber;
            // 根据坐标点在地图上创建对应的标注
            addMarker(point, address);
            $('#wash_address').val(address);
            setEnableButton(true);
        });
    });

    // 显示地图
    $('.get-location').click(function () {
        address = $('.device-address').val();
        if (address == '') {
            // 根据ip地址获取位置信息
            var myCity = new BMap.LocalCity();
            myCity.get(myFun);
        } else {
            // 将地址解析结果显示在地图上,并调整地图视野
            geoc.getPoint(address, function (point) {
                if (point) {
                    map.centerAndZoom(point, 18);
                    addMarker(point, address);
                    // 标注点在屏幕左上角，设置以后使标注点位于屏幕地图视角中间
                    map.panBy(305, 165);
                } else {
                    alert("您选择地址没有解析到结果!");
                }
            }, "北京市");
        }
        $('.baidu-map').show();
    });

    function set_info() {
        $("input[name='lat']").val(save_lat);
        $("input[name='lng']").val(save_lng);
        $("input[name='province']").val(province);
        $("input[name='city']").val(city);
        $("input[name='district']").val(district);
        $('.device-address').val(address);
        $(".right-device-address").text(address);
    }

    // 在地图中选择地址保存
    $('#btn-save-address').click(function () {
        set_info();
        $('.btn-save').removeAttr('disabled');
        $('#baidu-map').modal('hide');
    });

    // 提交设备信息
    $('#wash-form').submit(function () {
        var args = $(this).serialize() + '&device_id=' + device_id;
        $.get('update_wash_info', args, function (data) {
            if (data == 'ok') {
                dwnotify('信息保存成功!');
                window.location.reload();
            } else {
                dwerror('信息保存失败!');
            }
        });
        $('.btn-save').prop('disabled', true);
        return false;
    });

    // 设置保存按钮为可用
    $('input').on('input', function () {
        $('.btn-save').removeAttr('disabled');
    });

    // 点击缩略图发送命令
    $('.thumbnail').click(function () {
        if (action != 'free') {
            dwerror('洗衣机正在工作中，不可操作!');
            return false;
        } else {
            // 发送命令
            var cmd = $(this).attr('id');
            $.get(send_wash_cmd, {'cmd': cmd, 'device_id': device_id}, function (data) {
                if (data.status == 'ok') {
                    window.location.reload();
                } else if (data.status == 'redirect') {
                    window.location.href = data.url;
                } else {
                    dwerror('洗涤命令发送失败!');
                }
            }, 'json');
        }
    });


    /**
     * 解析地址经纬度
     * @param address
     */
    function parse_address(address) {
        var url = 'http://api.map.baidu.com/geocoder/v2/?address=' + encodeURIComponent(address) + '&output=json&ak=r9qSTwHCqW4sfDrhnGoquvUv';
        $.ajax({
            url: url,
            dataType: 'jsonp',
            type: 'GET',
            jsonp: "callback",
            jsonpCallback: "showLocation",
            success: function (data) {
                try {
                    save_lat = data.result.location.lat;
                    save_lng = data.result.location.lng;
                    parse_coordinate(save_lat, save_lng);
                } catch (e) {
                    setEnableButton(false);
                    console.log(e);
                    alert('地址无法解析');
                }
            }
        });
    }

    /**
     * 根据经纬度解析地址
     * @param lat
     * @param lng
     */
    function parse_coordinate(lat, lng) {
        var url = 'http://api.map.baidu.com/geocoder/v2/?ak=r9qSTwHCqW4sfDrhnGoquvUv&callback=renderReverse&location=' + lat + ',' + lng + '&output=json&pois=0';
        $.ajax({
            url: url,
            dataType: 'jsonp',
            type: 'GET',
            jsonp: "callback",
            jsonpCallback: "renderReverse",
            success: function (data) {
                try {
                    var ac = data.result.addressComponent;
                    province = ac.province;
                    city = ac.city;
                    district = ac.district;
                    var point = new BMap.Point(save_lng, save_lat);
                    addMarker(point, address);
                    map.centerAndZoom(point, 18);
                    setEnableButton(true);
                } catch (e) {
                    setEnableButton(false);
                    console.log(e);
                    alert('地址无法解析');
                }
            }
        });
    }

    var timer;
    $('#wash_address').keyup(function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            address = $('#wash_address').val();
            // 解析地址，获取经纬度
            parse_address(address);

        }, 2000);
    });

    function setEnableButton(value){
        if(value){
            $("#btn-save-address").removeClass('disabled');
        }else{
            $("#btn-save-address").addClass('disabled');
        }
    }
});
