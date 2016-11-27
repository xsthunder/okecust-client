/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.questionLibrary.detail')
    .controller('teacherQuestionLibraryDetailCtrl', ctrl);
  function ctrl($scope, TeacherQuestionLibrary, TeacherQuestionLibraryDetail) {
    var library = TeacherQuestionLibrary.getActiveQuestionLibrary();
    console.log(library);
    TeacherQuestionLibraryDetail.getQuestionLibraryQuestion(library._id, function (err, questions) {
      if(err){return alert('some error: '+err);}
      console.log(questions);
    })
  }
})();