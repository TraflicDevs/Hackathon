$(function() {
  var map = map();

  $("#position").on("submit", function(e) {
    jsRoutes.controllers.MainController.position()
                                        .ajax({
                                          data:$("#position").serialize(),
                                          success: function(data) {println(data)}
                                        });
    e.preventDefault();
    e.stopImmediatePropagation();
  })

});