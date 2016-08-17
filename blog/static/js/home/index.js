/**
 * Created by tsengdavid on 6/11/15.
 */
function play(myvid) {

		player = new YKU.Player('youkuplayer', {
			client_id : '7cab6ce686addffa',
			vid : myvid,
			width : 500,
			height : 420,
			autoplay : true,
			autoplay : false,
			show_related : true,
			show_related : false,
			events : {

			}
		});
		$(".player").show();
		$(".mask").fadeIn(1000);
	}
	$(function() {

		function msg(val){
			$("#lbMessage").text(val).show().fadeOut(4000);
		}
		//收集邮箱信息
		$(".open").click(function(){
		    $('#myModal').modal({show:true});
		});
		$("#btnConfirm").click(function(){
            var product = $("#txtProduct").val();
			var email=$("#txtEmail").val();
			var phone=$("#txtPhone").val();
            var demand = $("#txtDemand").val();
			if(!/^[0-9a-zA-Z]+\@[A-Za-z0-9]+\.[A-Za-z0-9]+$/gi.test(email)){
				msg("请输入正确的邮箱！");
				return false;
			}
			if(!/^[0-9\-]{4,13}$/gi.test(phone)){
				msg("请输入正确的电话号码！");
				return false;
			}
            if(product=='' || product=='您的产品'){
                msg("请填写您的产品名称或类型！");
                return false;
            }
            if(demand==''){
                msg("请填写您的详细需求！");
                return false;
            }
			$.ajax({
				url:"/",
				type:"POST",
				data:{"action":"enroll","email":email,"phone":phone, 'product': product, 'demand': demand},
				beforeSend:function(){
					$("#loading").show();
				},
				success:function(res){
					if(res=="ok"){
						alert("我们已收到你的登记信息，将尽快与你取得联系！");
						$('#myModal').modal('hide');
					}
					else{
						msg("登记失败！");
					}
					$("#loading").hide();
				},
				error:function(res){
					$("#loading").hide();
				}
			})
		});

		$("#wechat").hover(
				function(e) {
					var obj = document.getElementById("wechat");
					var left = obj.getBoundingClientRect().left;
					var top = obj.getBoundingClientRect().top;
					$("#qrcode").css("left", (left - 107) + "px").css("top",
							(top - 235) + "px").show();
					//console.log(left+":"+top);
				}, function() {
					$("#qrcode").hide();
				});
		$("#close").bind("click", function() {
			$(".player").hide();
			$(".mask").fadeOut(1000);
		});

        //判断浏览器是否支持placeholder属性
      supportPlaceholder='placeholder'in document.createElement('input');

      placeholder=function(input){

          var text = input.attr('placeholder'),
          defaultValue = input.defaultValue;

         if(!defaultValue){

             input.val(text).addClass("phcolor");
         }

         input.focus(function(){

             if(input.val() == text){

                 $(this).val("");
             }
         });


         input.blur(function(){

             if(input.val() == ""){

                 $(this).val(text).addClass("phcolor");
             }
         });

         //输入的字符不为灰色
         input.keydown(function(){

             $(this).removeClass("phcolor");
         });
     };

     //当浏览器不支持placeholder属性时，调用placeholder函数
     if(!supportPlaceholder){
         $('textarea').each(function(){
             placeholder($(this));
         });
         $('input').each(function(){

             text = $(this).attr("placeholder");

             if($(this).attr("type") == "text"){

                 placeholder($(this));
             }
         });
     }
    //获取滚动条高度
    function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }
        //绑定页面滚动函数
    $(document).scroll(function () {
        var top = getScrollTop();
        var doc = $(document).height();
        var win = $(window).height();
        if (top > win / 2) {
            $('.ui-scroll-top').show();
        } else {
            $('.ui-scroll-top').css('display', 'none');
        }

    });
	});