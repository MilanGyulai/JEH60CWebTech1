$(document).ready(function () {
  $("h1").mouseover(function () {
    alert("Egér a fejléc fölött!");
  });

  $("#p1 a").click(function (e) {
    e.preventDefault();
    $("#p1").hide();
  });

  $("#p2 a").dblclick(function (e) {
    e.preventDefault();
    $("#p2").hide();
  });

  $("#btn").mouseover(function () {
    alert("A gomb fölé vitted az egeret!");
  });

  $("input").mousemove(function (event) {
    if (event.originalEvent.movementY < 0) {
      $(this).css("border", "2px solid blue");
    } else {
      $(this).css("border", "2px solid red");
    }
  });

  $("input").click(function () {
    $(this).css("background-color", "#ffe680");
  });
});
