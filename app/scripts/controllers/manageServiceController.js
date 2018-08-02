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

		factory.addService = function(service){
			return $http({
				method: 'POST',
				url: BaseUrl + UserPort + '/service/newpublish',
				data: JSON.stringify(service),
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};

		factory.getPicture = function(id){
			return $http({
				method: 'GET',
				url: BaseUrl + UserPort + '/service/getpicture?id=' + id,
				crossDomain: true
			});
		};

		factory.uploadPicture = function(data){
			return $http({
				method: 'POST',
				url: BaseUrl + UserPort + '/service/uploadpicture',
				data: data,
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};

		factory.deleteService = function(serviceid){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/service/remove?serviceid=' + serviceid,
				crossDomain: true
			});
		};

		factory.modifyService = function(service){
			return $http({
				method: 'POST',
				url: BaseUrl + Port + '/service/modify',
				data: JSON.stringify(service),
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};

		return factory;

	})
	.controller('ManageServiceCtrl', function($scope, BaseUrl, Port, UserPort, ManageServiceFactory, $filter) {
		$scope.dialogShown = {
			'flag': false,
			'flag1': false,
			'service': false,
			'previewPicture': false,
			'uploadPicture':false,
			'modifyService': false
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
		$scope.newBasicLabel = {};
		$scope.addBasicLabel = function(newBasicLabel){
			if(newBasicLabel == "" || newBasicLabel == undefined){
				alert("服务标签不能为空");
				return;
			}
			ManageServiceFactory.addBasicLabel(newBasicLabel)
				.success(function(data){
					$scope.dialogShown.flag = false;
					getAllLabels();
					alert("新建服务标签成功");
				})
				.error(function(err){
					$scope.dialogShown.flag = false;
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
						$scope.dialogShown.flag1 = false;
						getAllLabels();
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
					console.log("allUsers",data)
					$scope.allUsers = data;

				})
		}
		getAllUsers();

		$scope.getUserName = function(userId, userList){
			for(item in userList){
				if(userList[item].id == userId){
					return userList[item].userName;
				}
			}
		};
		$scope.showAddServiceModal = function(){
			$scope.newService = {};
			$scope.newService.publishUser = $scope.allUsers[0];
			$scope.newService.basicLabel = $scope.labels[0];
			$scope.newService.serviceLabel = $scope.newService.basicLabel.services[0];
			$scope.$watch('newService.basicLabel', function(){
				$scope.newService.serviceLabel = $scope.newService.basicLabel.services[0];
			});
			$scope.dialogShown.service = true;
		};

		$scope.addNewService = function(data) {
			var service = {
				'longitude': data.longitude,
				'latitude': data.latitude,
				'slogan': data.slogan,
				'datetime': $filter('date')(new Date(), 'yyyyMMdd'),
				'publishUserId': data.publishUser.id,
				// 'serviceLabelId':data.serviceLabel.id
                'thirdLabelId' : data.serviceLabel.id

			};
			if (service.longitude == undefined || service.longitude == null
				|| service.latitude == undefined || service.latitude == null
				|| service.slogan == undefined || service.slogan == "") {
				alert("请完整填写服务信息!");
				return;
			};
			ManageServiceFactory.addService(service)
				.success(function(info){
					alert("新建服务成功!");
					$scope.dialogShown.service = false;
					getAllServices();
				})
				.error(function(err){
					alert("新建服务失败");
				});
		};

		$scope.previewPicture = function(svc){
			$scope.picture=null;
			$scope.dialogShown.previewPicture = true;
			ManageServiceFactory.getPicture(svc.id)
				.success(function(data){
					$scope.picture = data;
				})
		};

		$scope.showUploadPictureModal = function(row){
			$scope.files = {
				'serviceId': row.id
			}
			$scope.dialogShown.uploadPicture = true;
		}

		$scope.uploadPicture = function(image, serviceId){
			var data = {
				"id": serviceId,
				"pictureImageValue": [image.base64]
			};
			console.log("picture",data);
			ManageServiceFactory.uploadPicture(data)
				.success(function(info){
					alert("上传图片成功!");
					getAllServices();
					$scope.dialogShown.uploadPicture = false;
				})
				.error(function(err){
					alert("上传图片失败!");
				})
		}

		$scope.deleteService = function(row){
			if(confirm('确定要删除该服务?')){
				ManageServiceFactory.deleteService(row.id)
					.success(function(data){
						if(data.status == 0){
							alert("删除服务成功!");
							getAllServices();
						}
						else{
							alert("删除服务失败");
						}
					})
					.error(function(err){
						alert("删除服务失败");
					})
			}
		}

		$scope.showModifyServiceModal = function(row){
			$scope.dialogShown.modifyService = true;
			$scope.modifyService = angular.copy(row);
		}

		$scope.modifyServiceFunc = function(service){
			if (service.longitude == undefined || service.longitude == null
				|| service.latitude == undefined || service.latitude == null
				|| service.slogan == undefined || service.slogan == "") {
				alert("请完整填写服务信息!");
				return;
			}
			ManageServiceFactory.modifyService(service)
				.success(function(data){
					if(data.status == 0){
						alert("修改服务信息成功!");
						getAllServices();
						$scope.dialogShown.modifyService = false;
					}
					else{
						alert("修改服务信息失败!");
					}
				})
				.error(function(err){
					alert("修改服务信息失败")
				})

		}

	});

