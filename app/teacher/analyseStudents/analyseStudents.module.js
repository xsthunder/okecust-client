/**
 * Created by xs on 3/13/2017.
 */
(function () {
    angular.module('teacher.analyseStudents', [
            'ui.router',
            'account'
        ]
    )
        .factory('teacherAnalyseStudentsFactory', function (Account, $http, TeacherConstants, TeacherCourseConstants) {
            self = {};
            self.getStudentsScoresByCourseID = function (courseID, callback) {
                TeacherCourseConstants.updateCourseId(courseID);
                $http.get(TeacherConstants.URL_COURSE_STUDENTS_SCORES + '/' + courseID + '/' + 'students/scores', {
                    headers: {'x-token': Account.getToken()}
                }).then(function (res) {
                    callback(null, res.data);
                }, function (res) {
                    callback(res);
                });
            };
            return self;
        })
        .controller('teacherAnalyseStudentsCtrl', function (TeacherHeaderFactory,Account, $scope, teacherAnalyseStudentsFactory, teacherFactory) {
            console.log('hello analyse');
                var freshData = function () {
                $scope.scores = teacherAnalyseStudentsFactory.getStudentsScoresByCourseID(teacherFactory.getCurrentCourse()._id, function (err, res) {
                    if (err) {
                        Account.showToast('', '获取学生成绩失败');
                    }
                    else {
                        if(res.length==0)return  Account.showToast('', '本课程还没有添加任何学生');
                        console.log('in scores', res);
                        $scope.scores = res;
                    }
                })
            };
            TeacherHeaderFactory.setOnSelectedListener(freshData);

            freshData();
            $scope.sortBy = function(propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
            };

            $scope.propertyName = 'average';
            $scope.reverse = true;

        });
})();