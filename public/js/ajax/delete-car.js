$(document).ready(function() {
  $(".delete-car").on("click", function(e) {
    const id = $(this).attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/car/delete/" + id,
      success: function(response) {
        window.location.href = "/profile/myvehicles";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $(".delete-car-part").on("click", function(e) {
    const id = $(this).attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/parts/delete/" + id,
      success: function(response) {
        window.location.href = "/parts/myvehicleparts";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
