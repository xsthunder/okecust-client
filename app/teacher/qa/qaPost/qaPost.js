/**
 * Created by YY on 2016/9/2.
 */
angular.module('teacher.qa.qaPost', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.qaPost', {
      url: '/qa/qaPost',
      views: {
        'header': {
          templateUrl: 'app/layout/header/header2.html',
          controller: 'qaPostHeaderCtrl'
        },
        'main': {
          templateUrl: 'app/teacher/qa/qaList/qaList.html',
          controller: 'qaPostMainCtrl'
        },
        'footer': {
          templateUrl: 'app/layout/footer/footer.html',
          controller: 'qaPostFooterCtrl'
        }
      }
    })
  })
  .controller('qaPostHeaderCtrl', function ($scope) {
    $scope.title = '已选题目';
  })
  .controller('qaPostMainCtrl', function ($scope, $mdDialog) {
    $scope.deleteClcik = showDialog;
    function showDialog() {
      $mdDialog.show({
        templateUrl: 'app/layout/dialog/dialog.html',
        controller: function DialogController($scope, $mdDialog) {
          $scope.closeDialog = function () {
            $mdDialog.hide();
          }
        }
      });
    }
  })
  .controller('qaPostFooterCtrl', function ($scope) {
    $scope.title = '发布';
    $scope.sref = 'teacher.qa';
  });/**
 * Created by YY on 2016/9/3.
 */
