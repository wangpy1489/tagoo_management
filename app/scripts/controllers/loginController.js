/**
 * Created by kubenetes on 16/4/10.
 */
angular.module('sbAdminApp')
    .factory("LoginFactory",['$http', "BaseUrl", 'partnerPort', function($http, BaseUrl, partnerPort){
        var factory = {};
        factory.login = function(account, password){
            var data = {};
            data.account = account;
            data.password = password;
            return $http({
                method: "POST",
                url: BaseUrl + partnerPort + "/partner/login",
                data: JSON.stringify(data),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        factory.whetheradmin = function(sceneId){
            return $http({
                method: "get",
                url: BaseUrl + partnerPort + "/partner/whetheradmin?sceneId=" + sceneId,
                crossDomain: true
            });
        }
        return factory;

    }])
    .controller('LoginCtrl', ['$scope','$cookies','$rootScope', 'LoginFactory', '$state',
        function($scope, $cookies, $rootScope, LoginFactory, $state) {
	        $state.go('manage.admin');
            if($cookies.get('currentUser') != undefined && $cookies.get('authority') != undefined){
                if($cookies.get('authority') == 'admin'){
                    $state.go('manage.admin');
                }
                else if($cookies.get('authority') == 'partner'){
                    $state.go('manage.chart');
                }
            }
            $scope.login = function(){
                LoginFactory.login($scope.account, $scope.password)
                    .success(function (data){
                        if(data.status == false){
                            alert(data.errorMes);
                            return;
                        }
                        var expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + 1);
                        console.log($cookies.get("hhh") == undefined);
                        data.account = $scope.account;
                        data.password = $scope.password;
                        $cookies.putObject('currentUser', data, {'expires': expireDate});
                        console.log(JSON.stringify(data));
                        LoginFactory.whetheradmin(data.sceneId)
                            .success(function (data1){
                                if(data1.toString() == "true") {
                                    $cookies.put('authority', 'admin', {'expires': expireDate});
                                    $state.go('manage.admin');
                                }
                                else{
                                    $cookies.put('authority', 'partner', {'expires': expireDate});
                                    $state.go('manage.chart');
                                }
                            });
                    })
                    .error(function(){
                        alert("登录失败,请检查网络!");
                    });
            }
        }
    ]);