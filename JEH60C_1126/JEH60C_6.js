$(document).ready(function () {
  $("#calc").click(function () {
    let a = $("#a").val();
    let b = $("#b").val();
    let op = $("input[name='op']:checked").val();

    if (a === "" || b === "") {
      $("#res").text("Hiba: mindkét számot meg kell adni!");
      return;
    }

    if (!Number.isInteger(Number(a)) || !Number.isInteger(Number(b))) {
      $("#res").text("Hiba: csak egész számot adjon meg!");
      return;
    }

    a = Number(a);
    b = Number(b);

    if (!op) {
      $("#res").text("Hiba: nincs kiválasztva művelet!");
      return;
    }

    if (op === "div" && b === 0) {
      $("#res").text("Hiba: nullával nem lehet osztani!");
      return;
    }

    let result;

    switch (op) {
      case "mul":
        result = a * b;
        break;
      case "div":
        result = a / b;
        break;
      case "add":
        result = a + b;
        break;
      case "sub":
        result = a - b;
        break;
    }

    $("#res").text(result);
  });
});
