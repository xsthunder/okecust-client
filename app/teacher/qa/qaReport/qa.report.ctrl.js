/**
 * Created by YY on 2016/11/12.
 */
(function () {
    angular.module('teacher.qa.report')
        .controller('qaReportHeaderCtrl', headerCtrl)
        .controller('qaReportMainCtrl', mainCtrl)
    function headerCtrl() {
        var header = this;
        header.title = '测试报告';
    }

    function mainCtrl($scope,$state, Account, teacherQuizFactory, $log, teacherQaFactory) {
        var showAlert = Account.showToast;
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];



        $log.log(teacherQuizFactory.nowQuiz);
        try {
            var quizId = teacherQuizFactory.nowQuiz._id;
        }
        catch (err) {
            showAlert('', '生成数据失败，重试并耐心等候');
            $state.go('teacher.qa');
            return;
        }
        teacherQaFactory.getQuizReport(quizId, function (error, res) {

            if (error) {
                showAlert('', '获取数据失败');

            }
            $log.log(res.reports);
            $scope.reports = res.reports;
            $scope.status = false;
            $scope.charts = getCharts(res.reports, function () {
                $scope.status = 'finished';
            })

        });
        function getCharts(reports, callback) {
            var charts = [];
            $log.log(reports);
            var detail=[];
            var each={};
            for (var i = 0; i < reports.length; i++) {
                var report = reports[i];
                var chart = {};
                chart.type = "PieChart";
                chart.data = {
                    "cols": [
                        {id: '1', label: '题号', type: 'string'},
                        {id: '2', label: '回答人数', type: 'number'}]
                };
                chart.data.rows = [];

                for (var j = 0; j < report.length; j++) {
                    chart.data.rows.push(
                        {c: [{v: String.fromCharCode('A'.charCodeAt(0) + j)}, {v: report[j]}]}
                    )
                }

                chart.options = {
                    'title': ('第' + (i + 1) + '题报告')
                };
                each['titile']=('第' + (i + 1) + '题报告');
                charts.push(chart);
                each['detail']=report[j];
                detail.push(each);
            }
            callback();
            return charts;
        }

        //数据图
        $scope.myChartObject = {};
        $scope.myChartObject.type = "PieChart";
        $scope.onions = [
            {v: "Onions"},
            {v: 3},
        ];
        $scope.myChartObject.data = {
            "cols": [
                {id: "t", label: "Topping", type: "string"},
                {id: "s", label: "Slices", type: "number"}
            ], "rows": [
                {
                    c: [
                        {v: "Mushrooms"},
                        {v: 3},
                    ]
                },
                {c: $scope.onions},
                {
                    c: [
                        {v: "Olives"},
                        {v: 31}
                    ]
                },
                {
                    c: [
                        {v: "Zucchini"},
                        {v: 1},
                    ]
                },
                {
                    c: [
                        {v: "Pepperoni"},
                        {v: 2},
                    ]
                }
            ]
        };
    }
})();