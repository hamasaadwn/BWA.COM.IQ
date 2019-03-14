$(document).ready(() => {
  $.getJSON("/admin/getMakes", data => {
    $.each(data, (i, makes) => {
      $("ul#makes").append(
        '<li class="list-group-item" id=' +
          makes._id +
          ">" +
          makes.makeName +
          ' <a href="#" id="deleteMake" data-id=' +
          makes._id +
          '><i class="fa fa-trash" ></i></a>' +
          "</li>"
      );
    });
  });

  $("#postMakes").submit(function(e) {
    e.preventDefault();
    var m = $("#makeName").val();
    var makeName = m.charAt(0).toUpperCase() + m.slice(1);
    var url = $(this).attr("action");
    $.post(url, { makeName }).done(data => {
      $("ul#makes li:eq(0)").before(
        '<li class="list-group-item">' +
          data.makeName +
          '<span style="color:green;"> New </span>' +
          "</li>"
      );
      $("#makeName").val("");
    });
  });

  $("ul#makes").on("click", "#deleteMake", function(e) {
    // You don't actually want the browser scrolling to #
    e.preventDefault();
    var answer = confirm(
      "Deleting a used make can cause error \nAre you sure you want to delete this?"
    );

    var id = $(this).attr("data-id");
    if (answer) {
      $.ajax({
        type: "DELETE",
        url: "/admin/deletemake/" + id,
        success: function(response) {
          $("#" + id).hide("slow");
          //window.location.href = "/admin/deletemake";
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
  });
});
