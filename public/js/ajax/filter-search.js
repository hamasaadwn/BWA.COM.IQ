$(document).ready(function() {
  var p = $("#price_range").slider({});
  $("#price_range").on("change", function() {
    var pVal = p.slider("getValue");
    minPrice = pVal[0];
    maxPrice = pVal[1];
    $("#minprice").val(minPrice);
    $("#maxprice").val(maxPrice);
  });

  // $("#filtSearch").submit(function(e) {
  // e.preventDefault();
  // var pVal = p.slider("getValue");
  // var data = {};
  // data.minPrice = pVal[0];
  // data.maxPrice = pVal[1];
  // data.make = $("#makes").val();
  // data.location = $("#location").val();
  // data.model = $("#models").val();
  // data.year = $("#year").val();
  // data.searchType = $("#searchType").val();
  // data.page = 1;

  // var url = $(this).attr("action");

  //$.get(url, data).done();
  // });
});
