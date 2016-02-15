
/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', ['angularPayments','ui.bootstrap','angularSpinner']);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone', '$uibModal',
  function($scope, Phone, $uibModal) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';

    $scope.cart=[];
    $scope.addToCart = function (product) {
      var found = false;
      $scope.cart.forEach(function (item) {
        if (item.id === product.id) {
          item.quantity++;
          found = true;
        }
      });
      if (!found) {
        $scope.cart.push(angular.extend({quantity: 1}, product));
      }
    };

    $scope.getCartPrice = function () {
      var total = 0;
      $scope.cart.forEach(function (product) {
        total += product.price * product.quantity;
      });
      return total;
    };
    $scope.checkout = function () {
			$uibModal.open({
				templateUrl: 'checkout.html',
				controller: 'CheckoutCtrl',
				resolve: {
					totalAmount: $scope.getCartPrice
				}
			});
		};
  }]);
phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });
    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);

  phonecatControllers.controller('CheckoutCtrl', function ($scope, totalAmount) {
    $scope.totalAmount = totalAmount;

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
  });
