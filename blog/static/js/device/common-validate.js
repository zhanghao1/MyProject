/**
 * Created by lujin on 16-3-14.
 */

var CommonValidate = (function () {
    return {
        /**
         * 判断是否为空值
         * @param data
         * @returns {boolean}
         */
        isNull: function (data) {
            if (data.indexOf("请") > -1) {
                return true
            }
            return /^\s*$/gi.test(data)
        },
        /**
         * 验证表格中的参数是否符合要求,如果不为空则加入查询参数中
         * @param args
         * @returns {{}}
         */
        validateGridParams: function (args) {
            var obj = {};
            $.each(args, function(name, value){
                var val = value.val();
                if (!CommonValidate.isNull(val)) {
                    obj[name] = val;
                }
            });
            return obj;
        }
    }
})();