$(function () {
  $("#k1").click(function () {
    $("#lista1 li:lt(2)").hide();
    $("#lista1 a").removeAttr("href");
  });

  $("#k2").click(function () {
    $("#lista2 li:lt(2)").hide();
    $("#lista2 a").removeAttr("href");
    $("#k2").hide();
  });

  $("#k3").click(function () {
    $("h2").first().hide();
    $("#lista1 li:lt(2)").hide();
    $("#lista1 a").removeAttr("href");
  });

  $("#k4").click(function () {
    $("#lista2 li:lt(2)").hide();
    $("#lista2 a").text("").removeAttr("href");
  });

  $("#k5").click(function () {
    $("#lista1 li:lt(2)").hide();
    $("#lista1 a").removeAttr("href");

    $("#tabla tr:even").hide();
  });
});
