/**
 * Created by rdy on 11/16/15.
 */
$(function () {
    addressInit('selProvince', 'selCity', 'selArea', old_province, old_city, old_area);
    $(".uk-form-file").mouseover(function () {
        $(this).children('img').show()
    });
    $(".uk-form-file").mouseout(function () {
        $(this).children('img').hide()
    });

            // 密码保存
            $("#btnSave").bind("click", function () {
                var pwdNormal = $.trim($("#pwdNormal").val());
                var pwdNew = $.trim($("#pwdNew").val());
                var pwdAgain = $.trim($("#pwdAgain").val());
                var account = $.trim($("#ui-old-name").val());
                if (/^\s*$/gi.test(pwdNew)) {
                    //$('#myModal').hide()
                    //$('#myModal') .modal('hide');
                    $("#pMessage").html("新密码不能为空！");
                    return false;
                }
                if (pwdNew !== pwdAgain) {
                    $("#pMessage").html("新密码与确认密码不一致！");
                    return false;
                }
                $.ajax({
                    url: location.href,
                    type: "POST",
                    data: {
                        "action": "mod-pwd",
                        "account": account,
                        "pwdNormal": pwdNormal,
                        "pwdAgain": pwdAgain
                    },
                    success: function (res) {
                        if (res == "1") {
                            $("#pMessage").text("");
                            $(".pull-right").val("");

                            dwnotify("修改成功！");
                        } else {
                            $("#pMessage").html("操作失败");
                        }
                        $('#myModal').modal('hide');
                    }
                });
            });
            // 个人信息保存
            $("#btnSaveData").click(function () {
                var user_nick = $.trim($(".ui-user-nick").val());
                var user_url = $.trim($(".ui-user-head-url").val());
                var province = $("#selProvince").val();
                var city = $("#selCity").val();
                var area = $("#selArea").val();
                var old_name = $("#ui-old-name").val();
                var fd = new FormData();
                fd.append("upload", 1);
                fd.append('upfile', $("#form-file").get(0).files[0]);
                fd.append('action', 'save-data');
                fd.append('old_name', old_name);
                fd.append('nick', user_nick);
                if (province != "--请选择--" && !isNull(province)) {

                    fd.append('province', province);
                }
                else{
                    province = '';
                }
                if (city != "--请选择--" && !isNull(city)) {
                    fd.append('city', city);
                }
                else{
                     city = '';
                }

                if (area != "--请选择--" && !isNull(area)) {
                    fd.append('area', area);
                }
                else{
                    area = '';
                }
                var can_submit = false;

                can_submit = !(province == old_province && city == old_city && area == old_area && user_nick == old_nick);
                if ($("#form-file").get(0).files[0]) {
                    can_submit = true;
                }
                if(can_submit){
                    $.ajax({
                    url: location.href,
                    type: "POST",
                    processData: false, //ajax 模拟表单提交必选
                    contentType: false,
                    data: fd,
                    beforeSend:function(){
                        $('#myLoadImg').modal();
                    },
                    success: function (res) {
                        var r = JSON.parse(res);
                        if (r['status'] == 1) {
                            //修改用户头像为最新上传地址
                            if (r['url'] != null) {
                                $(".img-circle").attr('src', r['url']);
                            }

                            dwnotify("修改成功！");
                        } else {
                            dwerror(r['msg']);

                        }
                        $('#myLoadImg').modal('hide');
                    },
                    error:function(){
                        $('#myLoadImg').modal('hide');
                    }
                });
                }

            })
        });


        /***
         * 上传图片预览
         */
        function setImagePreview() {
            var docObj = document.getElementById("form-file");

            var imgObjPreview = document.getElementById("img-face");
            if (docObj.files && docObj.files[0]) {
                //火狐下，直接设img属性
                imgObjPreview.style.display = 'block';
                imgObjPreview.style.width = '100px';
                imgObjPreview.style.height = '100px';
                //imgObjPreview.src = docObj.files[0].getAsDataURL();

                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            }
            else {
                //IE下，使用滤镜
                docObj.select();
                var imgSrc = document.selection.createRange().text;
                var localImagId = document.getElementById("localImag");
                //必须设置初始大小
                localImagId.style.width = "100px";
                localImagId.style.height = "100px";
                //图片异常的捕捉，防止用户修改后缀来伪造图片
                try {
                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                }
                catch (e) {
                    alert("您上传的图片格式不正确，请重新选择!");
                    return false;
                }
                imgObjPreview.style.display = 'none';
                document.selection.empty();
            }
            return true;
        }


        function isNull(data) {
            if (/^\s*$/gi.test(data)) {
                return true;
            } else {
                return false;
            }
        }
