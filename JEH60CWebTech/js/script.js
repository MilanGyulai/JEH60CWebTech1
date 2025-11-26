$(document).ready(function () {

    let szerkesztettKartyaElem = null;

    // 1. AUTÓK BEOLVASÁSA (AJAX)
    function loadAutokCards() {
        const $listaHelye = $('#json_lista_helye');

        if ($listaHelye.length) {
            $.ajax({
                url: '../json/autok.json',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    $listaHelye.empty();
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

            '<button class="reszletek-gomb gomb">Részletek</button>' +

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


        let autoAdat = {

            id: szerkesztettKartyaElem ? 0 : $('.auto-kartya').length + 1,
            marka: $('#uj_marka').val(),
            modell: $('#uj_modell').val(),
            evjarat: new Date().getFullYear(),
            uzemanyag: $('#uj_uzemanyag').val(),
            ar: parseInt($('#uj_ar').val()),
            kep_url: ''
        };

        const fileInput = document.getElementById('uj_kep_fajl');
        const file = fileInput.files[0];

        const feldolgozasBefejezese = function (veglegesKepUrl) {
            autoAdat.kep_url = veglegesKepUrl;

            const ujKartyaHTML = createAutoCard(autoAdat);

            if (szerkesztettKartyaElem) {

                szerkesztettKartyaElem.replaceWith(ujKartyaHTML);
                alert('Siker! Az autó adatai módosítva lettek.');

                szerkesztettKartyaElem = null;
                $('#hozzaad_gomb').text('Kártya Hozzáadása');
                $('#hozzaad_gomb').css('background-color', '#4CAF50'); // Vissza zöldre

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

});


var video = document.getElementById("szervizVideo");
function playVideo() { if (video) video.play(); }
function pauseVideo() { if (video) video.pause(); }
function muteVideo() { if (video) { video.muted = !video.muted; } }