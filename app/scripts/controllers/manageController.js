'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ManageCtrl', ['$scope', '$position', '$cookies', '$state', function($scope,$position,$cookies,$state) {
        //var currentUserStr = $cookies.currentUser;
        //var currentUser = JSON.parse(currentUserStr);

        if($cookies.get('currentUser') == undefined || $cookies.get('authority') == undefined){
            console.log($cookies.get('currentUser') == undefined || $cookies.get('authority') == undefined);
            $state.go('login');
        }
        else {
            var currentUserStr = $cookies.get('currentUser');
            var currentUser = JSON.parse(currentUserStr);
            $scope.username = currentUser.name;
        }
    }]);
