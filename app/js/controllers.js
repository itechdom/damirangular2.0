
/* Controllers */

var productcatControllers = angular.module('productcatControllers', ['angularPayments','ui.bootstrap','ngMaterial','ngAria','angularSpinner']);

productcatControllers.controller('ProductListCtrl', ['$scope', 'Product', '$timeout','$uibModal','$mdDialog', 'ngCart','$mdMedia', '$mdSidenav','$log',
  function($scope, Product, $timeout, $uibModal, $mdDialog, ngCart, $mdMedia, $mdSidenav, $log) {
    ngCart.setTaxRate(7.5);
    ngCart.setShipping(2.99);
    $scope.products = Product.query();
    $scope.orderProp = 'year';
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.showPaymentDialog = function(ev) {
       var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
       $mdDialog.show({
         controller: 'DialogController',
         templateUrl: 'checkout.html',
         parent: angular.element(document.body),
         targetEvent: ev,
         clickOutsideToClose:true,
         fullscreen: useFullScreen,
       })
       .then(function(answer) {
         $scope.status = 'You said the information was "' + answer + '".';
       }, function() {
         $scope.status = 'You cancelled the dialog.';
       });
       $scope.$watch(function() {
         return $mdMedia('xs') || $mdMedia('sm');
       }, function(wantsFullScreen) {
         $scope.customFullscreen = (wantsFullScreen === true);
       });
    };
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
     /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
  }]);
productcatControllers.controller('ProductDetailCtrl', ['$scope', '$stateParams', 'Product',
  function($scope, $stateParams, Product) {
    $scope.product = Product.get({id: $stateParams.id}, function(product) {
      $scope.mainImageUrl = product.images[0];
    });
    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);
productcatControllers.controller('DialogController',['$scope', '$mdDialog', 'ngCart',
function($scope, $mdDialog, ngCart) {
    $scope.totalAmount = ngCart.totalCost();

    $scope.onSubmit = function () {
      $scope.processing = true;
    };

    $scope.stripeCallback = function (code, result) {
      $scope.processing = false;
      $scope.hideAlerts();
      if (result.error) {
        $scope.stripeError = result.error.message;
      } else {
        $scope.stripeToken = result.id;
      }
    };
    $scope.hideAlerts = function () {
      $scope.stripeError = null;
      $scope.stripeToken = null;
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

}]);
productcatControllers.controller('CartController',['$scope', 'Product', '$uibModal','$mdDialog', 'ngCart','$mdMedia',
function($scope, ngCart, Product, $uibModal, $mdMedia) {
      $scope.ngCart = ngCart;


  }]);
