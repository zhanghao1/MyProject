/**
 * Created by tsengdavid on 11/13/15.
 */
var reduction = function (val, item) {  //对“禁用”，“启用”按钮进行功能设定
    var btnVal = "还原";
    var res = '  <a style="color: #3c8dbc" class="cloud-control" href="javascript:"  data-token="'+ item._id + '"  database_type="'+ item.database_type + '">' + btnVal + '</a>';
    return res
};

var linkApp4 = function (val, item) {
    return val
};

//列宽自适应表格宽度
var cols6 = [{
    title: "id",
    name: '_id',
    width: 80,
    align: 'center',
    renderer: linkApp4
}, {
    title: '备注',
    name: 'remark',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '保存位置',
    name: 'location',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '数据库类型',
    name: 'database_type',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '创建时间',
    name: 'creat_time',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '数据库名称',
    name: 'database_name',
    width: 60,
    align: 'center',
    renderer: linkApp4
}, {
    title: '操作',
    name: null,
    width: 60,
    align: 'center',
    renderer: reduction
}];


function renderGrid(url) {
    var mmg = $('#table6-1').mmGrid({
        cols: cols6,
        height: "auto",
        url: url,
        method: 'get',
        remoteSort: true,
        fullWidthRows: true, //true:表格第一次加载数据时列伸展，自动充满表格
        sortName: 'SECUCODE', //排序的字段名。字段名的值为列模型设置的sortName或name中的值
        sortStatus: 'asc',   //排序方向
        plugins: [$('#paginator11-1').mmPaginator()],

        params: function () {
            //如果这里有验证，在验证失败时返回false则不执行AJAX查询。
            var obj = {};
            obj.action = "get_data";
            return obj

        }
    });

    return mmg;
}


$(function () {
    //渲染表格
    var mmg = renderGrid("/manage/maintenance?action=getdata");  //请求设置url参数，向后端发送获取数据

    $(document).delegate(".cloud-control", "click", function () {

        var token = $(this).attr("data-token");
        var database_type = $(this).attr("database_type");

        if (confirm("确定要还原" + token +"吗？")) {
            var action = 'reduction_'+database_type;   //判断点击了哪个数据库的"还原按钮"

            $.ajax({
                url: location.href,
                type: "POST",
                data: {"action":action, "token": token},   //发送到view的数据，action还原哪个数据库)
                success: function (res) {
                    var obj = JSON.parse(res);
                    if (obj.code == 0) {
                        dwnotify("操作成功");
                        location.reload();
                    } else {
                        alert("操作失败")
                    }
                }
            })
        }
    });

})