$(document).ready(function() {
  $(function() {
    // Multiple images preview in browser
    var imagesPreview = function(input, placeToInsertImagePreview) {
      if (input.files) {
        var filesAmount = input.files.length;

        for (i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = function(event) {
            $($.parseHTML("<img>"))
              .attr("src", event.target.result)
              .appendTo(placeToInsertImagePreview);
          };

          reader.readAsDataURL(input.files[i]);
        }
      }
    };

    $("#gallery-photo-add").on("change", function() {
      imagesPreview(this, "#gallery");
    });
  });

  $.getJSON("/admin/getMakes", data => {
    $.each(data, (i, makes) => {
      $("select#makes").append(
        "<option value=" + makes._id + ">" + makes.makeName + "</li>"
      );
    });
  });

  $("select#makes").change(() => {
    $("select#models").html("");
    var modId = $("select#makes").val();
    $.post("/admin/getModels", { modId }).done(data => {
      $.each(data, (i, models) => {
        $("select#models").append(
          "<option value=" +
            models.modName +
            " >" +
            models.modName +
            "</option>"
        );
      });
    });
  });

  $(() => {
    var year = new Date().getFullYear();
    for (i = year; i >= 1975; i--) {
      $("select#year").append("<option value=" + i + " >" + i + "</option>");
    }
  });
});
