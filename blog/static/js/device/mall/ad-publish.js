/**
 * Created by nailuoGG on 16/2/22.
 */





//列宽自适应表格宽度
var cols = [{
    title   : "设备编号",
    name    : 'device_id',
    sortable: true,
    align   : 'center',
    renderer: function (val, item) {
        return '<a target="_blank" style="color: #3c8dbc" href="/device/device/detail/' + item.device_id + '">' + item.device_id + '</a>';
    }
}, {
    title   : '在线状态',
    name    : 'device_is_online',
    sortable: true,
    align   : 'center',
    renderer: function (val, item) {
        var value = item.device_is_online;
        if (value == 0) {
            return "离线";
        } else if (value == 1) {
            return "<a style='color: green;'>在线</a>";
        } else {
            return "未知";
        }
    }
}, {
    title   : '设备类型',
    name    : 'dt_id',
    sortable: true,
    align   : 'center',
    renderer: function (val, item) {
        return item.dt_id;
    }
}, {
    title   : '设备地址',
    align   : 'center',
    renderer: function (val, item) {
        var value = item.device_address;
        if (value == null || value == "") {
            return "";
        }
        return "<p title='" + value + "'>" + value + "</p>";
    }
}];
function renderGrid() {
    return $('#table').mmGrid({
        cols         : cols,
        height       : "auto",
        url          : url.publish_device,
        method       : 'post',
        remoteSort   : true,
        fullWidthRows: true,
        sortName     : 'SECUCODE',
        sortStatus   : 'asc',
        nowrap       : true,
        checkCol     : true,
        multiSelect  : true,
        plugins      : [$('#paginator').mmPaginator()],
        params       : function () {
            var obj = {};
            var device_id = $("#txt-device-id").val();
            if (!isNull(device_id)) {
                obj.device_id = device_id;
            }
            return obj
        }
    });
}

function isNull(data) {
    if (data.indexOf("请") > -1) {
        return true
    }
    return /^\s*$/gi.test(data)
}

var ejs_id_html = new EJS({url: url.ejs_device_id}).render();
var ejs_type_html = new EJS({url: url.ejs_device_type}).render();
var ejs_area_html = new EJS({url: url.ejs_device_area}).render();
var ejs_present_img = new EJS({url: url.ejs_present_img});
var ejs_present_video = new EJS({url: url.ejs_present_video});

// var ejs_content_publish_upload_html = new EJS({url: url.ejs_content_publish_upload}).render({upload_img: url.upload_img});
var mmg;
var selected_image;


function insert_ejs_id_html() {
    $('.ejs-html').html(ejs_id_html);
    //渲染表格
    mmg = renderGrid();
}

function insert_ejs_type_html() {
    $('.ejs-html').html(ejs_type_html);
}

function insert_ejs_area_html() {
    $('.ejs-html').html(ejs_area_html);
}

function insert_ejs_content_type_html(type) {
    var img_text = "上传图片";
    if (type === '1') {
        img_text = "上传图片";
    } else if (type === '2') {
        img_text = "上传视频";
    } else if (type === '3') {
        img_text = "上传";
    }
    var ejs_content_publish_upload_html = new EJS({url: url.ejs_content_publish_upload}).render({
        upload_img: url.upload_img,
        img_text  : img_text
    });
    $('.uk-add-content').html(ejs_content_publish_upload_html);
}

function register_autocomplete(area) {
    var source = getArea(area);
    // 自动完成
    var autocomplete = UIkit.autocomplete($('.uk-autocomplete'), {source: source, minLength: 1, delay: 100});
    autocomplete.options.source = source;
}

// 请求素材
function getAdContent(ad_type) {
        var ad_content_url = '/device/ad_content_list?ad_type=' + ad_type;
        var container = $('.lab-content-list .js-list');
        container.empty();
        $.getJSON(ad_content_url, function (ret) {
            console.log(ret);
            var items = ret['data'];
            var len = items.length;
            if (len == 0) {
                container.append('<span>暂无素材</span>')
            }
            if (ad_type == 1) {

                for (var i = 0; i < len; i++) {
                    var temp = items[i];
                    if (temp.ad_img) {
                        temp.ad_url = temp.ad_img;
                    }
                    container.append(ejs_present_img.render(items[i]))
                }
            }
            else if (ad_type == 2) {

                for (var i = 0; i < len; i++) {
                    var temp = items[i];
                    if (temp.ad_img) {
                        temp.ad_url = temp.ad_img;
                        container.append(ejs_present_img.render(items[i]))
                    } else {
                        container.append(ejs_present_video.render(items[i]))
                    }
                }

            }
        })
    }

$(function () {
    insert_ejs_type_html();
    var $ejs_html = $('.ejs-html');
    $ejs_html.delegate('#btnFilter', 'click', function () {
        // 筛选后重新加载表格数据
        mmg.load({page: 1});
    });

    // 点击发布内容选项后选中项变化
    $('.tab-nav-panel ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $("#send-image-url").val('');
        var type = $(this).attr('data-content-type');
        var $content = $(".uk-add-content");
        if (type == '1') {
            $('.js-imgArea').removeClass('hidden').siblings().addClass('hidden');
        } else if (type == '2') {
            $('.js-videoArea').removeClass('hidden').siblings().addClass('hidden');

        }
        $("#img-prev").remove();
        $content.css('display', 'inline-block');
        insert_ejs_content_type_html(type);
    });


    //点击打开素材管理
    $('.split-left .tab-cover').click(function () {
        var content_type = getContentType();
        var title = $('.lab-title h3');
        var sub_title = $('.lab-sub-title span');

        getAdContent(content_type);

        if (content_type == '2') {
            title.html("选择视频");
            sub_title.html("大小不超过100M")
        }
        else if (content_type == '1') {
            title.html("选择图片");
            sub_title.html("大小不超过5M")
        }
        $('.lab-source').removeClass('hidden');
        $('.bg-layer').removeClass('hidden');
    });

    //点击关闭素材管理
    $('a.closed').click(function () {
        $('.lab-source').addClass('hidden');
        $('.bg-layer').addClass('hidden');
    });


    function queue() {
        var dataStorage = [];
    };


    $('.js-list').delegate('.js-img-item', 'click', function selectQueue(limit_length) {
        var img_id = $(this).attr('id');
        var shadow_mask = $(this).children('label');

        if (select_queue.length < limit_length) {
            select_queue.push(img_id);
            shadow_mask.toggleClass('selected')
        } else {
            var unmask_id = select_queue.shift();
            $('#' + String(unmask_id)).children('label').toggleClass('selected');
        }
    });

    var selected_url;

    //点击选择图片
    $('.lab-content-list').delegate('.img-item', 'click', function () {
        var this_id = $(this).find('.item').attr('id');
        var js_selected = $('.js_selected');
        var js_btn_p = $('.js_btn_p button[data-index="0"]').parent();
        if (selected_image !== undefined) {
            selected_image.children('label').removeClass('selected');
            var selected_id = selected_image.find('.item').attr('id');
            if (selected_id === this_id) {
                selected_image.children('label').removeClass('selected');
                selected_image = undefined;
                js_selected.html(0);
                js_btn_p.addClass('btn_disabled');
                return 0
            }
        }
        selected_image = $(this);
        js_selected.html(1);
        js_btn_p.removeClass('btn_disabled');

        selected_url = $(this).find('.item').attr('src');
        $(this).children('label').toggleClass('selected');
    });

    $('.lab-footer .js_btn[data-index="1"]').click(function () {
        $('.lab-source').addClass('hidden');
        $('.bg-layer').addClass('hidden');

    });

    $('.lab-footer .js_btn[data-index="0"]').click(function () {
        var content_type = $('.tab-nav-panel ul .active').attr('data-content-type');
        if (content_type == 1) {
            $('#send-image-url').val(selected_url);
            $(".img_preview").attr('src', selected_url);
            $('.storage').remove();
            $('.tab-storage').css('top', '35%');
        }else {
            $("#video_preview").attr('src', selected_url);
            $("#video_preview").next('i').remove();
            $('.tab-storage').css('top', '35%');
        }
        $('.lab-source').addClass('hidden');
        $('.bg-layer').addClass('hidden');
    });


    //点击上传图片
    $('.split-right .tab-cover').click(function () {

    });
    $('.tab-cover input').click(function (event) {
        event.stopPropagation();
    });


    $("input[name='publish_type']").on('ifChecked', function () {
        var type = $("input[name='publish_type']:checked").val();
        if (type == '1') {
            insert_ejs_id_html();
        } else if (type == '2') {
            insert_ejs_type_html();
        } else {
            insert_ejs_area_html();
            register_autocomplete('province');
        }
    });


    $ejs_html.delegate("select[name='area']", 'change', function () {
        var area = $(this).val();
        var ph = "";
        if (area == 'province') {
            ph = "省份名称";
        } else if (area == 'city') {
            ph = "城市名称";
        } else {
            ph = "区县名称";
        }
        $("input[name='area_value']").attr('placeholder', ph);
        register_autocomplete(area);
    });

    $ejs_html.delegate(".area-value", 'blur', function () {
        // 如果不是自动完成的，在失去焦点后自动清空内容
        var area = $("select[name='area']").val();
        var area_name = $.trim($(this).val());
        if (area_name === '') {
            notify('区域名称不可为空！', 'danger');
        } else if (!checkArea(area, area_name)) {
            $(this).val('');
            notify('区域名称错误，请规范填写或者选取！', 'danger');
        }
    });

    $('.btn-save').click(function () {
        var content_type = $('.tab-nav-panel ul .active').attr('data-content-type');
        var data;
        if (content_type == '4') {
            data = $("input[name='data_content']").val();
        } else if (content_type == '1') {
            data = $("#send-image-url").val();
        } else if (content_type == '2') {
            data = $("#send-image-url").val();
        }
        // 检查发布内容
        if (data == '') {
            if (content_type == '1') {
                notify('请上传待发布的图片', 'danger');
            } else if (content_type == '2') {
                notify('请上传待发布的视频', 'danger');
            } else if (content_type == '3') {
                notify('请上传待发布商品图片', 'danger');
            } else {
                notify('请输入待发布的文字', 'danger');
            }
            return false;
        }
        var publish_type = $("input[name='publish_type']:checked").val();
        var args = {'content_type': content_type, 'data': data, 'publish_type': publish_type};
        if (publish_type == '1') {
            var rows = mmg.selectedRows();
            if (rows.length <= 0) {
                notify('请选择需要发送的设备编号', 'danger');
                return false;
            }
            var to_user = '';
            $.each(rows, function (i, e) {
                to_user = to_user + e.device_id + ',';
            });
            //args.to_user = JSON.stringify(to_user);
            to_user = to_user.substring(0, to_user.length - 1);
            args.to_user = to_user;
        } else if (publish_type == '2') {
            args['device_type'] = $("input[name='device_type']:checked").val();

        } else {
            var area = $("select[name='area']").val();
            var area_value = $.trim($(".area-value").val());
            if (area_value == '') {
                notify('区域名称不可以为空！', 'danger');
                return false;
            } else if (!checkArea(area, area_value)) {
                notify('区域名称错误，请规范填写或者选取值！', 'danger');
                return false;
            }
            args['area'] = area;
            args['area_value'] = area_value;
        }

        $(this).prop('disabled', true);
        //bootbox.alert('推送中');

        $.post(location.href, args, function (result) {
            if (result.status == 0) {
                $("#send-image-url").val("");
                notify('已经加入推送队列', 'success');
            } else {
                notify(result.error, 'danger');
            }
            $('.btn-save').prop('disabled', false);
        }, 'json');
    });
});


/**
 *上传图片
 **/

function uploadFile(file) {
    var ieVersion = getIEVersion();
    var content_type = $('.tab-nav-panel ul .active').attr('data-content-type');

}


/***
 * 设置预览图片
 * @param src
 */
function setPrevImage(src) {
    src = src+'?time='+new Date().getTime();
    $('#view-img').html('<img id="img-prev" class="img-thumbnail" src="' + src + '" style="height: 140px; width: 140px;">');
    $(".icon_upload_img").remove();
    $('.tab-upload').css('top', '35%')
}


function setLoading() {
    $('.div-loading').removeClass('loading');
    $('.div-loading').removeClass('hidden');
    $('.some-select').prop('disabled', true);
}

function cancelLoading() {
    $('.div-loading').addClass('loading');
    $('.some-select').prop('disabled', false);
}

function getContentType() {
    var content_type = $('.tab-nav-panel ul .active').attr('data-content-type');
    return content_type

}


function add_content(res, content_type) {

    var data = {"ad_url": res, "ad_type": content_type};
    var alert_info = '';
    if (content_type == 1) {
        alert_info = '图片'
    } else if (content_type == 2) {
        alert_info = '视频'
    }

    $.ajax({
        url     : "/device/ad_content_list",
        method  : "post",
        dataType: "json",
        data    : data,
        success : function (data) {
            if (data['code'] === 0) {
                notify(alert_info + '上传成功', 'success');
                cancelLoading();

            } else {
                notify(alert_info + '上传失败', 'danger');
                cancelLoading();

            }
        },
        error:function(){
            notify(alert_info + '上传失败', 'danger');
            cancelLoading();
        }
    })
}

/**
 * 上传图片预览
 * @param file
 */
function previewImage(file) {
    var ieVersion = getIEVersion();
    var content_type = getContentType();
    var fileUpload = null;
    if (content_type == '1') {
        fileUpload = document.getElementsByClassName('js-up-img')[0];
    } else if (content_type == '2') {
        fileUpload = $('.js-up-video');
    }
    if (ieVersion && ieVersion < 9) {
        var imagePath = fileUpload.value;
        var type = imagePath.substr(imagePath.lastIndexOf(".")).toUpperCase();
        setLoading();

        checkFileType(file, content_type);

        // 上传图片到服务器
        $.ajaxFileUpload({
            url          : "/device/ad_middle_uplaod?ts=" + new Date().getTime(),
            fileElementId: 'form-file',
            dataType     : 'text',
            success      : function (res, status) {
                res = $.parseJSON(res);
                res = res['data'];
                console.log(res);
                if (status === "success" && /.*\.[(jpg)|(png)|(jpeg)|(bmp)|(gif)|(mp4)]+$/gi.test(res)) {
                    $("#send-image-url").val(res);
                    // todo 设置预览图片
                    setPrevImage(res);
                    add_content(res, content_type);

                } else {
                    bootbox.alert('图片上传失败');
                }
            },
            error        : function (data, status, e) {
                //服务器响应失败处理函数
                cancelLoading();
                bootbox.alert('图片上传失败');
            }
        });

    } else {
        if (file.files && file.files[0]) {

            checkFileType(file, content_type);

            var reader = new FileReader();
            setLoading();
            reader.onload = function (evt) {
                // 上传图片到服务器
                $.ajaxFileUpload({
                    url          : "/device/ad_middle_uplaod?ts=" + new Date().getTime(),
                    fileElementId: 'form-file',
                    dataType     : 'text',
                    success      : function (res, status) {
                        res = $.parseJSON(res);
                        res = res['data'];
                        console.log(res);
                        if (status === "success" && /.*\.[(jpg)|(png)|(jpeg)|(bmp)|(gif)|(mp4)]+$/gi.test(res)) {
                            $("#send-image-url").val(res);
                            setPrevImage(res);
                            add_content(res, content_type);
                        } else {
                            bootbox.alert('图片上传失败');
                        }
                    },
                    error        : function (data, status, e) {
                        //服务器响应失败处理函数
                        cancelLoading();
                        bootbox.alert('图片上传失败');
                    }
                });
            };
            reader.readAsDataURL(file.files[0]);
        }
    }
}


function uploadVideo(file) {
    if (file.files && file.files[0]) {
        var formData = new FormData();
        var upload_file = $('.js-up-video')[0].files[0];
        var upload_url = '/device/ad_middle_uplaod';
        var content_type = getContentType();
        setLoading();

        formData.append('send_video', upload_file);
        $.ajax({
            url        : upload_url,
            type       : 'POST',
            cache      : false,
            data       : formData,
            processData: false,
            contentType: false
        }).done(function (res) {
            res = $.parseJSON(res);
            if (res['code'] == 0) {
                $('#send-image-url').val(res['data']);
                add_content(res['data'], content_type);
                //bootbox.alert('视频已上传');
            } else {
                //bootbox.alert('视频上传失败');
            }
        }).fail(function (res) {
            bootbox.alert('视频上传失败');
        });
    }

}


//检查文件是否符合要求
function checkFileType(file, type) {
    // type 为1 时,要求文件类型为图片,type为2时,要求文件类型为视频

    var file_type = file.files[0]['type'];
    var extensionsImagePattern = /(jpg)|(png)|(bmp)|(gif)|(jpeg)/gi;
    var size_limit = 2;
    var suffix = file_type.split('/')[1];
    var file_size = file.files[0]['size'];
    var size = file_size / (1024 * 1000);
    var content_type = ['只能上传(jpg)|(png)|(bmp)|(gif)|(jpeg)格式的图片', '只能上传mp4格式的视频'];
    var content_limit = ['图片大小不可以超过2M', '视频大小不可以超过100M'];
    var alert_type = content_type[0];
    var alert_limit = content_limit[0];
    if (type === '2') {
        extensionsImagePattern = /(mp4)/gi;
        size_limit = 100;
        alert_limit = content_limit[1];
        alert_type = content_type[1];
    }
    if (!extensionsImagePattern.test(suffix)) {
        bootbox.alert(alert_type);
        file.replaceWith(file.clone());
        return false;
    }
    if (size > size_limit) {
        bootbox.alert(alert_limit);
        file.replaceWith(file.clone());
        return false;
    }
}

// 获取IE版本
function getIEVersion() {
    var ua = navigator.userAgent;
    var ver = 0;
    if (ua) {
        if (ua.match(/MSIE\s+([\d]+)\./i)) {
            ver = RegExp.$1;
        } else if (ua.match(/Trident.*rv\s*:\s*([\d]+)\./i)) {
            ver = RegExp.$1;
        }
    }
    return parseInt(ver);
}


