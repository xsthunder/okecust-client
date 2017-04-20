/**
 * Created by YY on 2016/11/12.
 */
(function () {
    angular.module('teacher.qa.report')
        .controller('qaReportHeaderCtrl', headerCtrl)
        .controller('qaReportMainCtrl', mainCtrl);
    function headerCtrl() {
        var header = this;
        header.title = '测试报告';
    }

    function mainCtrl($scope, $state, Account, teacherQuizFactory, $log, teacherQaFactory) {
        var showAlert = Account.showToast;

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
            getCanvasCharts(res.reports);
            $log.log(res.reports);
            $scope.reports = res.reports;
            $scope.status = false;
            $scope.charts = getCharts(res.reports, function (detail) {
                $scope.status = 'finished';
                console.log('detail', detail);
                $scope.saying = detail;
            })

        });

        function getCanvasCharts(reports,callback) {
            var datas=[];
            console.log('getCC',reports);
            for(var i=0;i<reports.length;i++){
                var scores = [];
                var labels = [];
                var report=reports[i];
                for(var j =0 ;j< report.length;j++){
                    if (typeof (report[j]) === 'number'){
                        scores.push(report[j]);
                        labels.push(String.fromCharCode('A'.charCodeAt(0) + j));
                    }
                    else {
                        scores.push(report[j].frequency);
                        labels.push(report[j].name);
                    }
                }
                datas.push({
                    scores:scores,
                    labels:labels,
                    options : {
                        title : {
                            display: true,
                            text: ('第' + (i + 1) + '题报告')
                        },
                        legend: {
                            display: true
                        }
                    }
                });

            }
            console.log('datas',datas);
            $scope.datas=datas;
            $scope.options = {
                title : {
                    display: true,
                    text: '成绩分析'
                },
                legend: {
                    display: true
                }
            };
        }


        function getCharts(reports, callback) {
            var charts = [];
            $log.log(reports);
            var detail = [];
            if(reports.length==0)return teacherQaFactory.showToast('','本问题没有添加任何问题');
            for (var i = 0; i < reports.length; i++) {
                var report = reports[i];
                var each ={};
                var chart = {};
                chart.type = "PieChart";
                chart.data = {
                    "cols": [
                        {id: '1', label: '题号', type: 'string'},
                        {id: '2', label: '回答人数', type: 'number'}]
                };
                chart.data.rows = [];


                for (var j = 0; j < report.length; j++) {
                    if (typeof (report[j]) === 'number') chart.data.rows.push(
                        {c: [{v: String.fromCharCode('A'.charCodeAt(0) + j)}, {v: report[j]}]}
                    );
                    else {
                        chart.data.rows.push(
                            {c: [{v: report[j].name}, {v: report[j].frequency}]}
                        );
                    }
                }

                chart.options = {
                    'title': ('第' + (i + 1) + '题报告')
                };
                charts.push(chart);
                each['title'] = chart.options['title'];
                each['detail'] =chart.data.rows ;
                console.log('each titile',each['title']);
                console.log(each)
                detail.push(each);
            }
            callback(detail);
            return charts;
        }

        //数据图
        // $scope.myChartObject = {};
        // $scope.myChartObject.type = "PieChart";
        // $scope.onions = [
        //     {v: "Onions"},
        //     {v: 3},
        // ];
        // $scope.myChartObject.data = {
        //     "cols": [
        //         {id: "t", label: "Topping", type: "string"},
        //         {id: "s", label: "Slices", type: "number"}
        //     ], "rows": [
        //         {
        //             c: [
        //                 {v: "Mushrooms"},
        //                 {v: 3},
        //             ]
        //         },
        //         {c: $scope.onions},
        //         {
        //             c: [
        //                 {v: "Olives"},
        //                 {v: 31}
        //             ]
        //         },
        //         {
        //             c: [
        //                 {v: "Zucchini"},
        //                 {v: 1},
        //             ]
        //         },
        //         {
        //             c: [
        //                 {v: "Pepperoni"},
        //                 {v: 2},
        //             ]
        //         }
        //     ]
        // };
    }
})();