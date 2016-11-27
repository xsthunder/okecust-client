/**
 * Created by YY on 2016/9/2.
 */
angular.module('teacher.qa.qaList', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.qaList', {
      url: '/qa/qaList',
      views: {
        'header': {
          templateUrl: 'app/layout/header/header2.html',
          controller: 'qaListHeaderCtrl'
        },
        'main': {
          templateUrl: 'app/teacher/qa/qaList/qaList.html',
          controller: 'qaListMainCtrl'
        },
        'footer': {
          templateUrl: 'app/layout/footer/footer.html',
          controller: 'qaListFooterCtrl'
        }
      }
    })
  })
  //工厂
  .factory('qaListFactory', function () {
  })
  .controller('qaListHeaderCtrl', function ($scope) {
    $scope.title = '已选题目';
  })

  .controller('qaListMainCtrl', function ($scope, $mdDialog, qaListFactory, $log) {
    var library = qaListFactory;
    var id1 = 'c26afa6e0b9ba1ffaee94eff5c2e66f3'; //计算机基础id
    var id2 = '725efd44e34c9ea8730645c90454fd4a'; //线代id
    library._id = id2;
    qaListFactory.getQuestionLibraryQuestion(library._id, function (err, questions) {
      if(err){return alert('some error: '+err);}
      console.log(questions);
    });
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
  .controller('qaListFooterCtrl', function ($scope) {
    $scope.title = '保存';
    $scope.sref = 'teacher.qa';
  });