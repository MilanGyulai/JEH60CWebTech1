$(document).ready(function () {

    let szerkesztettKartyaElem = null;

    // AUTÓK BEOLVASÁSA (AJAX)
    function loadAutokCards() {
        const $listaHelye = $('#json_lista_helye');

        if ($listaHelye.length) {
            $.ajax({
                url: '../json/autok.json',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    $listaHelye.empty();

                    // Szépen formázva kiírjuk a JSON-t a fekete dobozba
                    $('#json_kijelzo').text(JSON.stringify(data, null, 4));

                    data.autok.forEach(function (auto) {
                        const kartya = createAutoCard(auto);
                        $listaHelye.append(kartya);
                    });
                    $('.auto-kartya').css('opacity', 0).delay(200).animate({ opacity: 1 }, 1000);
                },
                error: function (xhr, status, error) {
                    $listaHelye.html('<p>Hiba történt az adatok betöltésekor: ' + status + '</p>');
                }
            });
        }
    }

    function createAutoCard(auto) {
        const adatString = JSON.stringify(auto).replace(/"/g, '&quot;');

        return $('<div>', { class: 'auto-kartya' }).html(
            '<div class="kartya-kep-kontener">' +
            '<img src="' + auto.kep_url + '" alt="' + auto.marka + '" class="kartya-kep">' +
            '</div>' +
            '<div class="kartya-tartalom">' +
            '<h3>' + auto.marka + ' ' + auto.modell + '</h3>' +
            '<p><strong>Évjárat:</strong> ' + auto.evjarat + '</p>' +
            '<p><strong>Üzemanyag:</strong> ' + auto.uzemanyag + '</p>' +
            '<p class="ar"><strong>Ár:</strong> ' + auto.ar.toLocaleString('hu-HU') + ' Ft</p>' +
            `<button class="modositas-gomb gomb" data-auto='${adatString}'>Módosítás</button>` +
            '</div>'
        );
    }

    loadAutokCards();


    $('#json_lista_helye').on('click', '.modositas-gomb', function () {

        const autoAdat = $(this).data('auto');

        $('#uj_marka').val(autoAdat.marka);
        $('#uj_modell').val(autoAdat.modell);
        $('#uj_ar').val(autoAdat.ar);

        szerkesztettKartyaElem = $(this).closest('.auto-kartya');

        $('#hozzaad_gomb').text('Mentés (Módosítás)');
        $('#hozzaad_gomb').css('background-color', '#007BFF');

        $('html, body').animate({
            scrollTop: $("#uj_auto_form").offset().top
        }, 500);

        alert("Szerkesztés mód! Az adatok betöltve az űrlapra. Módosítsd, majd kattints a Mentésre.");
    });


    $('#uj_auto_urlap').on('submit', function (e) {
        e.preventDefault();

        // --- VALIDÁCIÓ (ELLENŐRZÉS) KEZDETE ---
        let vanHiba = false;
        let hibaUzenet = "Kérlek javítsd az alábbi hibákat:\n";

        // Előző hibajelzések törlése (hogy ne maradjon piros, ha már javítottad)
        $('.hibas_mezo').removeClass('hibas_mezo');

        // Mezők kiválasztása
        const $marka = $('#uj_marka');
        const $modell = $('#uj_modell');
        const $ar = $('#uj_ar');
        const $uzemanyag = $('#uj_uzemanyag');
        const fileInput = document.getElementById('uj_kep_fajl');

        // 1. Márka ellenőrzés
        if ($marka.val().trim() === "") {
            $marka.addClass('hibas_mezo'); // Piros keret
            vanHiba = true;
            hibaUzenet += "- A Márka mező nem lehet üres!\n";
        }

        // 2. Modell ellenőrzés
        if ($modell.val().trim() === "") {
            $modell.addClass('hibas_mezo');
            vanHiba = true;
            hibaUzenet += "- A Modell mező nem lehet üres!\n";
        }

        // 3. Ár ellenőrzés
        if ($ar.val() === "" || $ar.val() <= 0) {
            $ar.addClass('hibas_mezo');
            vanHiba = true;
            hibaUzenet += "- Az Ár mező nem lehet üres vagy nulla!\n";
        }

        // 4. Kép ellenőrzés
        if (!szerkesztettKartyaElem && fileInput.files.length === 0) {
            $('#uj_kep_fajl').addClass('hibas_mezo');
            vanHiba = true;
            hibaUzenet += "- Új autóhoz kötelező képet feltölteni!\n";
        }

        // HA HIBA VAN: Szólunk és kilépünk (nem fut tovább a kód)
        if (vanHiba) {
            alert(hibaUzenet);
            return; // ITT MEGÁLL A FÜGGVÉNY!
        }
        // --- VALIDÁCIÓ VÉGE ---


        // HA MINDEN OKÉ, AKKOR FOLYTATJUK A MENTÉST:

        let autoAdat = {
            id: szerkesztettKartyaElem ? 0 : $('.auto-kartya').length + 1,
            marka: $marka.val(),
            modell: $modell.val(),
            evjarat: new Date().getFullYear(),
            uzemanyag: $uzemanyag.val(),
            ar: parseInt($ar.val()),
            kep_url: ''
        };

        const file = fileInput.files[0];

        const feldolgozasBefejezese = function (veglegesKepUrl) {
            autoAdat.kep_url = veglegesKepUrl;
            const ujKartyaHTML = createAutoCard(autoAdat);

            if (szerkesztettKartyaElem) {
                szerkesztettKartyaElem.replaceWith(ujKartyaHTML);
                alert('Siker! Az autó adatai módosítva lettek.');

                szerkesztettKartyaElem = null;
                $('#hozzaad_gomb').text('Kártya Hozzáadása');
                $('#hozzaad_gomb').css('background-color', '#4CAF50');
            } else {
                const $listaHelye = $('#json_lista_helye');
                ujKartyaHTML.css({ opacity: 0, marginTop: '-50px' });
                $listaHelye.prepend(ujKartyaHTML);
                ujKartyaHTML.animate({ opacity: 1, marginTop: '0px' }, 500);
                alert('Siker! Az új kártya létrejött.');
            }

            $('#uj_auto_urlap')[0].reset();
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                feldolgozasBefejezese(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            if (szerkesztettKartyaElem) {
                const regiKepSrc = szerkesztettKartyaElem.find('.kartya-kep').attr('src');
                feldolgozasBefejezese(regiKepSrc);
            } else {
                feldolgozasBefejezese('images/placeholder.jpg');
            }
        }
    });
    // =========================================================
    // 3 LEGOLCSÓBB AUTÓ BETÖLTÉSE A TÁBLÁZATBA
    // =========================================================
    function loadTop3Cheapest() {
        const $tbody = $('#kiemelt_body');

        if ($tbody.length) {
            $.ajax({
                url: '../json/autok.json',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    //Másolat készítése a tömbről (hogy ne rontsuk el az eredeti sorrendet a kártyáknál)
                    let autokRendezve = data.autok.slice();

                    autokRendezve.sort(function (a, b) {
                        return a.ar - b.ar;
                    });

                    let top3 = autokRendezve.slice(0, 3);

                    $tbody.empty(); // Biztonság kedvéért kiürítjük

                    top3.forEach(function (auto) {
                        let sor = '<tr>' +
                            '<td>' + auto.marka + '</td>' +
                            '<td>' + auto.modell + '</td>' +
                            '<td>' + auto.evjarat + '</td>' +
                            '<td>' + auto.ar.toLocaleString('hu-HU') + '</td>' +
                            '</tr>';

                        $tbody.append(sor);
                    });
                },
            });
        }
    }

    loadTop3Cheapest();

    $(document).on('click', '#ful_login', function () {
        $('#ful_login').addClass('aktiv_ful');
        $('#ful_reg').removeClass('aktiv_ful');

        $('#reg_form').hide();
        $('#login_form').fadeIn();
    });

    $(document).on('click', '#ful_reg', function () {
        $('#ful_reg').addClass('aktiv_ful');
        $('#ful_login').removeClass('aktiv_ful');

        $('#login_form').hide();
        $('#reg_form').fadeIn();
    });


    // =========================================================
    // YOUTUBE VIDEÓ VEZÉRLÉS (API használatával)
    // =========================================================

    // Ez a változó tárolja majd a lejátszót
    var player;

    // YouTube API kód betöltése (ez kötelező, hogy működjön)
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Ez a függvény fut le automatikusan, amikor a YouTube API betöltött
    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'Yfsm_62odgY', // <--- videó ID-je
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    // Amikor a videó készen áll, bekapcsoljuk a gombokat
    function onPlayerReady(event) {

        // Lejátszás gomb
        $('#ytPlayBtn').on('click', function () {
            player.playVideo();
        });

        // Szünet gomb
        $('#ytPauseBtn').on('click', function () {
            player.pauseVideo();
        });

        // Némítás gomb (váltogat)
        $('#ytMuteBtn').on('click', function () {
            if (player.isMuted()) {
                player.unMute();
                $(this).text("🔇 Némítás");
            } else {
                player.mute();
                $(this).text("🔊 Hang");
            }
        });
    }

});


