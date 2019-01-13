$(document).ready(function() {
  $(".changerole").on("click", function(e) {
    const id = $(this).attr("data-id");
    const role = $("#id" + id).val();
    $.ajax({
      type: "POST",
      url: "/admin/changerole/" + role + "/" + id,
      success: function(response) {},
      error: function(err) {
        console.log(err);
      }
    });
  });
});
// function changeFunc() {
//   var selectBox = document.getElementById("roles");
//   var selectedValue = selectBox.options[selectBox.selectedIndex].value;
//   var id = selectBox.options[selectBox.selectedIndex].getAttribute("data-id");
//   alert(selectedValue + "\n" + id);
// }
