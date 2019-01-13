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
          '<li class="list-group-item">' + models.modName + "</li>"
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
