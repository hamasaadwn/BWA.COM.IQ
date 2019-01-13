$(document).ready(() => {
  $.getJSON("/admin/getMakes", data => {
    $.each(data, (i, makes) => {
      $("ul#makes").append(
        '<li class="list-group-item">' + makes.makeName + "</li>"
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
});
