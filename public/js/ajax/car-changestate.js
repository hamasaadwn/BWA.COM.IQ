$(document).ready(function() {
  $(".chng").on("click", function(e) {
    e.preventDefault();
    var link = $(this).attr("href");
    var id = link.split("/")[2];
    $.ajax({
      type: "POST",
      url: "/profile/changestate" + link,
      dataType: "json"
    }).done(data => {
      if (data.status === "true") {
        if (link.split("/")[1] == "inactive")
          $("#id" + id).addClass("deactive_vehicle");
        else $("#id" + id).removeClass("deactive_vehicle");
      }
    });
  });

  $(".chngp").on("click", function(e) {
    e.preventDefault();
    var link = $(this).attr("href");
    var id = link.split("/")[2];
    $.ajax({
      type: "POST",
      url: "/parts/changestate" + link,
      dataType: "json"
    }).done(data => {
      if (data.status === "true") {
        if (link.split("/")[1] == "inactive")
          $("#id" + id).addClass("deactive_vehicle");
        else $("#id" + id).removeClass("deactive_vehicle");
      }
    });
  });
});
