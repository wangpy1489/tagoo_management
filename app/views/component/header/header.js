'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('header',function(){
		return {
			templateUrl:'views/component/header/header.html',
			restrict: 'E',
			replace: true,
			controller:['$scope', '$cookies', function($scope, $cookies){
				//var currentUserStr = $cookies.get('currentUser');
				//var currentUser = JSON.parse(currentUserStr);
				//$scope.username = currentUser.name;
			}]
    	}
	});


