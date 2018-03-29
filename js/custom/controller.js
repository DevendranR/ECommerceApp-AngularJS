var fiveyVentures = angular.module("fiveyVentures", ['ui.bootstrap','ngRoute','fiveyservices']);

fiveyVentures.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'partials/home.html',
		controller : 'homeController'
	}).when('/service', {
		templateUrl : 'partials/services.html',
		controller : 'serviceController'
	}).when('/product', {
		templateUrl : 'partials/products.html',
		controller : 'productController'
	}).when('/cart', {
		templateUrl : 'partials/cart.html',
		controller : 'cartController'
	}).when('/disclaimer', {
		templateUrl : 'partials/disclaimer.html'
	}).when('/privacy', {
		templateUrl : 'partials/privacy.html'
	}).otherwise({
		redirectTo : '/'
	});
} ]);

fiveyVentures.config(function($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";
	$httpProvider.defaults.headers.post['Data-Type'] = "json";
});

fiveyVentures.controller(
		'indexController', 
		function ($scope,$location,$anchorScroll,serviceCart) {
		  $scope.isNavCollapsed = true;
		  $scope.isCollapsed = false;
		  $scope.isCollapsedHorizontal = false;
		  $scope.cartLength=0;
		  $scope.jumpToLocation = function(key){
			  	if(window.location!="#/"){
			  		window.location="#/#"+key;
			  	}
			    $location.hash(key);
			    $anchorScroll();
			  }
		  
		  $scope.initialize = function() {
				var fiveyVentures = {lat: 12.7123398, lng: 77.80034};
			    var map = new google.maps.Map(document.getElementById('googleMap'), {
			      zoom: 12,
			      center: fiveyVentures
			    });
			    var marker = new google.maps.Marker({
			      position: fiveyVentures,
			      map: map
			    });
		       } 
		  $scope.$watch(function(){
			  return serviceCart.getAllSessionValue();
		  },function(newVal,oldVal){
			   var cartVal= serviceCart.fetchCartValue().length;
			   $scope.cartLength =cartVal;
		  },true);
	});

	
fiveyVentures.controller(
		"homeController",
		function($scope,$http,$uibModal) {
			$scope.errMessage="";
			
		     
		     $scope.validateContact = function(){
		    	 var $ctrl = this;
			    	    try {
			    	    	var data = {'name':$scope.contactForm.name,'email':$scope.contactForm.email,
			    	    			'phone':$scope.contactForm.phone,'message':$scope.contactForm.message};
							var responsePromise = $http.post("php/contact_us.php",data);
							
						} catch (err) {
							
						}
						responsePromise
								.success(function(dataFromServer, status,headers, config) {
									alert(dataFromServer);
									$ctrl.items=config.data;
									var modalInstance = $uibModal.open({
									      animation: $scope.animationsEnabled,
									      templateUrl: 'myModalContent.html',
									      controller: 'ModalInstanceCtrl',
									      controllerAs: '$ctrl',
									      size: 'md',
									      resolve: {
									          items: function () {
									            return $ctrl.items;
									          }
									        }
									    });
								});
						responsePromise.error(function(data, status,
								headers, config) {
							alert(status+"fail");
						});
		    	    
		    	
		     }
			//carousal starts

			  $scope.myInterval = 3000;
			  $scope.noWrapSlides = false;
			  $scope.active = 0;
			  var slides = $scope.slides = [];
			  var currIndex = 0;

			  $scope.addSlide = function() {
			    var newWidth = 600 + slides.length + 1;
			    slides.push({
			      image: ['img/fiveyCover.jpg','img/fiveyCover2.jpg','img/fiveyCover.jpg','img/fiveyCover2.jpg'][slides.length % 4],
			      text: ['FiveYventures','JSW Cements','FiveYventures','JSW Cements'][slides.length % 4],
			      id: currIndex++
			    });
			  };

			  for (var i = 0; i < 4; i++) {
			    $scope.addSlide();
			  }


		});
fiveyVentures.controller(
		'ModalInstanceCtrl', 
		function ($uibModalInstance,items,serviceCart) {
			
	  var $ctrl = this;
	  $ctrl.placeOrderForm={};
	  $ctrl.items= items
	  $ctrl.ok = function () {
	    $uibModalInstance.close();
	  };
	  $ctrl.addCustomerDetails = function(){
		  var data = {'name':$ctrl.placeOrderForm.name.$modelValue,'email':$ctrl.placeOrderForm.email.$modelValue,
	    			'phone':$ctrl.placeOrderForm.phone.$modelValue};
		  serviceCart.addCustomerDetails(data);
		  serviceCart.placeOrder(data);
		  $ctrl.ok();
	  }
	});
fiveyVentures.controller(
		"productController",
		function($scope,serviceCart,$uibModal,$window,$http) {
			$scope.products=[];
			$scope.selectedType="";
			$scope.price=[];
			$scope.quantity="";
			$scope.divprice="";
			$scope.getProducts = function() {
				
				var responsePromise = $http.get("json/products.json");

				responsePromise
						.success(function(dataFromServer, status,headers, config) {
							$scope.products=dataFromServer;
						});
				responsePromise.error(function(data, status,
						headers, config) {
					alert(status+"fail");
				});
			
			}
			$scope.selectprice=function(selectedType,index){
				$scope.price[index]=selectedType.price;
			}
			$scope.addToList=function(product,quantity,type){
				$ctrl = this;
				$scope.errMessage='';
				if(quantity==''||quantity==null){
					$scope.errMessage = 'Kindly fill the Quantity';
					$window.scrollTo(0,0);
				}
				if($scope.errMessage==''){
					var sessionProduct={'Id':product.pid,'Name':product.pname,'Type':product.ptype,'Quantity':quantity,'QuantityType':type,'Diameter':product.pdiameter}
					$scope.items = angular.fromJson(sessionProduct);
					serviceCart.addToCart(sessionProduct);
					$ctrl.items=$scope.items;
					var modalInstance = $uibModal.open({
					      animation: $scope.animationsEnabled,
					      templateUrl: 'addedToCart.html',
					      controller: 'ModalInstanceCtrl',
					      controllerAs: '$ctrl',
					      size: 'md',
					      resolve: {
					          items: function () {
					            return $ctrl.items;
					          }
					        }
					    });
				}
			}
		});
fiveyVentures.controller(
		"serviceController",
		function($scope) {
			$scope.getUserName = function() {
				
			}
		});
fiveyVentures.controller(
		"cartController",
		function($scope,$route,serviceCart,$uibModal,$http) {
			$scope.getCartValue = function() {
				$scope.cartItems = serviceCart.fetchCartValue(); 
			}
			$scope.removeFromCart = function(item) {
				serviceCart.removeCartValue(item);
				$route.reload();
			}
			$scope.placeOrder = function(cartItems){
				try {
					
	    	    	
	    	    	var cust = serviceCart.fetchCustomerValues();
	    	    	
	    	    	if(cust==undefined || cust==null){
	    	    		var modalInstance = $uibModal.open({
						      animation: $scope.animationsEnabled,
						      templateUrl: 'addCustomerDetails.html',
						      controller: 'ModalInstanceCtrl',
						      controllerAs: '$ctrl',
						      size: 'md',
						      resolve: {
						          items: function () {
						            return "";
						          }
						        }
						    });
	    	    	}
	    	    	else{
	    	    		serviceCart.placeOrder(cust);

	    	    	}
				} catch (err) {
					
				}
			}
		});

