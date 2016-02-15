var productcatApp = angular.module('productcatApp', [
  'ui.router',
  'ngMaterial',
  'productcatAnimations',
  'productcatControllers',
  'productcatFilters',
  'productcatServices',
  'ngCart.directives'
]);

productcatApp.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider',
  function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('/products');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/products',
            templateUrl: 'partials/product-list.html',
            controller:'ProductListCtrl'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('productDetails', {
          url: '/products/:id',
          templateUrl: 'partials/product-detail.html',
            controller:'ProductDetailCtrl'
        });
  $mdThemingProvider.theme('default')
        .primaryPalette('blue');
}])
.run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

    $rootScope.$on('ngCart:change', function(){
        ngCart.$save();
    });

    if (angular.isObject(store.get('cart'))) {
        ngCart.$restore(store.get('cart'));

    } else {
        ngCart.init();
    }

}]);
