/**
 * Created by YY on 2016/9/3.
 */
/**
 * Created by YY on 2016/9/2.
 */
angular.module('teacher.qa.qaAddDetail', ['ui.router', 'teacher.quiz'])
  //配置路由
  .config(function ($stateProvider) {
    $stateProvider.state('teacher.qaAddDetail', {
      url: '/qa/addQa/qaAddDetail',
      views: {
        'header': {
          templateUrl: 'app/layout/header/header2.html',
          controller: 'qaAddDetailHeaderCtrl'
        },
        'main': {
          templateUrl: 'app/teacher/qa/qaAddDetail/qaAddDetail.html',
          controller: 'qaAddDetailMainCtrl'
        }
        // ,
        // 'footer': {
        //   templateUrl: 'app/layout/footer/footer.html',
        //   controller: 'qaAddDetailFooterCtrl'
        // }
      }
    })
  })
  //工厂
  .factory('qaAddDetailFactory', function ($http, Account, TeacherConstants, TeacherQuestionLibraryConstants, $log) {
    $log.log('factory init');
    var self = {};
    var questionLibrary;
    self.flushQuestionLibrary = function (libraryID, callback) {
      $http.get(TeacherQuestionLibraryConstants.URL_LIBRARIES + '/' + libraryID, {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibrary = res.data;
        callback(null, questionLibrary);
      }, function (res) {
        callback(res);
      });
    };
    self.getQuestionLibrary = function (libraryID, callback) {
      if (questionLibrary) {
        return callback(null, questionLibrary);
      }
      self.flushQuestionLibrary(libraryID, callback);
    };
    var questionLibraryQuestions;
    self.flushQuestionLibraryQuestion = function (libraryID, callback) {
      $http.get(TeacherQuestionLibraryConstants.URL_LIBRARIES + '/' + libraryID + '/questions', {
        headers: {'x-token': Account.getToken()}
      }).then(function (res) {
        questionLibraryQuestions = res.data;
        callback(null, questionLibraryQuestions);
      }, function (res) {
        callback(res);
      });
    };

    self.getQuestionLibraryQuestion = function (libraryID, callback) {
      if (questionLibraryQuestions) {
        return callback(null, questionLibraryQuestions);
      }
      self.flushQuestionLibraryQuestion(libraryID, callback);
    };
    return self;
  })
  //头控制器
  .controller('qaAddDetailHeaderCtrl', function ($scope) {
    $scope.title = '第一章';
  })
  //主控制器
  .controller('qaAddDetailMainCtrl', function ($scope,
                                               $mdDialog,
                                               teacherFactory,//获取课程ID
                                               TeacherCourse,//获取课程对应题库
                                               qaAddDetailFactory, //获取题库
                                               teacherQuizFactory, //提交问题
                                               $log) {
      $log.info("init ctrl at addQaDetails");
      $scope.newQuizTitle = '';
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
          var questionLibrary;

          TeacherCourse.getCorrespondingLibrary(teacherFactory.getCurrentCourse()._id, function (error, res) {
              if (error) {
                  alert("somethinh errororrrrrrrrrrrrrrrrr");
                  return;
              }
              questionLibrary = res;
              console.log(teacherFactory.getCurrentCourse()._id, '对应题库ID', id1);
              qaAddDetailFactory.getQuestionLibraryQuestion(questionLibrary._id, function (err, questions) {
                  if (err) {
                      return alert('some error: ' + err);
                  }
                  //console.log(questions);
                  $scope.questions = questions;
              });
          });

          var sss;
          $scope.selected = [];
          $scope.questionSelected = function (item, list) {
              var idx = list.indexOf(item);
              if (idx > -1) {
                  list.splice(idx, 1);
              } else {
                  list.push(item);
              }
              sss = list;
          };
          $scope.submit = function (title) {
              $log.log('init submit');
              $log.log(title);
              $log.log('sss' + sss);
              teacherQuizFactory.createNewQuiz(courseId, {'name': title, 'questions': sss}, function (error, data) {
                  $log.log(error);
                  $log.log(data);

              });
          };
      };
  });
  //尾控制器
  // .controller('qaAddDetailFooterCtrl', function ($scope) {
  //   $scope.title = '已经选题';
  //   $scope.sref = 'teacher.qaList';
  // });
