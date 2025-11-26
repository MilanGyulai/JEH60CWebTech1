$(function () {
  $("#startAnim").click(function () {
    let sebesseg = 800;

    $("#doboz").css({ opacity: 1, fontSize: "12pt" });

    $("#doboz")
      .animate({ left: "600px", width: "450px", fontSize: "30pt" }, sebesseg)

      .animate({ top: "150px", width: "300px", height: "150px" }, sebesseg)

      .animate({ left: "300px", opacity: 0.4 }, sebesseg)

      .animate(
        { top: "0", opacity: 1, fontSize: "12pt" },
        sebesseg,
        function () {
          alert("VÉGE");
        }
      );
  });

  $("#hideP").click(function () {
    $("p").slideUp(600, function () {
      alert("Bekezdések elrejtése.");
    });
  });

  $("#toggleBox").click(function () {
    $("#doboz").slideToggle(600);
  });
});
