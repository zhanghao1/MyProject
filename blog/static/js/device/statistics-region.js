var data = data;
//地图坐标
var mapPoints = [];
$(data).each(function(i, e){
    mapPoints.push({"lng": e.lng, "lat": e.lat, "count": e.count});
});

//饼图数据
var dataArr=data;

/*--------------------------------------百度地图 Begin--------------------------------*/
var map = new BMap.Map("containerMap"); // 创建地图实例

var point = new BMap.Point(120.123364, 30.330715);
map.centerAndZoom(point, 5); // 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(); // 允许滚轮缩放

// 百度热力图坐标数据
var points = mapPoints;

if (!isSupportCanvas()) {
	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
}
// 详细的参数,可以查看heatmap.js的文档
// https://github.com/pa7/heatmap.js/blob/master/README.md
// 参数说明如下:
/*
 * visible 热力图是否显示,默认为true opacity 热力的透明度,1-100 radius 势力图的每个点的半径大小 gradient
 * {JSON} 热力图的渐变区间 . gradient如下所示 { .2:'rgb(0, 255, 255)', .5:'rgb(0, 110,
 * 255)', .8:'rgb(100, 0, 255)' } 其中 key 表示插值的位置, 0~1. value 为颜色值.
 */
heatmapOverlay = new BMapLib.HeatmapOverlay({
	"radius" : 20
});
map.addOverlay(heatmapOverlay);
heatmapOverlay.setDataSet({
	data : points,
	max : 100
});
// 是否显示热力图
function openHeatmap() {
	heatmapOverlay.show();
}
function closeHeatmap() {
	heatmapOverlay.hide();
}
closeHeatmap();
function setGradient() {
	/*
	 * 格式如下所示: { 0:'rgb(102, 255, 0)', .5:'rgb(255, 170, 0)', 1:'rgb(255, 0, 0)' }
	 */
	var gradient = {};
	var colors = document.querySelectorAll("input[type='color']");
	colors = [].slice.call(colors, 0);
	colors.forEach(function(ele) {
		gradient[ele.getAttribute("data-key")] = ele.value;
	});
	heatmapOverlay.setOptions({
		"gradient" : gradient
	});
}
// 判断浏览区是否支持canvas
function isSupportCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}
/*--------------------------------------百度地图 End--------------------------------*/
/*--------------------------------------饼图 Begin--------------------------------*/
function loadPieCharts(dataArr) {
	// 初始化highcharts数据
	// 所有城市终端总数
	var totlalCount = 0;
	// 图表数据
	var resDataArr = [];
	// 获取所有省份
	var provinceArr = [];
	// 显示的省份的数据
	var browserData = [];
	// 显示的市区的数据
	var versionsData = [];
	// 计算城市终端总数
	for (var i = 0; i < dataArr.length; i++) {
		totlalCount += parseInt(dataArr[i].count);
	}
	// 判断是否已存在此省的数据
	function isInProvince(resDataArr, param) {
		for (var i = 0; i < resDataArr.length; i++) {
			if (resDataArr[i].drilldown.name == param) {
				return resDataArr[i];
			}
		}
		return false;
	}
	var colors = Highcharts.getOptions().colors;
	// 计算数据
	for (var i = 0; i < dataArr.length; i++) {
		var cityDeviceCount = parseFloat(dataArr[i].count);
		// 城市名称
		var cityName = dataArr[i].city;
		var province = dataArr[i].province;
		// 该城市终端占终端总数的比率
		var cityRatio = (cityDeviceCount * 100.0 / totlalCount).toFixed(2);
		// 饼图颜色
		var color = colors[i % colors.length];
        var obj = isInProvince(resDataArr, province);
		// 当数组中还不存在此对象时
		if (!obj) {
			// 类目
			var categories = [];
			categories.push(cityName);
			var cityData = [];
			cityData.push(parseFloat(cityRatio));
			var drilldown = {                     // 下钻
				name : province,
				categories : categories,
				data : cityData,
				color : color
			};
			// 添加一条新记录
			resDataArr.push({
				y : parseFloat(cityRatio),
				color : color,
				drilldown : drilldown
			});
		} else {
			obj.y = (parseFloat(obj.y) + parseFloat(cityRatio));
			obj.drilldown.categories.push(cityName);
			obj.drilldown.data.push(parseFloat(cityRatio));
		}

	}

	for (var i = 0; i < resDataArr.length; i++) {
		provinceArr.push(resDataArr[i].drilldown.name);
	}
	var categories = provinceArr, name = '分布区域', data = resDataArr;

	// Build the data arrays

	for (var i = 0; i < data.length; i++) {

		// add browser data
		browserData.push({
			name : categories[i],
			y : data[i].y,
			color : data[i].color
		});

		// add version data
		for (var j = 0; j < data[i].drilldown.data.length; j++) {
			var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5;
			versionsData.push({
				name : data[i].drilldown.categories[j],
				y : data[i].drilldown.data[j],
				color : Highcharts.Color(data[i].color).brighten(brightness)
						.get()
			});
		}
	}

	// Create the chart
	$('#container').highcharts(
			{
				chart : {
					type : 'pie'
				},
				title : {
					text : '设备区域分布统计饼图'
				},
				yAxis : {
					title : {
						text : 'Total percent market share'
					}
				},
				plotOptions : {
					pie : {
						shadow : false,
						center : [ '50%', '50%' ]          // 饼图位置
					}
				},
				tooltip : {
					valueSuffix : '%'
				},
				series : [
						{
							name : '省份占比',
							data : browserData,
							size : '60%',
							dataLabels : {
								formatter : function() {
									return this.y > 5 ? this.point.name : null;
								},
								color : 'white',
								distance : -30
							}
						},
						{
							name : '市区占比',
							data : versionsData,
							size : '80%',
							innerSize : '60%',
							dataLabels : {
								formatter : function() {
									// display only if larger than 1
									return this.y > 1 ? '<b>' + this.point.name   // 对大于 1% 的数据进行标注
											+ ':</b> ' + this.y + '%' : null;
								}
							}
						} ]
			});
}
/*--------------------------------------饼图 End--------------------------------*/
/*--------------------------------------基本处理 Begin------------------------------------*/
// 点击省时，进入相应的市的数据
function linkToProvince(text) {
	$("#selProvince option[value='" + text + "']").attr("selected", true);
	$("#btnFilter").click();
}
jQuery(function($) {
	// 显示热力图
	openHeatmap();
	// 加载饼图数据
	loadPieCharts(dataArr);
	// 加载省市县数据
	addressInit('selProvince', 'selCity', 'selArea');
	// 隐藏logo
	$("svg text:last").remove();
	setTimeout(function() {
		$(".anchorBL").remove();
	}, 1500);
	// 加载日期控件
	$('#reservation').daterangepicker();

	function isNull(data) {
		return /^\s*$/gi.test(data);
	}
	// 筛选条件,整合搜索按钮
	$("body").delegate("#search-btn,#btnFilter", "click", function() {
		var province = $("#selProvince").val();
		var city = $("#selCity").val();
		var search = $("#search-key").val();
		if (!isNull(search)) {
			city = search;
			$("#search-key").val("");
		}
		var area = $("#selArea").val();
        // 设备类别
		var device_type = $("#device_type").val();
		// 时间段
		var dateRange = $("#reservation").val();
		var data = {};

		if (province != "--请选择--" && !isNull(province)) {
			data.province = province;
		}
		if (city != "--请选择--" && !isNull(city)) {
			data.city = city;
		}
		if (area != "--请选择--" && !isNull(area)) {
			data.area = area;
		}
        if(!isNull(device_type) && device_type != "--请选择--"){
            data.device_type = device_type;
        }

		if (!isNull(dateRange)) {
			data.dateRange = dateRange;
		}
		if (JSON.stringify(data) == "{}") {
			if ($(this).attr("id") == "search-btn") {
				bootbox.alert("请输入要搜索的城市");
			} else {
				bootbox.alert("请选择筛选条件");
			}
			return false;
		}
		$.ajax({
			url : location.href,
			type : "POST",
			data : data,
			beforeSend : function() {
				$(".img-loading").show();
			},
			success : function(res) {
				$(".img-loading").hide();
				try {
					var res = JSON.parse(res);
                    var data = res.data;
                    var items = res.items;
					// 坐标集合
					var mapPointsArr = [];
                    var html = "<tr><th>城市</th><th>数量</th></tr>";
					$.each(data, function(index, item) {                      // 遍历
						mapPointsArr.push({lng : item.lng, lat : item.lat, count : item.count});

						html += "<tr>";
						html += "<td>" + item.city + "</td>";
						html += "<td>" + item.count.toFixed(0) + "</td>";
						html += "</tr>";
					});
                    $("#tbData").html(html)
					// 重新加载饼图数据
					loadPieCharts(data);
					// 重新加载百度地图
					heatmapOverlay.setDataSet({
						data : mapPointsArr,
						max : 100
					});
					heatmapOverlay.show();
				} catch (e) {
				}
			}
		});
	});

});
/*--------------------------------------基本处理 End------------------------------------*/
