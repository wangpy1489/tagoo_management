'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.factory("ChartFactory",['$http', "QueryUrl", 'queryPort',function($http, QueryUrl, queryPort) {
		var factory = {};
		factory.queryNumber = function (sceneId, startDate, endDate, type) {
			if(type == 0) {
				return $http({
					method: "GET",
					url: QueryUrl + queryPort + "/api/v1/" + sceneId +
					"/scanUser/" + startDate + "/" + endDate,
					headers: {'Content-Type': 'application/json;charset=UTF-8'},
					crossDomain: true
				});
			}
		};
		return factory;
	}])
	.controller('ChartCtrl', ['ChartFactory','$scope', '$timeout', '$rootScope', '$cookies', '$state', '$stateParams', function (ChartFactory, $scope, $timeout, $rootScope, $cookies, $state, $stateParams) {
		//alert(document.getElementById("hehe").innerHTML);
		if($cookies.get('currentUser') == undefined || $cookies.get('authority') == undefined){
			$state.go('login');
		};
		console.log($stateParams.dataType);
		//alert($stateParams.category);

		function dateSubstract(startDate, endDate){
			return (endDate.getTime() - startDate.getTime()) / (1000 * 24 * 3600);
		}

		function getToday() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10)
				month = '0' + month;
			if (day < 10)
				day = '0' + day;
			return year + '-' + month + '-' + day;
		}

		function compareTime(startDate, endDate) {
			var start = new Date(startDate);
			var end = new Date(endDate);
			var startTime = start.getTime();
			var endTime = end.getTime();

			if (startTime - endTime > 0)
				return false;
			return true;
		}

		function formatDate(date) {
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10)
				month = '0' + month;
			if (day < 10)
				day = '0' + day;
			var formatDate = year + '-' + month + '-' + day;
			return formatDate;
		}

		//将没有人数的日期补为0
		function getChartData(start, end, data){
			var startDate = new Date(start);
			var endDate = new Date(end);
			var result = {};
			result.labels = [];
			result.count = [];
			for(; formatDate(startDate) != formatDate(endDate); startDate.setDate(startDate.getDate() + 1)){
				result.labels.push(formatDate(startDate));
				result.count.push(0);
			}
			result.labels.push(formatDate(endDate));
			result.count.push(0);
			startDate = new Date(start);
			for(var i = 0; i < data.length; i++){
				result.count[dateSubstract(startDate, new Date(data[i].date))] = data[i].count;
			}
			return result;
		}

		$('#startDate').datetimepicker({
			viewMode: 'days',
			format: 'YYYY-MM-DD',
			maxDate: getToday(),
			locale: 'zh-cn'
		});

		$('#endDate').datetimepicker({
			viewMode: 'days',
			format: 'YYYY-MM-DD',
			maxDate: getToday(),
			locale: 'zh-cn'
		});

		var captions = ["扫码人数", "注册人数", "付费人数", "付费金额"];
		$rootScope.Caption = captions[$stateParams.dataType];


		function query(days){
			$scope.endDate = getToday();
			var temp = new Date($scope.endDate);
			temp.setDate(temp.getDate() - days);
			$scope.startDate = formatDate(temp);
			$scope.myStart = $scope.startDate;
			$scope.myEnd = $scope.endDate;
			$scope.daysSelected = days + 1;
			var currentUser = $cookies.getObject("currentUser");
			ChartFactory.queryNumber(currentUser.sceneId, $scope.startDate, $scope.endDate, $stateParams.dataType)
				.success(function(data){
					console.log(data);
					var result = getChartData($scope.startDate, $scope.endDate, data.count);
					console.log(result);
					$scope.line = {
						labels: result.labels,
						series: [captions[$stateParams.dataType]],
						data: [result.count],
						onClick: function (points, evt) {
							console.log(points, evt);
						}
					};
				})

		}

		query(6);

		$scope.query = query;

		$scope.customQuery = function(){
			$scope.startDate =  $("#start").val();
			$scope.endDate = $("#end").val();
			var currentUser = $cookies.getObject("currentUser");
			if(!compareTime($scope.startDate, $scope.endDate) || $scope.startDate == '' || $scope.endDate == ''){
				alert("请输入正确的起止日期");
				return;
			}
			else{
				ChartFactory.queryNumber(currentUser.sceneId, $scope.startDate, $scope.endDate, $stateParams.dataType)
					.success(function(data){
						console.log(data);
						var result = getChartData($scope.startDate, $scope.endDate, data.count);
						console.log(result);
						$scope.line = {
							labels: result.labels,
							series: [captions[$stateParams.dataType]],
							data: [result.count],
							onClick: function (points, evt) {
								console.log(points, evt);
							}
						};
						$scope.daysSelected = dateSubstract(new Date($scope.startDate), new Date($scope.endDate)) + 1;
					})
			}
		}

		//$scope.bar = {
		//	labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
		//	series: ['Series A', 'Series B'],
        //
		//	data: [
		//	   [65, 59, 80, 81, 56, 55, 40],
		//	   [28, 48, 40, 19, 86, 27, 90]
		//	]
        //
		//};
        //
		//$scope.donut = {
		//	labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
		//	data: [300, 500, 100]
		//};
        //
		//$scope.radar = {
		//	labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        //
		//	data:[
		//		[65, 59, 90, 81, 56, 55, 40],
		//		[28, 48, 40, 19, 96, 27, 100]
		//	]
		//};
        //
		//$scope.pie = {
		//	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
		//	data : [300, 500, 100]
		//};
        //
		//$scope.polar = {
		//	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
		//	data : [300, 500, 100, 40, 120]
		//};
        //
		//$scope.dynamic = {
		//	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
		//	data : [300, 500, 100, 40, 120],
		//	type : 'PolarArea',
        //
		//	toggle : function ()
		//	{
		//		this.type = this.type === 'PolarArea' ?
		//		'Pie' : 'PolarArea';
		//	}
		//};
	}]);