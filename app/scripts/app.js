'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
    .module('sbAdminApp', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar'
    ])
    .constant("BaseUrl", "http://202.120.40.108:")
	.constant("UserPort", "22201")
	.constant("Port", "22202")
	.constant("partnerPort", "22333")
    .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
        debug:false,
        events:true
    });

    $urlRouterProvider.otherwise('/manage/user');

    $stateProvider
        .state('login',{
            templateUrl:'views/login.html',
            url:'/login',
            controller: 'LoginCtrl',
            resolve: {
                loadMyFile:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/loginController.js'
                        ]
                    }),
                    $ocLazyLoad.load({
	                    name:'ngCookies',
	                    files:['bower_components/angular-cookies/angular-cookies.js']
                    });
                }
            }
        })

        .state('manage',{
            templateUrl:'views/manage.html',
            url:'/manage',
            controller: 'ManageCtrl',
            resolve: {
                loadMyDirectives:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'views/component/header/header.js',
                            'views/component/sidebar/sidebar.js',
                            'scripts/controllers/manageController.js'
                        ]
                    }),
                    $ocLazyLoad.load({
	                    name:'ngModal',
	                    files:[
		                    'bower_components/ngModal/dist/ng-modal.js'
	                    ]
                    }),
                    $ocLazyLoad.load({
                        name:'ngCookies',
                        files:['bower_components/angular-cookies/angular-cookies.js']
                    }),
                    $ocLazyLoad.load({
	                    name:'naif.base64',
	                    files:['bower_components/angular-base64-upload/dist/angular-base64-upload.js']
                    });
                }
            }
        })
        .state('manage.chart',{
            templateUrl:'views/chart.html',
            params: {
                dataType: 0
            },
            url:'/chart',
            controller:'ChartCtrl',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }),
                    $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/chartController.js'
                        ]
                    });
                }
            }
        })

	    .state('manage.user',{
		    templateUrl:'views/manageUser.html',
		    url:'/user',
		    controller:'ManageUserCtrl',
		    resolve: {
			    loadMyFiles:function($ocLazyLoad) {
				    return $ocLazyLoad.load({
					    name:'sbAdminApp',
					    files:[
						    'scripts/controllers/manageUserController.js'
					    ]
				    }),
				    $ocLazyLoad.load({
					    name:'smart-table',
					    files:[
						    'bower_components/angular-smart-table/dist/smart-table.min.js'
					    ]
				    });
			    }
		    }
	    })

	    .state('manage.service',{
		    templateUrl:'views/manageService.html',
		    url:'/service',
		    controller:'ManageServiceCtrl',
		    resolve: {
			    loadMyFiles:function($ocLazyLoad) {
				    return $ocLazyLoad.load({
					    name:'sbAdminApp',
					    files:[
						    'scripts/controllers/manageServiceController.js'
					    ]
				    }),
				    $ocLazyLoad.load({
					    name:'smart-table',
					    files:[
						    'bower_components/angular-smart-table/dist/smart-table.min.js'
					    ]
				    }),
				    $ocLazyLoad.load({
					    name:'fundoo.services',
					    files:[
						    'bower_components/angularjs-modal-service/src/createDialog.js'
					    ]
				    });
			    }
		    }
	    })

        .state('manage.admin',{
            templateUrl:'views/admin.html',
            url:'/admin',
            controller:'AdminCtrl',
            resolve: {
                loadAdminFile:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/adminController.js'
                        ]
                    }),
                    $ocLazyLoad.load({
                        name:'smart-table',
                        files:[
                            'bower_components/angular-smart-table/dist/smart-table.min.js'
                        ]
                    }),
                    $ocLazyLoad.load({
                        name:'fundoo.services',
                        files:[
                            'bower_components/angularjs-modal-service/src/createDialog.js'
                        ]
                    });
                }
            }
        })



        .state('manage.changePassword',{
            templateUrl:'views/changePassword.html',
            url:'/changPassword',
            controller: 'changePasswordCtrl',
            resolve: {
                loadChangePassswordFile:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/changePasswordController.js'
                        ]
                    })
                }
            }
        })
    //   .state('dashboard.table',{
    //     templateUrl:'views/table.html',
    //     url:'/table'
    // })
    //   .state('dashboard.panels-wells',{
    //       templateUrl:'views/ui-elements/panels-wells.html',
    //       url:'/panels-wells'
    //   })
    //   .state('dashboard.buttons',{
    //     templateUrl:'views/ui-elements/buttons.html',
    //     url:'/buttons'
    // })
    //   .state('dashboard.notifications',{
    //     templateUrl:'views/ui-elements/notifications.html',
    //     url:'/notifications'
    // })
    //   .state('dashboard.typography',{
    //    templateUrl:'views/ui-elements/typography.html',
    //    url:'/typography'
    //})
    //   .state('dashboard.icons',{
    //    templateUrl:'views/ui-elements/icons.html',
    //    url:'/icons'
    //})
    //   .state('dashboard.grid',{
    //    templateUrl:'views/ui-elements/grid.html',
    //    url:'/grid'
    //})
    }]);

    
