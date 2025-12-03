$(document).ready(function() {
    $("#btnCalc").click(function() {
        var a = parseInt($("#numA").val());
        var b = parseInt($("#numB").val());
        var op = $("input[name='op']:checked").val();
        var res = 0;

        if (isNaN(a) || isNaN(b)) {
            alert("Kérem adjon meg érvényes egész számokat!");
            return;
        }
        if (!op) {
            alert("Válasszon műveletet!");
            return;
        }

   
        switch (op) {
            case 'add': res = a + b; break;
            case 'sub': res = a - b; break;
            case 'mul': res = a * b; break;
            case 'div': 
                if(b === 0) { alert("Nullával nem oszthatunk!"); return; }
                res = a / b; 
                break;
        }

        $("#eredmeny").text(res);
    });
});