$(document).ready(function() {
  $(".chngst").on("click", function(e) {
    e.preventDefault();
    var link = $(this).attr("href");
    var id = link.split("/")[2];
    $.ajax({
      type: "POST",
      url: "/admin/changestate" + link,
      success: function(response) {
        window.location.href = "/admin/Dealers";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
