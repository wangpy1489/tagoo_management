/**
 * Created by kubenetes on 2017/8/3.
 */
angular.module('sbAdminApp')
	.factory("ManageServiceFactory",function($http, BaseUrl, Port, UserPort){
		var factory = {};
		factory.getBasicLabels = function(){
			return $http({
				method: 'GET',
				url: BaseUrl + UserPort + '/service/getBasiclabel',
				crossDomain: true
			});
		};

		factory.getServiceLabels = function(){
			return $http({
				method: 'GET',
				url: BaseUrl + UserPort + '/service/getservicelabel',
				crossDomain: true
			});
		};

		factory.mergeLabels = function(basicLabels, serviceLabels){
			var temp = {};
			var result = [];
			for(item in basicLabels){
				basicLabels[item].services = [];
				temp[basicLabels[item].id] = basicLabels[item];
			}
			for(item in serviceLabels){
				temp[serviceLabels[item].basicTypeId].services.push(serviceLabels[item]);
			}
			for(item in temp){
				result.push(temp[item]);
			}
			console.log("merge");
			return result;
		};

		factory.addBasicLabel = function(label){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/addbasiclabel?label=' + label,
				crossDomain: true
			});
		};

		factory.removeBasicLabel = function(id){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/removebasiclabel?id=' + id,
				crossDomain: true
			});
		};

		factory.addServiceLabel = function(basicLabelId, label){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/addservicelabel?label=' + label + "&basicLabelId=" + basicLabelId,
				crossDomain: true
			});
		};

		factory.removeServiceLabel = function(id){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/removeservicelabel?id=' + id,
				crossDomain: true
			});
		};

		factory.getAllServices = function(){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/findall',
				crossDomain: true
			});
		};

		factory.getAllUsers = function(){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/user/findall',
				crossDomain: true
			});
		};

		return factory;

	})
	.controller('ManageServiceCtrl', function($scope, BaseUrl, Port, UserPort, ManageServiceFactory, createDialog) {
		$scope.dialogShown = {
			'flag': false,
			'flag1': false
		}
		function getAllLabels(){
			ManageServiceFactory.getBasicLabels()
				.success(function(basicLabels){
					ManageServiceFactory.getServiceLabels()
						.success(function(serviceLabels){
							$scope.labels = ManageServiceFactory.mergeLabels(basicLabels, serviceLabels);
							$scope.rowCollection = $scope.labels;
							$scope.displayCollection = [].concat($scope.rowCollection);
							console.log("labels", $scope.labels);
						})
				})
		}
		getAllLabels();
		$scope.newBasicLabel = {}
		$scope.addBasicLabel = function(newBasicLabel){
			if(newBasicLabel == "" || newBasicLabel == undefined){
				alert("服务标签不能为空");
				return;
			}
			ManageServiceFactory.addBasicLabel(newBasicLabel)
				.success(function(data){
					$scope.dialogShown = false;
					getAllLabels();
					alert("新建服务标签成功");
				})
				.error(function(err){
					$scope.dialogShown = false;
					alert("新建服务标签失败");
				})
		}

		$scope.deleteBasicLabel = function(label){
			if(confirm('确定删除"' + label.type + '"的服务标签?')){
				ManageServiceFactory.removeBasicLabel(label.id)
					.success(function(data){
						if(data.result == "OK"){
							alert("删除服务标签成功");
							getAllLabels();
						}
						else{
							alert(data.result);
						}
					})
					.error(function(err){
						alert("删除服务标签失败");
					})

			}
		}

		$scope.newServiceLabel = {};

		$scope.showNewServiceLabelModal = function(row){
			console.log("row", row);
			$scope.newServiceLabel = {};
			$scope.dialogShown.flag1 = true;
			$scope.newServiceLabel.basicLabelType = row.type;
			$scope.newServiceLabel.basicLabelId = row.id;
		}

		$scope.addServiceLabel = function(basicLabelId, label){
			if(label == "" || label == undefined){
				alert("子标签内容不能为空");
				return;
			}
			ManageServiceFactory.addServiceLabel(basicLabelId, label)
				.success(function(data){
					if(data.result == "OK"){
						alert("新建子标签成功!");
						getAllLabels();
						$scope.dialogShown.flag1 = false
					}
					else{
						alert(data.result);
					}
				})
				.error(function(err){
					alert("新建子标签失败!");
				})
		}

		$scope.deleteServiceLabel = function(label){
			if(confirm('确认要删除"' + label.type + '"的子标签?')){
				ManageServiceFactory.removeServiceLabel(label.id)
					.success(function(data){
						if(data.result == "OK"){
							alert("删除子标签成功!");
							getAllLabels();
						}
						else{
							alert(data.result);
						}
					})
					.error(function(err){
						alert("删除子标签失败!");
					})
			}

		}

		var getAllServices = function(){
			ManageServiceFactory.getAllServices()
				.success(function(data){
					console.log("all services", data);
					$scope.rowServices = data;
					$scope.allServices = data;
					$scope.displayedServices = [].concat(data);
				})
				.error(function(err){

				})
		};

		getAllServices();

		$scope.getBasicLabel = function(serviceId, labels){
			for(item in labels){
				for(service in labels[item].services){
					if(labels[item].services[service].id == serviceId){
						return labels[item].type;
					}
				}
			}
		};

		var getAllUsers = function(){
			ManageServiceFactory.getAllUsers()
				.success(function(data){
					$scope.allUsers = data
				})
		}
		getAllUsers();

		$scope.getUserName = function(userId, userList){
			for(item in userList){
				if(userList[item].id == userId){
					return userList[item].userName;
				}
			}
		}

	});

