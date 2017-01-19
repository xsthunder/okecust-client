angular.module('teacher.qa.addQa', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.addQa', {
      url: '/qa/addQa',
      views: {
        'header': {
          templateUrl: 'app/layout/header/header2.html',
          controller: 'addQaHeaderCtrl'
        },
        'main': {
          templateUrl: 'app/teacher/qa/addQa/addQa.html',
          controller: 'addQaCtrl'
        },
        'footer': {
          templateUrl: 'app/layout/footer/footer.html',
          controller: 'addQaFooterCtrl'
        }
      }
    })
  })
  .controller('addQaHeaderCtrl', function ($scope) {
    $scope.title = '出题';
  })
  .controller('addQaCtrl', function ($scope) {
    $scope.total = 11;
    $scope.question = function () {

    };
    $scope.buttonStatus = function (item) {
      if (item.items.length) {
        return  item.expanded ? 'expand_less' : 'expand_more';
      } else {
        return 'block';
      }
    };
    $scope.items = [{
      title: '1',
      items: [{title: '1.1', items:[{title: '1.1.1', items:[]}]}]
    }, {
      title: '2',
      items: [{title: '2.1', items: []}]
    }, {
      title: '3',
      items: []
    }];
    $scope.toggleItems = function(item) {
      if (item.items) {
        if (Array.isArray(item.items)) {
          item.expanded = !item.expanded;
        }
      } else {
        item.expanded = true;
      }
    };
  })
  .controller('addQaFooterCtrl', function ($scope) {
    $scope.title = '已选题目';
    $scope.sref = 'teacher.qaList';
  });