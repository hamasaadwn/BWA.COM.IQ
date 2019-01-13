$(document).ready(function() {
  $(".prom").on("click", function(e) {
    e.preventDefault();
    var link = $(this).attr("href");
    var id = link.split("/")[4];
    $.ajax({
      type: "POST",
      url: link
    }).done(data => {
      window.location.href = "/car/forsale/" + id;
    });
  });
});
