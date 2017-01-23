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

  function mainCtrl($scope,Account, teacherQuizFactory, $log, teacherQaFactory) {
    $log.log(teacherQuizFactory.nowQuiz);
    try {
        var quizId = teacherQuizFactory.nowQuiz._id;
    }
    catch (err){
        Account.showAlert('生成数据失败，请返回重来并耐心等候');
      return;
    }
    teacherQaFactory.getQuizReport(quizId, function (error, res) {
      if (!error) {
        $log.log(res.reports);
        $scope.reports = res.reports;
        $scope.charts = getCharts(res.reports)
      }
    });
    function getCharts(reports) {
      var charts = [];
      $log.log(reports);
      for (var i = 0; i < reports.length; i++) {
        var report = reports[i];
        var chart = {};
        chart.type = "PieChart";
        chart.data = {
          "cols": [
            {id: '1', label: '题号', type: 'string'},
            {id: '2', label: '回答人数', type: 'number'}]
          // "rows": [
          //   {c: [{v: 'A'}, {v: report[0]}]},
          //   {c: [{v: 'B'}, {v: report[1]}]},
          //   {c: [{v: 'C'}, {v: report[2]}]},
          //   {c: [{v: 'D'}, {v: report[3]}]},
          // ]
        };
          chart.data.rows=[];
        for(var j =0 ;j<report.length;j++){
            chart.data.rows.push(
              {c: [{v: String.fromCharCode('A'.charCodeAt(0)+j)}, {v: report[j]}]}
          )
        }
        chart.options = {
          'title': ('第'+(i+1)+'题报告')
        };
        charts.push(chart);
      }
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