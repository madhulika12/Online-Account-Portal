/****************************************************

<response-modal message="", url="">
</response-modal>

****************************************************/


angular.module('ssoApp')

.directive('responseModal', ['$compile', '$state', function ($compile, $state) {

  var temp = "<div class='modal fade' id='responseModal'> \
    <div class='modal-dialog'> \
      <div class='modal-content'> \
        <div class='modal-header'> \
          <button type='button' class='close' data-dismiss='modal'> \
            <span>&times;</span> \
          </button> \
          <h4 class='modal-title'>{{title || 'Message:'}}</h4> \
        </div> \
        <div class='modal-body' ng-bind-html='message || nullMessage'></div> \
        <div ng-if='url'> \
          <div class='modal-footer'><button type='button' ng-click='redirect()' class='btn submitButton'>Continue</button></div> \
        </div> \
        <div ng-if='!url'> \
          <div class='modal-footer'><button type='button' class='btn submitButton' data-dismiss='modal'>Close</button></div> \
        </div> \
      </div> \
    </div> \
  </div>"

  var linkFxn = function (scope, element, attrs) {
    // console.log('linkFxn')

    // var redirectUrl = function () {
    //   if ( scope.url.match(/\.com/) ) {
    //     $window.href = url;
    //   } else {
    //     $state.go(scope.url);
    //   }
    // }

    scope.nullMessage = "There was an unexpected error with your request.";

    scope.redirectModal = function () {
      $('#responseModal').on('hidden.bs.modal', function (e) {
        $('#responseModal').remove();
        $state.go('login')
      })
      $('#responseModal').modal('hide')
      // console.log(redirectUrl)

    }

  }

  return {
    restrict: 'E',
    scope: {
      title : '=',
      message : '='
    },
    template: temp,
    link: linkFxn
  }


}]);
