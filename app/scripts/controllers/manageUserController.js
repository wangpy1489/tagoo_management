/**
 * Created by kubenetes on 2017/8/3.
 */
angular.module('sbAdminApp')
	.factory("ManageUserFactory",function($http, BaseUrl, Port, UserPort) {
		var factory = {};
		factory.getAllUsers = function(){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/user/findall',
				crossDomain: true
			});
		};
		factory.deleteUser = function(userId){
			return $http({
				method: 'GET',
				url: BaseUrl + Port + '/user/remove?userid=' + userId,
				crossDomain: true
			});
		};
		factory.addUser = function(user){
			return $http({
				method: 'POST',
				url: BaseUrl + UserPort + '/user/register',
				data: JSON.stringify(user),
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};
		factory.modifyUser = function(user){
			return $http({
				method: 'POST',
				url: BaseUrl + Port + '/user/modify',
				data: JSON.stringify(user),
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};
		factory.getPhoto = function(phone){
			return $http({
				method: 'GET',
				url: BaseUrl + UserPort + '/user/getphoto?phone=' + phone,
				crossDomain: true
			});
		};
		factory.uploadPortrait = function(data){
			return $http({
				method: 'POST',
				url: BaseUrl + UserPort + '/user/uploadphoto',
				data: JSON.stringify(data),
				crossDomain: true,
				headers: {'Content-Type': 'application/json;charset=UTF-8'}
			});
		};
		return factory;
	})
	.controller('ManageUserCtrl', function($scope,$position,$state,ManageUserFactory,$filter) {

		$scope.flag = {
			"userModal": false,
			"editable": true,
			'previewPortrait': false,
			'uploadPortrait': false
		}

		var getAllUsers = function(){
			ManageUserFactory.getAllUsers()
				.success(function(data){
					console.log("get all users", data);
					$scope.rowCollection = data;
					$scope.displayCollection = [].concat($scope.rowCollection);
				})
		}
		getAllUsers();

		$scope.deleteUser = function(user){
			if(confirm('确定要删除"' + user.userName + '"的用户?')) {
				ManageUserFactory.deleteUser(user.id)
					.success(function (data) {
						alert("删除用户成功");
						getAllUsers();
					})
					.error(function (err) {
						alert("删除用户失败");
					})
			}
		}

		$scope.showAddUserModal = function(){
			$scope.userInfo = {
				"gender": true
			};
			$scope.flag.userModal = true;
			$scope.flag.editable = true;
		}

		$scope.addUser = function(userInfo){
			if($scope.userInfo.userName==undefined || $scope.userInfo.userName=="" ||
				$scope.userInfo.realName==undefined || $scope.userInfo.realName=="" ||
				$scope.userInfo.phone==undefined || $scope.userInfo.phone=="" ||
				$scope.userInfo.password==undefined || $scope.userInfo.password==""){
				alert("用户信息不能为空");
				return;
			}
			$scope.userInfo.regDate = $filter('date')(new Date(), 'yyyyMMdd');
			ManageUserFactory.addUser($scope.userInfo)
				.success(function(data){
					alert("添加用户成功!");
					getAllUsers();
					$scope.flag.userModal = false;
				})
				.error(function(err){
					alert("添加用户失败!")
				})
		};

		$scope.showModifyUserModal = function(row){
			$scope.flag.editable = false;
			$scope.flag.userModal = true;
			$scope.userInfo = angular.copy(row);
			$scope.userInfo.realName = $scope.userInfo.name;
			delete $scope.userInfo.name;
		}

		$scope.modifyUser = function(row){
			if(row.userName==undefined || row.userName=="" ||
				row.realName==undefined || row.realName==""){
				alert("用户信息不能为空");
				return;
			}
			var temp = {
				"description": row.description,
				"gender": row.gender,
				"id": row.id,
				"phone": row.phone,
				"realName": row.realName,
				"userName": row.userName
			}
			ManageUserFactory.modifyUser(temp)
				.success(function(data){
					alert("修改用户信息成功!");
					getAllUsers();
					$scope.flag.userModal = false;
				})
				.error(function(err){
					alert("修改用户信息失败");
					//$scope.flag.userModal = false;
				})

		}

		$scope.previewPortrait = function(user){
			$scope.portrait=null;
			$scope.flag.previewPortrait = true;
			ManageUserFactory.getPhoto(user.phone)
				.success(function(data){
					$scope.portrait = data;
				})
		}

		$scope.files = {
			'portrait':{}
		};

		$scope.showUploadPortraitModal = function(row){
			$scope.flag.uploadPortrait = true;
			$scope.files.portrait = {};
			$scope.phoneOfPortrait = row.phone;
		}

		$scope.uploadPortrait = function(fileObj, phone){
			var portrait = fileObj.base64;
			var postData = {
				'phone': phone,
				'photoImageValue': portrait
			};
			console.log("postData", postData);
			ManageUserFactory.uploadPortrait(postData)
				.success(function(data){
					alert("头像上传成功!");
					$scope.flag.uploadPortrait = false;
					getAllUsers();
				})
				.error(function(err){
					alert("头像上传失败!");
				})
		}

	});