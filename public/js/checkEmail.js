$(document).ready(function() {
  $("#err").css("display", "none");
  $("#get-email").on("input", function(str) {
    var email = $("#get-email").val();
    $.ajax({
      type: "POST",
      url: "/auth/register/checkemail",
      dataType: "json",
      data: { email: email }
    }).done(data => {
      if (data.status === "false") {
        $("#get-email").addClass("is-invalid");
        $("#err").css("display", "inline-block");
        $("#sub").prop("disabled", true);
      } else if (data.status === "true") {
        // $("#get-email").removeClass("text-danger");
        $("#err").css("display", "none");
        $("#sub").prop("disabled", false);
      }
    });
  });
});
