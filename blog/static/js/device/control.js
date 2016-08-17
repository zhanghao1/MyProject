// 油烟机控制
function deviceControl(type, value) {
    var id = $("#hidID").val();
    var isSuccess = false;
    $.ajax({
        url: "control",
        type: "POST",
        async: false,
        data: {
            "action": "control",
            "id": id,
            "type": type,
            "value": value
        },
        success: function (res) {
            if (res == 1) {
                isSuccess = true;
                // dwnotify("操作成功！");
            } else {
                dwerror("操作失败！");
            }
            // return true;
        }
    });
    return isSuccess;
}
jQuery(function ($) {
    // 发送插播消息
    $("#btnBroadcast").delegate(this, "click", function () {
        if (onlineStatus != "1") {
            bootbox.alert("终端离线，请先打开终端后再进行操作！");
            return false;
        }
        var val = $("#txtBroadcast").val();
        var id = $("#hidID").val();
        if (/^\s*$/gi.test(val)) {
            bootbox.alert("请输入要发送的内容");
            return false;
        }
        $.ajax({
            url: "control",
            type: "POST",
            data: {
                "action": "broadcast",
                "id": id,
                "cnt": val
            },
            success: function (res) {
                if (res == 1) {
                    dwnotify("操作成功");
                } else {
                    dwerror("操作失败");
                }
            }
        });
    });

    // 电源状态
    var powerStatus = false;
    // 照明状态
    var lightStatus = false;
    // 风扇状态：0-关；1-大风开；2-小风开
    var windStatus = 0;
    // 消毒状态
    var disinfectStatus = false;
    // 烘干状态
    var stovingStatus = false;
    // 延迟状态
    var delayStatus = false;
    // 遥控器逻辑
    function contrlLogic(status) {
        if (onlineStatus != "1") {
            bootbox.alert("终端离线，请先打开终端后再进行操作！");
            return false;
        }
        switch (status) {
            case 0:
            {
                // 关闭电源
                if (!deviceControl('power', 0)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOff);
                $(".control-light").attr("src", imgLightOff);
                $(".control-delay").attr('src', imgDelayOff);
                //风扇处于关闭状态
                $(".control-wind").attr("src", imgWind1Off);
                $(".control-disinfect").attr("src", disinfectOff);
                $(".control-stoving").attr("src", stovingOff);
                powerStatus = false;
                lightStatus = false;
                delayStatus = false;
                windStatus = 0;
                disinfectStatus = false;
                stovingStatus = false;
            }
                break;
            case 1:
            {
                // 打开电源
                if (!deviceControl('power', 1)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-light").attr("src", imgLightOff);
                $(".control-delay").attr('src', imgDelayOff);
                $(".control-wind").attr("src", imgWind1On);
                powerStatus = true;
                lightStatus = false;
                delayStatus = false;
                // 默认开启电源就开启大风
                windStatus = 1;

            }
                break;
            case 3:
            {
                // 开启照明
                if (!deviceControl('lighting', 1)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-light").attr("src", imgLightOn);
                powerStatus = true;
                lightStatus = true;
            }
                break;
            case 4:
            {
                // 关闭照明
                if (!deviceControl('lighting', 0)) {
                    return false;
                }
                $(".control-light").attr("src", imgLightOff);
                lightStatus = false;
            }
                break;
            case 5:
            {
                // 开启小风
                if (!deviceControl('speed', 2)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-wind").attr("src", imgWind2On);
                powerStatus = true;
                windStatus = 2;
            }
                break;
            case 6:
            {
                // 关闭小风
                if (!deviceControl('speed', 0)) {
                    return false;
                }
                $(".control-wind").attr("src", imgWind1Off);
                windStatus = 0;
            }
                break;
            case 7:
            {
                // 开启大风
                if (!deviceControl('speed', 1)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-wind").attr("src", imgWind1On);
                powerStatus = true;
                windStatus = 1;
            }
                break;
            case 8:
            {
                // 关闭大风
                if (!deviceControl('speed', 0)) {
                    return false;
                }
                $(".control-wind").attr("src", imgWind2On);
                windStatus = 2;
            }
                break;
            case 9:
            {
                // 打开消毒
                if (!deviceControl('disinfect', 10)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-disinfect").attr("src", disinfectOn);
                $(".control-stoving").attr("src", stovingOff);
                powerStatus = true;
                disinfectStatus = true;
                stovingStatus = false;
            }
                break;
            case 10:
            {
                // 关闭消毒
                if (!deviceControl('disinfect', 0)) {
                    return false;
                }
                $(".control-disinfect").attr("src", disinfectOff);
                disinfectStatus = false;
            }
                break;
            case 11:
            {
                // 打开烘干
                if (!deviceControl('stoving', 10)) {
                    return false;
                }
                $(".control-power").attr("src", imgPowerOn);
                $(".control-disinfect").attr("src", disinfectOff);
                $(".control-stoving").attr("src", stovingOn);
                powerStatus = true;
                disinfectStatus = false;
                stovingStatus = true;
            }
                break;
            case 12:
            {
                // 关闭烘干
                if (!deviceControl('stoving', 0)) {
                    return false;
                }
                $(".control-stoving").attr("src", stovingOff);
                stovingStatus = false;
            }
                break;

            case 13:
            {
                //开启延迟
                if (!deviceControl('delay', 1)){
                    return false;
                }
                $(".control-delay").attr('src', imgDelayOn);
                $(".control-power").attr("src", imgPowerOn);
                powerStatus = true;
                delayStatus = true;
            }
                break;

            case 14:
            {
                //关闭延迟
                if (!deviceControl('delay', 0)){
                    return false;
                }
                $(".control-delay").attr('src', imgDelayOff);
                delayStatus = false;
            }
                break;
        }
    }
    /*
//控制设备状态，目前取消
    $(".control-power").bind("click", function () {
        if (powerStatus) {
            contrlLogic(0);
        } else {
            contrlLogic(1);
        }

    });
    $(".control-light").bind("click", function () {
        if (lightStatus) {
            contrlLogic(4);
        } else {
            contrlLogic(3);
        }
    });

    $(".control-wind").bind("click", function () {
        if(windStatus == 0){
            // 若原来是关闭，则开启大风
            contrlLogic(7);
        }else if(windStatus == 1){
            // 若原来是大风，则开启小风
            contrlLogic(5);
        }else if(windStatus == 2){
            // 若原来是小风，则关闭
            contrlLogic(6);
        }
    });

    // 延迟
    $(".control-delay").bind('click', function(){
        if(delayStatus){
            contrlLogic(14);
        }else{
            contrlLogic(13);
        }
    });

    $(".control-disinfect").bind("click", function () {
        if (disinfectStatus) {
            contrlLogic(10);
        } else {
            contrlLogic(9);
        }
    });

    $(".control-stoving").bind("click", function () {
        if (stovingStatus) {
            contrlLogic(12);
        } else {
            contrlLogic(11);
        }
    });
*/
    // 同步终端状态，不发送命令
    function syncStatus(status) {
        var statusArr = status.split("|");
        if (statusArr[0] == "0") {
            $(".control-power").attr("src", imgPowerOff);
            powerStatus = false;
        } else if (statusArr[0] == "1") {
            $(".control-power").attr("src", imgPowerOn);
            powerStatus = true;
        }
        // 照明
        if (statusArr[1] == "0") {
            $(".control-light").attr("src", imgLightOff);
            lightStatus = false;
        } else if (statusArr[1] == "1") {
            $(".control-light").attr("src", imgLightOn);
            lightStatus = true;
        }
        // 大风
        if (statusArr[2] == "0") {
            $(".control-wind").attr("src", imgWind1Off);
            //fierceWindStatus = false;
            windStatus = 0;
        } else if (statusArr[2] == "1") {
            $(".control-wind").attr("src", imgWind1On);
            //fierceWindStatus = true;
            windStatus = 1;
        }
        // 小风
        if (statusArr[3] == "0") {
            $(".control-wind").attr("src", imgWind1Off);
            //breezeStatus = false;
            windStatus = 0;
        } else if (statusArr[3] == "1") {
            $(".control-wind").attr("src", imgWind2On);
            //breezeStatus = true;
            windStatus = 2;
        }
        // 说明带有集成灶
        if (statusArr.length == 6) {
            $(".control-disinfect").show();
            $(".control-stoving").show();
            // 消毒
            if (statusArr[4] == "0") {
                $(".control-disinfect").attr("src", disinfectOff);
                disinfectStatus = false;
            } else if (statusArr[4] == "1") {
                $(".control-disinfect").attr("src", disinfectOn);
                disinfectStatus = true;
            }
            // 烘干
            if (statusArr[5] == "0") {
                $(".control-stoving").attr("src", stovingOff);
                stovingStatus = false;
            } else if (statusArr[5] == "1") {
                $(".control-stoving").attr("src", stovingOn);
                stovingStatus = true;
            }
        } else {
            $(".control-disinfect").hide();
            $(".control-stoving").hide();
        }
    }

    /*----------------------------------------------Comet 整合 Begin-------------------------------------*/
    Orbited.settings.hostname = location.host;
    // comet封装
    function comet() {
        stomp = new STOMPClient();
        stomp.onopen = function () {
            // console.log("Open Stomp Client");
        }
        stomp.onclose = function (c) {
            // alert("Lost connection, Code:" + c);
            dwerror("状态同步关闭！");
        }
        stomp.onerror = function (error) {
            // alert("Error : " + error);
            dwerror("状态同步异常！");
        }
        stomp.onerrorframe = function (frame) {
            // alert("Error : " + frame.body);
            dwerror("error:状态同步异常！");
        }
        stomp.onconnectedframe = function () {
            // console.log("Connected. Subcribing");
            var id = $("#hidID").val();
            if (!/^\s*$/gi.test(id)) {
                stomp.subscribe("/" + id);
            }
        }
        stomp.onmessageframe = function (frame) {
            // console.log(frame);
            var data = $.parseJSON(frame.body);
            try {
                var msg = data['msg'];
                var status = msg.value;
                var type = msg.type;
                //type==1时为遥控器状态控制,其它的为音乐电台之类的
                if (type == 1) {
                    // 反馈状态与上次不一致时再做修改
                    if (callbackStatus != status) {
                        syncStatus(status);
                    }
                    callbackStatus = status;
                }
            } catch (e) {
                dwerror("格式错误！");
            }
        }
        stomp.connect("localhost", 61613);
    }
    ;
    /*----------------------------------------------Comet 整合 End--------------------------------------*/
    // 刚进入页面时获取状态
    function getFirstStatusCallback() {
        $.ajax({
            url: "/device/device_service",
            type: "POST",
            data: {
                "action": "status",
                "symbol": symbol,
                "type": 1
            },
            success: function (res) {
                if (res != "1") {
                    dwerror("状态更新失败");
                }
            }
        });
    }

    // 同步终端状态(在线时才操作)
    if (onlineStatus == "1") {
        setTimeout(function () {
            getFirstStatusCallback();
        }, 2000);
        comet();
    }
});