$(document).ready(() => {
  $.getJSON("/admin/getMakes", data => {
    $.each(data, (i, makes) => {
      $("select#makes").append(
        '<option class="list-group-item" value=' +
          makes._id +
          ">" +
          makes.makeName +
          "</li>"
      );
    });
  });

  $("select#makes").change(() => {
    $("ul#models").html("");
    var modId = $("select#makes").val();
    $.post("/admin/getModels", { modId }).done(data => {
      $.each(data, (i, models) => {
        $("ul#models").append(
          $(
            '<li class="list-group-item" id=' +
              models._id +
              ">" +
              models.modName +
              "</li>"
          ).append(
            $(' <a href="#"' + '><i class="fa fa-trash" ></i></a>').on(
              "click",
              function(e) {
                e.preventDefault();
                var answer = confirm(
                  "Deleting a used model can cause error \nAre you sure you want to delete this?"
                );
                var id = models._id;
                if (answer) {
                  $.ajax({
                    type: "DELETE",
                    url: "/admin/deletemodel/" + id,
                    success: function(response) {
                      $("#" + id).hide("slow");
                    },
                    error: function(err) {
                      console.log(err);
                    }
                  });
                }
              }
            )
          )
        );
      });
    });
  });

  $("#postModel").submit(function(e) {
    e.preventDefault();
    var modId = $("select#makes").val();
    var m = $("input#modelName").val();
    var modName = m.charAt(0).toUpperCase() + m.slice(1);
    var url = $(this).attr("action");
    $.post(url, { modName, modId }).done(d => {
      $("ul#models li:eq(0)").before(
        '<li class="list-group-item">' +
          d.modName +
          '<span style="color:green;"> New </span>' +
          "</li>"
      );
      $("input#modelName").val("");
    });
  });
});
