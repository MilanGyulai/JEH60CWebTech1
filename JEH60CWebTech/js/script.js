$(document).ready(function () {

    // AUTOK_BETÖLTÉSE (autok.html) - AJAX JSON beolvasás
    function loadAutokCards() {
        const $listaHelye = $('#json_lista_helye');

        if ($listaHelye.length) {
            $.ajax({
                // JAVÍTVA: Helyes webes útvonalelválasztó (perjel)
                url: '../json/autok.json',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    $listaHelye.empty();
                    data.autok.forEach(function (auto) {
                        const kartya = createAutoCard(auto);
                        $listaHelye.append(kartya);
                    });

                    // jQuery Animáció: fade-in
                    $('.auto-kartya').css('opacity', 0).delay(200).animate({ opacity: 1 }, 1000);

                },
                error: function (xhr, status, error) {
                    $listaHelye.html('<p>Hiba történt az autók betöltése során: ' + status + '</p>');
                }
            });
        }
    }

    // Segéd függvény a kártya HTML struktúrájának létrehozására
    function createAutoCard(auto) {
        // Új HTML elem készítése jQuery-vel [cite: 45]
        return $('<div>', { class: 'auto-kartya' }).html(
            '<div class="kartya-kep-kontener">' +
            // Kép elérése a JSON-ból [cite: 47]
            '<img src="' + auto.kep_url + '" alt="' + auto.marka + ' ' + auto.modell + '" class="kartya-kep">' +
            '</div>' +
            '<div class="kartya-tartalom">' +
            '<h3>' + auto.marka + ' ' + auto.modell + '</h3>' +
            // Meglévő HTML elem módosítása: ár formázása [cite: 45]
            '<p class="ar"><strong>Ár:</strong> ' + auto.ar.toLocaleString('hu-HU') + ' Ft</p>' +
            '<button class="reszletek-gomb gomb">Részletek</button>' +
            '</div>'
        );
    }

    loadAutokCards();

    // ÚJ KÁRTYA HOZZÁADÁSA

    $('#uj_auto_urlap').on('submit', function (e) {
        e.preventDefault();

        // Adatok előkészítése (ID nélkül, azt majd a PHP adja)
        let ujAuto = {
            marka: $('#uj_marka').val(),
            modell: $('#uj_modell').val(),
            evjarat: new Date().getFullYear(),
            uzemanyag: 'Új',
            ar: parseInt($('#uj_ar').val()),
            kep_url: '' 
        };

        const fileInput = document.getElementById('uj_kep_fajl');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                ujAuto.kep_url = e.target.result; // A kép Base64 kódja

                // --- AJAX KÉRÉS A PHP-NEK (A TÉNYLEGES MENTÉS) ---
                $.ajax({
                    url: 'save_auto.php', // Ezt a fájlt hívjuk meg
                    method: 'POST',
                    contentType: 'application/json', // Jelezzük, hogy JSON-t küldünk
                    data: JSON.stringify(ujAuto),    // Az adat átalakítása szöveggé
                    success: function(valasz) {
                        // Ha a PHP sikeresen elmentette:
                        const szerverValasz = JSON.parse(valasz);
                        
                        if(szerverValasz.status === 'success') {
                            alert("Siker! Az autó elmentve a szerverre.");
                            
                            // Frissítjük az ID-t a PHP válasza alapján
                            ujAuto.id = szerverValasz.id;

                            // Megjelenítjük a kártyát azonnal (hogy ne kelljen frissíteni)
                            const $listaHelye = $('#json_lista_helye');
                            const ujKartya = createAutoCard(ujAuto);
                            $listaHelye.prepend(ujKartya);
                            
                            // JSON ellenőrző frissítése
                            $('#json_eredmeny').text(JSON.stringify(ujAuto, null, 4));
                        }
                    },
                    error: function(xhr, status, error) {
                        alert("Hiba történt a mentéskor: " + error);
                        console.log(xhr.responseText);
                    }
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Kérlek, válassz ki egy képet!");
        }
        
        this.reset();
    });

    // KAPCSOLAT (kapcsolat.html) - Űrlap ellenőrzés
    $('#kapcsolat_urlap').on('submit', function (e) {
        e.preventDefault();
        let valid = true;
        const $urlap = $(this);
        const $hibaUzenet = $('#hiba_uzenet');
        $hibaUzenet.hide().empty();
        // Minden hibajelölés eltávolítása
        $('.hibas_mezo').removeClass('hibas_mezo');
        $urlap.find('input[name="elerhetoseg"]').closest('p').css('border', 'none');

        const $nev = $('#nev');
        const $email = $('#email');
        const $uzenet = $('#uzenet');

        if ($nev.val().length < 2) {
            valid = false;
            $nev.addClass('hibas_mezo'); // CSS beállítása (piros keret)
            $hibaUzenet.append('<p>A név mező túl rövid.</p>'); // Hiba kiírása 
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val())) {
            valid = false;
            $email.addClass('hibas_mezo');
            $hibaUzenet.append('<p>Érvénytelen e-mail cím formátum.</p>');
        }

        if ($uzenet.val().length < 10) {
            valid = false;
            $uzenet.addClass('hibas_mezo');
            $hibaUzenet.append('<p>Az üzenet túl rövid, minimum 10 karakter.</p>');
        }

        // Rádiógombok ellenőrzése
        if ($urlap.find('input[name="elerhetoseg"]:checked').length === 0) {
            valid = false;
            $urlap.find('input[name="elerhetoseg"]').closest('p').css('border', '1px solid red'); // CSS beállítása [cite: 43]
            $hibaUzenet.append('<p>Kérjük, válaszd ki az elérhetőségi módot.</p>');
        }

        // ... További validációk

        if (valid) {
            alert('A Kapcsolat űrlap adatai érvényesek. Küldés szimulálása...');
            $urlap.get(0).reset();
        } else {
            $hibaUzenet.show();
            // jQuery Animáció: űrlap megrázása hiba esetén [cite: 44]
            $urlap.animate({ left: '-10px' }, 50).animate({ left: '10px' }, 50).animate({ left: '0px' }, 50);
        }
    });

});