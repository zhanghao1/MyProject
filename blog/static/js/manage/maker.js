/**
 * Created by rdy on 8/7/15.
 */

$(function () {
            function msg(val){
			$("#lbMessage").text(val).show().fadeOut(4000);
		}


    //厂商帐号添加绑定按钮
        $(".account-btnAdd").bind('click',function(){
            window.location.href='set_maker_account'
        });

    //厂商登记按钮绑定
        $("#btnConfirm").bind('click',function(){
            var fac_name = $("#text-fac-Name").val();
            var fac_address = $("#text-fac-Address").val();
            var fac_phone = $("#text-fac-Phone").val();
            var fac_uuid = $("#text-fac-uuid").val();
            var fac_mask = $("#text-fac-mask").val();
            var role_id = $('#role-name option:selected').val();
            if(fac_name.replace(/\s/g,"").length ==0 ||fac_address.replace(/\s/g,"").length ==0 ||fac_phone.replace(/\s/g,"").length ==0){
                msg("带*号项不能为空");
				return false;
            }
            if(!/^[0-9\-]{4,13}$/gi.test(fac_phone)){
                msg("请输入正确的联系方式！");
				return false;
            }
            $.ajax({
				url:"set_maker_info",
				type:"POST",
				data:{"action":"add","fac_name":fac_name,"fac_phone":fac_phone,'fac_address':fac_address,'fac_uuid':fac_uuid,'fac_mask':fac_mask, 'role_id': role_id},
				beforeSend:function(){
					$("#loading").show();
				},
				success:function(res){
					if(res=="ok"){
                        alert("提交成功！");
						$('#myModal').modal('hide');

                        window.location.reload();
					}
					else{
						msg("登记失败！");
					}
					$("#loading").hide();
				},
				error:function(res){
					$("#loading").hide();
				}
			});


        });


        });


