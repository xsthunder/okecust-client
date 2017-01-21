(function () {
    angular.module('teacher.exam.multiply')
        .factory('multiplyFactory', factory);
    function factory($http, TeacherConstants, Account) {
        var self = {};
        /**
         * Create a question.
         * Question are not deletable or editable.
         *
         * @param question Question Object.
         * @param callback Callback.
         {
            "type": 1,    // @see README.md
            "name": "在微型计算机中，微处理器芯片上集成的是",
            "extras": ["控制器和运算器", "控制器和存储器", "CPU和控制器", "运算器和I/O接口"],
            "answers": [false, false, true, false]
        }

         Response: Question Object
         {
             "__v": 0,
             "lTime": "2016-11-15T10:13:52.974Z",
             "cTime": "2016-11-15T10:13:52.974Z",
             "_id": "582adfe037b9e4d0033336d1",
             "author": "250",
             "type": 1,
             "answers": [
                 false,
                 false,
                 true,
                 false
             ],
             "extras": [
                 "控制器和运算器",
                 "控制器和存储器",
                 "CPU和控制器",
                 "运算器和I/O接口"
             ],
             "name": "在微型计算机中，微处理器芯片上集成的是"
         }
         */
        self.createAQuestion = function (question, callback) {
            $http.post(TeacherConstants.URL_QUESTIONS, {
                type: question.type,
                name: question.name,
                extras: question.extras,
                answers: question.answers
            }, {
                headers: {'x-token': Account.getToken()}
            }).then(function (res) {
                callback(null, res.data);
            }, function (res) {
                callback(res);
            });
        };
        return self;
    }
})();