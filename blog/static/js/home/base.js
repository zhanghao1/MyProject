/**
 * Created by tsengdavid on 6/11/15.
 */
   // $(".qr-code-img").hide();
//var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
//    document.write(unescape("%3Cspan id='cnzz_stat_icon_1254094740'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1254094740' type='text/javascript'%3E%3C/script%3E"));

//百度统计
 var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?854b60cb774bd0cf1ab148e604cfd819";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
$(function(){
    $(".weixin").bind("mouseover",function(){

        $(".qr-code-img").show()

    });
    $(".weixin").bind("mouseout",function(){

        $(".qr-code-img").hide()
    });


});