/**
 * Created by kubenetes on 16/4/14.
 */
angular.module('sbAdminApp')
    .filter('toIdentity', function() {
        return function(admin) {
            return admin == true || admin == "true" ? "管理员" : "非管理员";
        };
    })
    .factory("AdminFactory",['$http', "BaseUrl", 'partnerPort', function($http, BaseUrl, partnerPort){
        var factory = {};
        factory.getAllPartner = function(){
            return $http({
                method: "GET",
                url: BaseUrl + partnerPort + "/partner/all",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.deletePartner = function(partnerId){
            var info = {};
            info.partnerId = partnerId;
            return $http({
                method: "POST",
                data: JSON.stringify(info),
                url: BaseUrl + partnerPort + "/partner/delete",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.updatePartner = function(info){
            return $http({
                method: "POST",
                data: JSON.stringify(info),
                url: BaseUrl + partnerPort + "/partner/update",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.createPartner = function(info){
            return $http({
                method: "POST",
                data: JSON.stringify(info),
                url: BaseUrl + partnerPort + "/partner/add",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.clone = function(obj){
            var newO = {};

            if (obj instanceof Array) {
                newO = [];
            }
            for (var key in obj) {
                var val = obj[key];
                newO[key] = typeof val === 'object' ? arguments.callee(val) : val;
            }
            return newO;
        };

        factory.copy = function(from, to){
            for (var key in from) {
                var val = from[key];
                to[key] = val;
            }
        };

        factory.createRight = function(info){
            return $http({
                method: "POST",
                url: BaseUrl + partnerPort + "/right/add",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                data: info,
                crossDomain: true
            });
        };

        factory.getAllRight = function(){
            return $http({
                method: "GET",
                url: BaseUrl + partnerPort + "/right/all",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        factory.updateRight = function(info){
            return $http({
                method: "POST",
                url: BaseUrl + partnerPort + "/right/update",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                data: info,
                crossDomain: true
            });
        };

        factory.deleteRight = function(info){
            return $http({
                method: "POST",
                url: BaseUrl + partnerPort + "/right/delete",
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                data: info,
                crossDomain: true
            });
        }

        return factory;

    }])
    .controller('AdminCtrl', ['$scope', 'AdminFactory', 'createDialog', '$cookies', '$state', function($scope, AdminFactory, createDialog, $cookies, $state) {
        if($cookies.get('currentUser') == undefined || $cookies.get('authority') != 'admin' ||
            $cookies.get('authority') == undefined){
            $state.go('login');
        }
        //manage users
        $scope.itemsByPage = 8;
        AdminFactory.getAllPartner()
            .success(function(data){
                var result = new Array();
                for(var x in data){
                    if(data[x].valid) {
                        result.push(data[x]);
                    }
                }
                $scope.rowCollection = result;
                $scope.displayCollection = [].concat($scope.rowCollection);
            })
        $scope.deletePartner = function(row){
            createDialog('', {
                id: 'simpleDialog',
                title: '确认删除用户: ' + row.name + ' ?',
                backdrop: true,
                css: {
                    'left': '0',
                    'top': '20%'
                },
                success: {label: '删除', fn: function() {
                    AdminFactory.deletePartner(row.partnerId)
                        .success(function(data){
                            if(data.status == true){
                                var index = $scope.rowCollection.indexOf(row);
                                if(index !== -1){
                                    $scope.rowCollection.splice(index, 1);
                                }
                            }
                            else{
                                alert(data.errorMes);
                            }
                        })
                        .error(function(){
                            alert("网络错误");
                        })
                }},
                cancel: {label: '取消'}
            });

        }

        var modalFooter = '<button class="btn btn-success btn-outline ng-binding" ng-click="updateSave()">' +
            '保存&nbsp<span class="glyphicon glyphicon-ok"></span></button>' +
        '<button class="btn btn-primary btn-outline ng-binding" ng-click="$modalCancel()">' +
            '取消&nbsp<span class="glyphicon glyphicon-trash"></span></button>';

        var createFooter = '<button class="btn btn-success btn-outline ng-binding" ng-click="create()">' +
            '添加&nbsp<span class="glyphicon glyphicon-plus"></span></button>' +
            '<button class="btn btn-primary btn-outline ng-binding" ng-click="$modalCancel()">' +
            '取消&nbsp<span class="glyphicon glyphicon-trash"></span></button>';

        $scope.updatePartner = function(row){
            createDialog('views/component/modal/simpleModal.html', {
                id: 'simpleDialog',
                title: '编辑用户信息',
                backdrop: true,
                css: {"left":"0%"},
                controller: 'ModifyCtrl',
                footerTemplate: modalFooter,
                success: {label: 'Success'}
            }, {
                row: row,
                edit: true
            });
        };

        $scope.createPartner = function(){
            var row = {};
            createDialog('views/component/modal/simpleModal.html', {
                id: 'createPartner',
                title: '创建新用户',
                backdrop: true,
                css: {"left":"0%"},
                controller: 'CreateCtrl',
                footerTemplate: createFooter,
                success: {label: 'Success'}
            }, {
                edit: false,
                row: row
            });
        };

        //manage rights
        var createRightFooter = '<button class="btn btn-success btn-outline ng-binding" ng-click="modalCreateRight()">' +
            '添加&nbsp<span class="glyphicon glyphicon-plus"></span></button>' +
            '<button class="btn btn-primary btn-outline ng-binding" ng-click="$modalCancel()">' +
            '取消&nbsp<span class="glyphicon glyphicon-trash"></span></button>';

        var updateRightFooter = '<button class="btn btn-success btn-outline ng-binding" ng-click="modalUpdateRight()">' +
            '保存&nbsp<span class="glyphicon glyphicon-ok"></span></button>' +
            '<button class="btn btn-primary btn-outline ng-binding" ng-click="$modalCancel()">' +
            '取消&nbsp<span class="glyphicon glyphicon-trash"></span></button>';

        AdminFactory.getAllRight()
            .success(function(data){
                var result = new Array();
                for(var x in data){
                    if(data[x].valid) {
                        result.push(data[x]);
                        console.log(data[x]);
                    }
                }
                $scope.rowAuthority = result;
                $scope.authorityCollection = [].concat($scope.rowAuthority);
            });

        $scope.createRight = function(){
            var rowRight = {};
            createDialog('views/component/modal/rightModal.html', {
                id: 'createRight',
                title: '创建新权限',
                backdrop: true,
                controller: 'CreateRightCtrl',
                css: {"left":"0%"},
                footerTemplate: createRightFooter,
                success: {label: 'Success'}
            }, {
                rowRight: rowRight,
                edit: false
            });
        }

        $scope.updateRight = function(row){

            createDialog('views/component/modal/rightModal.html', {
                id: 'updateRight',
                title: '编辑权限',
                backdrop: true,
                css: {"left":"0%"},
                controller: 'UpdateRightCtrl',
                footerTemplate: updateRightFooter,
                success: {label: 'Success'}
            }, {
                rowRight: row,
                edit: true
            });
        }

        $scope.deleteRight = function(row){
            createDialog('', {
                id: 'simpleDialog',
                title: '确认删除权限: ' + row.sceneId + ' ?',
                backdrop: true,
                css: {
                    'left': '0',
                    'top': '20%'
                },
                success: {
                    label: '删除', fn: function () {
                        AdminFactory.deleteRight(row)
                            .success(function(data){
                                if(data.status == true){
                                    var index = $scope.rowAuthority.indexOf(row);
                                    if(index !== -1){
                                        $scope.rowAuthority.splice(index, 1);
                                    }
                                }
                                else{
                                    alert(data.errorMes);
                                }
                            })
                            .error(function(){
                                alert("网络错误");
                            })
                    }
                },
                cancel: {label: '取消'}
            });
        }

    }])

    .controller('ModifyCtrl', ['$scope', 'AdminFactory', 'row', 'edit',
        function($scope, AdminFactory, row, edit) {
            //deep copy
            $scope.row = AdminFactory.clone(row);
            $scope.edit = edit;
            $scope.updateSave = function(){
                AdminFactory.updatePartner($scope.row)
                    .success(function(data){
                        if(data.status != true){
                            alert(data.errorMes);
                            $scope.$modalCancel();

                        }
                        else{
                            alert("修改成功");
                            AdminFactory.copy($scope.row, row);
                            $scope.$modalCancel();
                        }
                    })
                    .error(function(){
                        alert("网络错误");
                        $scope.$modalCancel();
                    })
            }

    }])

    .controller('CreateCtrl', ['$scope', 'AdminFactory', 'edit', 'row', '$state',
        function($scope, AdminFactory, edit, row, $state) {
            $scope.row = row;
            $scope.edit = edit;
            $scope.create = function(){
                AdminFactory.createPartner($scope.row)
                    .success(function(data){
                        if(data.status != true){
                            alert(data.errorMes);
                            $scope.$modalCancel();

                        }
                        else{
                            alert("添加成功");
                            $scope.$modalCancel();
                            $state.reload();
                        }
                    })
                    .error(function(){
                        alert("网络错误");
                        $scope.$modalCancel();
                    })
            }
    }])

    .controller('CreateRightCtrl', ['$scope', 'AdminFactory', 'rowRight', 'edit', '$state',
        function($scope, AdminFactory, rowRight, edit, $state) {
            //deep copy
            $scope.rowRight = rowRight;
            $scope.edit = edit;
            $scope.modalCreateRight = function(){
                AdminFactory.createRight($scope.rowRight)
                    .success(function(data){
                        if(data.status != true){
                            alert(data.errorMes);
                            $scope.$modalCancel();

                        }
                        else{
                            alert("添加成功");
                            $scope.$modalCancel();
                            $state.reload();
                        }
                    })
                    .error(function(){
                        alert("网络错误");
                        $scope.$modalCancel();
                    })
            }
        }])

    .controller('UpdateRightCtrl', ['$scope', 'AdminFactory', 'rowRight', 'edit', '$state',
        function($scope, AdminFactory, rowRight, edit, $state) {
            $scope.rowRight = AdminFactory.clone(rowRight);
            $scope.edit = edit;
            $scope.modalUpdateRight = function(){
                console.log($scope.rowRight);
                AdminFactory.updateRight($scope.rowRight)
                    .success(function(data){
                        if(data.status != true){
                            alert(data.errorMes);
                            $scope.$modalCancel();

                        }
                        else{
                            alert("修改成功");
                            AdminFactory.copy($scope.rowRight, rowRight);
                            console.log(rowRight);
                            $scope.$modalCancel();
                        }
                    })
                    .error(function(){
                        alert("网络错误");
                        $scope.$modalCancel();
                    })
            }

        }]);


