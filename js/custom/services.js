var maintainCart = angular.module("fiveyservices", ['ui.bootstrap','ngStorage','ngRoute']);

maintainCart.service('serviceCart', function($sessionStorage,$localStorage,$http,$uibModal,$route) {
    this.addToCart = function (newCartObj) {
    	this.items = '';
    	if($sessionStorage.list==undefined){
    		$sessionStorage.list = [];
    	}
    	this.items = angular.fromJson(newCartObj);
    	this.items.SNo = $sessionStorage.list.length;
    	$sessionStorage.list[$sessionStorage.list.length] = this.items;
    	
    }
    this.getAllSessionValue=function(){
    	return $sessionStorage.list;
    }
    this.fetchCartValue=function(){
    	var newCartVal=[];
    	var cartVal = $sessionStorage.list;
    	if(cartVal!=undefined){
	    	for (i=0; i<cartVal.length; i++){
	    	    if (cartVal[i] != null) {
	    	    	newCartVal[newCartVal.length]=cartVal[i];
	    	    }
	    	}
    	}
    	return newCartVal;
    }
    this.removeCartValue=function(item){
    	var cartValue = $sessionStorage.list;
    	for (i=0; i<cartValue.length; i++){
    	    if (cartValue[i]!=null && cartValue[i].SNo == item.SNo) {
    	    	cartValue[i]=null;
    	    }
    	}
    }
    this.clearCart = function(){
    	$sessionStorage.list=[];
    }
    this.fetchCustomerValues = function(){
    	return $sessionStorage.cust;
    }
    this.addCustomerDetails = function(data){
    	$sessionStorage.cust = data;
    }
    this.placeOrder = function(cust){
    	var cartItems = this.fetchCartValue();
		var data = {"cart":cartItems,"cust":cust};

		var responsePromise = $http.post("php/place_order.php",data);

		responsePromise
				.success(function(dataFromServer, status,headers, config) {
					alert(dataFromServer);
					$sessionStorage.list=[];
					var modalInstance = $uibModal.open({
					      templateUrl: 'orderPlaced.html',
					      controller: 'ModalInstanceCtrl',
					      controllerAs: '$ctrl',
					      size: 'md',
					      resolve: {
					          items: function () {
					            return "";
					          }
					        }
					    });
					$route.reload();
				});
		responsePromise.error(function(data, status,
				headers, config) {
			alert(status+"fail");
		});
    }
});