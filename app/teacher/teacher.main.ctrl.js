/**
 * Created by YY on 2016/11/12.
 */
(function () {
    angular.module('teacher').controller('teacherCtrl', teacherCtrl);
    function teacherCtrl($state, $scope, $mdSidenav, $location, Account, $log) {
        var selectedItem;
        if (!Account.checkCredit(2)) {
            return $location.path('/login');
        }
        Account.getProfile(function (err, profile) {
            if (err) {
                return $log.error(err);
            }
            $scope.name = profile.name;
        });
        $scope.items = [
            {
                sref: 'teacher.nameList',
                content: '名单',
                icon: 'people'
            },
            {
                sref: 'teacher.qa',
                content: '问答',
                icon: 'help'
            }, {
                sref: 'teacher.class',
                content: '班级',
                icon: 'class'
            }, {
                sref: 'teacher.exam',
                content: '题库',
                icon: 'folder'
            }
            // , {
            //     sref: 'teacher.doc',
            //     content: '课件',
            //     icon: 'description'
            // }
            , {
                sref: 'teacher.person',
                content: '个人',
                icon: 'person'
            }
        ];
        $scope.toggleList = function () {
            $mdSidenav('left').toggle();
        };
        //$state.go('teacher.qa');

        //    尝试用冒泡的方式刷新课程菜单列表
        // $scope.$on("Ctr1NameChange",
        //
        //     function (event, msg) {
        //         console.log("parent", msg);
        //         $scope.$broadcast("Ctr1NameChangeFromParrent", msg);
        //     });
        // $scope.$on("Ctr1RemoveChange",
        //
        //     function (event, msg) {
        //         console.log("parent", msg);
        //         $scope.$broadcast("Ctr1NameRemoveFromParrent", msg);
        //     });//success
        // $scope.$on("Ctr1NameAdd",
        //
        //     function (event, msg) {
        //         console.log("parent", msg);
        //         $scope.$broadcast("Ctr1NameAddFromParrent", msg);
        //     });//fail
        //  // $state.go('teacher.person');
    }



})();
