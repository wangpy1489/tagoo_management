/**
 * Created by kubenetes on 16/4/19.
 */
angular.module('sbAdminApp')
    .factory("changePasswordFactory",['$http', "BaseUrl", 'partnerPort', function($http, BaseUrl, partnerPort){
        var factory = {};
        factory.changePassword = function(account, origin_password, new_password){
        var data = {};
            data.account = account;
            data.originpwd = origin_password;
            data.newpwd = new_password;
            return $http({
                method: "POST",
                url: BaseUrl + partnerPort + "/partner/changepwd",
                data: JSON.stringify(data),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        }

        return factory;

    }])
    .controller('changePasswordCtrl', function($scope, $rootScope, changePasswordFactory, $state) {
            //var currentUserStr = $cookies.get("currentUser");
            //console.log(currentUserStr);
            //var currentUser = JSON.parse(currentUserStr);
            //$scope.changePassword = function(){
            //    changePasswordFactory.changePassword(currentUser.account, $scope.origin_password, $scope.new_password)
            //        .success(function (data){
            //            if(data.status == false){
            //                alert(data.errorMes);
            //                return;
            //            }
            //            $cookies.remove("currentUser");
            //            $cookies.remove("authority");
            //            alert("修改成功,请重新登录!");
            //            $state.go('login');
            //        })
            //        .error(function(){
            //            alert("修改失败,请检查网络!");
            //        });
            //}
        }
    );