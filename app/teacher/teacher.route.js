/**
 * Created by YY on 2016/11/12.
 */

(function () {
  angular.module('teacher').config(config);
  function config($stateProvider) {
    $stateProvider
      .state('teacher', teacherRoute)
      .state('teacher.person', teacherPersonRoute)
      .state('teacher.qaReport', teacherQaReportRoute)
      .state('teacher.exam', teacherExamRoute)
      .state('teacher.nameList', teacherNameListRoute)
      .state('teacher.doc', teacherDocRoute)
      .state('teacher.class', teacherClassRoute)
      .state('teacher.qa', teacherQaRoute)
      .state('teacher.docAdd', docAddRoute)
      .state('teacher.qaAdd', qaAddRoute)
      .state('teacher.questionLibraryDetail', questionLibraryDetailRoute)
  }
  var questionLibraryDetailRoute = {
    url: '/questionLibrary/detail',
    views: {
      'header': {
        templateUrl: 'app/layout/header/header2.html',
        controller: 'teacherHeaderCtrl'
      },
      'main': {
        templateUrl: 'app/teacher/questionLibrary/detail/questionLibraryDetail.html',
        controller: 'teacherQuestionLibraryDetailCtrl'
      }
    }
  };
  var qaAddRoute =  {
    url : '/qa/add',
    views : {
      'header' : {
        templateUrl : 'app/template/header/back.html',
        controller: headerBackCtrl('出题')
      },
      'main': {
        templateUrl : 'app/teacher/qa/add/add.html',
        controller: 'teacherQaAddCtrl'
      }
    }
  };
  var teacherQaRoute = {
    url: '/qa',
    views: {
      'header': {
        templateUrl: 'app/teacher/teacher.header.html',
        controller: 'teacherHeaderCtrl'
      },
      'main': {
        templateUrl: 'app/teacher/qa/qa.html',
        controller: 'teacher.qa.ctrl'
      }
    }
  };
  var teacherClassRoute = {
    url: '/class',
    views: {
      'header': {
          templateUrl: 'app/template/header/back.click.html',
          controller: headerBackClickCtrl('管理班级', 'teacher.qa')
      },
      'main': {
        templateUrl: 'app/teacher/class/class.html',
        controller: 'teacherClassesCtrl'
      }
    }
  };
  var teacherDocRoute = {
    url: '/doc',
    views: {
      'header': {
        templateUrl: 'app/teacher/teacher.header.html',
        controller: 'teacherHeaderCtrl'
      },
      'main': {
        templateUrl: 'app/template/main/list.html',
        controller: 'teacherDocCtrl'
      }
    }
  };
  var teacherNameListRoute = {
    url: '/nameList',
    views: {
      'header': {
        templateUrl: 'app/teacher/teacher.header.html',
        controller: 'teacherHeaderCtrl'
      },
      'main': {
        templateUrl: 'app/teacher/nameList/nameList.html',
        controller: 'nameListCtrl'
      }
    }
  };
  var teacherRoute = {
    url: '/teacher',
    templateUrl: 'app/teacher/teacher.html',
    controller: 'teacherCtrl'

  };
  var teacherExamRoute = {
    url: '/exam',
    views: {
      'header': {
          templateUrl: 'app/teacher/teacher.header.html',
          controller: 'teacherHeaderCtrl'
        //templateUrl: 'app/template/header/back.click.html',
        //controller: headerBackClickCtrl('添加题目', 'teacher.qa')
      },
      'main': {
        templateUrl: 'app/teacher/exam/exam.html',
        controller: 'teacherExamCtrl'
      }
    }
  };
  var teacherPersonRoute = {
    url: '/person',
    views: {
      'header': {
          templateUrl: 'app/teacher/teacher.header.html',
          controller: function ($scope) {

              $scope.courses=[{name:'请先点击左侧选择功能'}];
          }
      },
      'main': {
        templateUrl: 'app/teacher/person/person.html',
        controller: 'personCtrl as vm'
      }
    }
  };
  var teacherQaReportRoute = {
    url: '/qa/report',
    views: {
      'header': {
        templateUrl: 'app/layout/header/vm.header.html',
        controller: 'qaReportHeaderCtrl as header'
      },
      'main': {
        templateUrl: 'app/teacher/qa/qaReport/qaReport.html',
        controller: 'qaReportMainCtrl'
      }
    }
  };
  var docAddRoute = {
    url: '/doc/add',
    views: {
      'header': {
        templateUrl: 'app/template/header/back.html',
        controller: headerBackCtrl('上传课件')
      },
      'main': {
        templateUrl: 'app/template/main/fileUpload.html',
        controller: 'docAddCtrl'
      }
    }
  };

  function headerBackCtrl(title) {
    return function ($scope) {
      $scope.title = title;
    }
  }

  function headerBackClickCtrl(title, back) {
    return function ($scope, $state) {
      $scope.title = title;
      $scope.click = function () {
        $state.go(back);
      }
    }
  }
})();