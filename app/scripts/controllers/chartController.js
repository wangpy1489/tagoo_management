'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
	.factory("ChartFactory",['$http', "BaseUrl", 'Port',function($http, BaseUrl, Port) {
		var factory = {};
		factory.queryStatistics = function (startDate, endDate, type) {
			if(type == 0) { //query registered users
				return $http({
					method: "GET",
					url: BaseUrl + Port + "/user/regcount?start=" + startDate + "&end=" + endDate,
					headers: {'Content-Type': 'application/json;charset=UTF-8'},
					crossDomain: true
				});
			}
			else if(type == 1){
				return $http({
					method: "GET",
					url: BaseUrl + Port + "/service/regcount?start=" + startDate + "&end=" + endDate,
					headers: {'Content-Type': 'application/json;charset=UTF-8'},
					crossDomain: true
				});
			}
		};
		return factory;
	}])
	.controller('ChartCtrl', function (ChartFactory, $scope, $timeout, $rootScope, $state, $stateParams) {
		//alert(document.getElementById("hehe").innerHTML);
		//if($cookies.get('currentUser') == undefined || $cookies.get('authority') == undefined){
		//	$state.go('login');
		//};
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
			var string2Date = function(str){
				return new Date(str.substring(0, 4) + "-" + str.substring(4, 6) + "-" + str.substring(6))
			}
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
				result.count[dateSubstract(startDate, string2Date(data[i].regDate))] = data[i].count;
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

		var captions = ["日注册用户数", "日发布服务数"];
		$rootScope.Caption = captions[$stateParams.dataType];


		function query(days){
			$scope.endDate = getToday();
			var temp = new Date($scope.endDate);
			temp.setDate(temp.getDate() - days);
			$scope.startDate = formatDate(temp);
			$scope.myStart = $scope.startDate;
			$scope.myEnd = $scope.endDate;
			$scope.daysSelected = days + 1;
			ChartFactory.queryStatistics($scope.startDate.replace(/-/g, ""), $scope.endDate.replace(/-/g, ""), $stateParams.dataType)
				.success(function(data){
					var result = getChartData($scope.startDate, $scope.endDate, data);
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
			if(!compareTime($scope.startDate, $scope.endDate) || $scope.startDate == '' || $scope.endDate == ''){
				alert("请输入正确的起止日期");
				return;
			}
			else{
				ChartFactory.queryStatistics($scope.startDate.replace(/-/g, ""), $scope.endDate.replace(/-/g, ""), $stateParams.dataType)
					.success(function(data){
						var result = getChartData($scope.startDate, $scope.endDate, data);
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
	});