$(document).ready(function () {
  $("#hideP").click(function () {
    $("#p1, #p2, #p3").hide();
  });

  $("#showP").click(function () {
    $("#p1, #p2, #p3").show();
  });

  $("#toggleP").click(function () {
    $("#p1, #p2, #p3").toggle();
  });

  $("#op01").click(function () {
    $("#formBox").css("opacity", "0.1");
  });

  $("#op05").click(function () {
    $("#formBox").css("opacity", "0.5");
  });

  $("#op08").click(function () {
    $("#formBox").css("opacity", "0.8");
  });

  $("#hideForm").click(function () {
    $("#formBox").hide();
  });

  $("#showForm").click(function () {
    $("#formBox").show();
  });

  $("#toggleForm").click(function () {
    $("#formBox").toggle();
  });
});
