/**
 * Created by YY on 2016/11/27.
 */
(function () {
  angular.module('teacher.questionLibrary.detail')
    .controller('teacherQuestionLibraryDetailCtrl', ctrl);
  function ctrl($scope, $mdDialog,TeacherQuestionLibrary, TeacherQuestionLibraryDetail) {
      var showAlert = function(title,message) {
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application
          // to prevent interaction outside of dialog
          $mdDialog.show(
              $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#popupContainer')))
                  .clickOutsideToClose(true)
                  .title(title)
                  .textContent(message)
                  .ariaLabel('Alert Dialog Demo')
                  .ok('明白')
          );
      };


    var library = TeacherQuestionLibrary.getActiveQuestionLibrary();
    console.log(library);
    TeacherQuestionLibraryDetail.getQuestionLibraryQuestion(library._id, function (err, questions) {
      if(err){return showAlert('错误','无法获得TeacherQuestionLibraryDetail.getQuestionLibraryQuestion'+err);}
      console.log(questions);
    })
  }
})();