$(document).ready(function() {
    $("#btnLoad").click(function() {
        $.getJSON("JEH60C_orarend.json", function(data) {
            var output = "";

            output += '<div class="header-info">';
            output += '<div><h3>MISKOLCI EGYETEM</h3>';
            output += 'Cím: ' + data.cim.iranyitoszam + ' ' + data.cim.varos + ' ' + data.cim.utca + '</div>';
            
            output += '<div><h3>Telefonszám:</h3>';
            $.each(data.telefonszam, function(key, val) {
                output += val.tipus + ': ' + val.szam + '<br>';
            });
            output += '</div></div>';

            output += '<div style="width:100%"><h3>' + data.kurzus[0].szak + ' Órarend 2025 ősz</h3></div>';
            
            $.each(data.kurzus, function(key, val) {
                output += '<div class="course-card">';
                output += '<b>Tárgy:</b> ' + val.targy + '<br>';
                output += '<b>Időpont:</b> Nap: ' + val.idopont.nap + ', Tól: ' + val.idopont.tol + ', Ig: ' + val.idopont.ig + '<br>';
                output += '<b>Helyszín:</b> ' + val.helyszin + '<br>';
                output += '<b>Oktató:</b> ' + val.oktato + '<br>';
                output += '<b>Szak:</b> ' + val.szak + '<br>';
                output += '<b>Típus:</b> ' + val.tipus;
                output += '</div>';
            });

            $("#TERULET").html(output);
        }).fail(function(){
            alert("Hiba a JSON fájl betöltésekor! Ellenőrizd, hogy a JSON fájl ugyanabban a mappában van-e.");
        });
    });
});