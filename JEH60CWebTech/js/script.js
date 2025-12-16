$(document).ready(function () {

    // === DARK MODE TOGGLE ===
    $('#dark_mode_btn').click(function() {
        $('body').toggleClass('dark-mode');
        
        if ($('body').hasClass('dark-mode')) {
            $(this).text('☀️'); 
        } else {
            $(this).text('🌙'); 
        }
    });

    // Global variable to store the card element being edited
    let editedCardElement = null;

    // =========================================================
    // 1. LOAD CARS (AJAX)
    // =========================================================
    function loadCarCards() {
        const $listContainer = $('#car_list_container'); 

        if ($listContainer.length) {
            $.ajax({
                url: '../json/autok.json',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    $listContainer.empty();

                    // Developer View: Display Raw JSON
                    $('#json_display').text(JSON.stringify(data, null, 4));

                    // Iterate through cars (assuming JSON key is now 'cars')
                    data.cars.forEach(function (car) {
                        const card = createCarCard(car);
                        $listContainer.append(card);
                    });
                    
                    // Fade-in animation
                    $('.car-card').css('opacity', 0).delay(200).animate({ opacity: 1 }, 1000); 
                },
                error: function (xhr, status, error) {
                    $listContainer.html('<p>Error loading data: ' + status + '</p>');
                }
            });
        }
    }

    // Helper function to create HTML card
    function createCarCard(car) {
        // Convert object to string for the button data attribute
        const dataString = JSON.stringify(car).replace(/"/g, '&quot;');

        return $('<div>', { class: 'car-card' }).html(
            '<div class="card-image-container">' +
            '<img src="' + car.image_url + '" alt="' + car.brand + '" class="card-image">' + 
            '</div>' +
            '<div class="card-content">' +
            '<h3>' + car.brand + ' ' + car.model + '</h3>' +
            '<p><strong>Year:</strong> ' + car.year + '</p>' +
            '<p><strong>Fuel:</strong> ' + car.fuel + '</p>' +
            '<p class="price"><strong>Price:</strong> ' + car.price.toLocaleString('hu-HU') + ' Ft</p>' +
            `<button class="edit-btn btn" data-car='${dataString}'>Edit</button>` +
            '</div>'
        );
    }

    // Initial load call
    loadCarCards();


    // =========================================================
    // 2. EDIT BUTTON HANDLER
    // =========================================================
    $('#car_list_container').on('click', '.edit-btn', function () {

        const carData = $(this).data('car');

        // Fill form with data (IDs must match HTML)
        $('#new_brand').val(carData.brand);
        $('#new_model').val(carData.model);
        $('#new_price').val(carData.price);
        $('#new_fuel').val(carData.fuel); 

        // Store the card element reference
        editedCardElement = $(this).closest('.car-card');

        // Update UI
        $('#add_btn').text('Save Changes'); 
        $('#add_btn').css('background-color', '#007BFF');

        // Scroll to form
        $('html, body').animate({
            scrollTop: $("#new_car_form").offset().top 
        }, 500);

        alert("Edit mode active! Data loaded into the form.");
    });


    // =========================================================
    // 3. FORM SUBMIT (NEW CAR / EDIT CAR)
    // =========================================================
    $('#new_car_form').on('submit', function (e) {
        e.preventDefault();

        // --- VALIDATION START ---
        let hasError = false; 
        let errorMessage = "Please fix the following errors:\n";

        // Reset previous error styles (Renamed Class)
        $('.error-field').removeClass('error-field');

        // Select inputs (Renamed IDs)
        const $brand = $('#new_brand');
        const $model = $('#new_model');
        const $price = $('#new_price');
        const $fuel = $('#new_fuel');
        const fileInput = document.getElementById('new_image_file');

        // 1. Brand validation
        if ($brand.val().trim() === "") {
            $brand.addClass('error-field');
            hasError = true;
            errorMessage += "- The Brand field cannot be empty!\n";
        }

        // 2. Model validation
        if ($model.val().trim() === "") {
            $model.addClass('error-field');
            hasError = true;
            errorMessage += "- The Model field cannot be empty!\n";
        }

        // 3. Price validation
        if ($price.val() === "" || $price.val() <= 0) {
            $price.addClass('error-field');
            hasError = true;
            errorMessage += "- The Price field cannot be empty or zero!\n";
        }

        // 4. Image validation (required only for new cars)
        if (!editedCardElement && fileInput.files.length === 0) {
            $('#new_image_file').addClass('error-field');
            hasError = true;
            errorMessage += "- An image is required for new cars!\n";
        }

        if (hasError) {
            alert(errorMessage);
            return; // Stop execution
        }
        // --- VALIDATION END ---


        // Prepare Data Object (English Keys)
        let carData = {
            id: editedCardElement ? 0 : $('.car-card').length + 1,
            brand: $brand.val(),
            model: $model.val(),
            year: new Date().getFullYear(),
            fuel: $fuel.val(),
            price: parseInt($price.val()),
            image_url: ''
        };

        const file = fileInput.files[0];

        // Callback function to finish processing
        const finishProcessing = function (finalImageUrl) {
            carData.image_url = finalImageUrl;
            const newCardHTML = createCarCard(carData);

            if (editedCardElement) {
                // EDIT MODE
                editedCardElement.replaceWith(newCardHTML);
                alert('Success! Car data updated.');

                editedCardElement = null;
                $('#add_btn').text('Add Car');
                $('#add_btn').css('background-color', '#4CAF50');
            } else {
                // NEW MODE
                const $listContainer = $('#car_list_container');
                newCardHTML.css({ opacity: 0, marginTop: '-50px' });
                $listContainer.prepend(newCardHTML);
                newCardHTML.animate({ opacity: 1, marginTop: '0px' }, 500);
                alert('Success! New card created.');
            }

            // Reset form
            $('#new_car_form')[0].reset();
        };

        // Image File Reader logic
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                finishProcessing(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            if (editedCardElement) {
                const oldImageSrc = editedCardElement.find('.card-image').attr('src');
                finishProcessing(oldImageSrc);
            } else {
                finishProcessing('images/placeholder.jpg');
            }
        }
    });


    // =========================================================
    // 4. TOP 3 CHEAPEST CARS
    // =========================================================
    function loadTop3Cheapest() {
        const $tbody = $('#highlighted_body'); 

        if ($tbody.length) {
            $.ajax({
                url: '../json/autok.json', 
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    let sortedCars = data.cars.slice(); // 'cars' key

                    sortedCars.sort(function (a, b) {
                        return a.price - b.price; // 'price' key
                    });

                    let top3 = sortedCars.slice(0, 3);

                    $tbody.empty();

                    top3.forEach(function (car) {
                        let row = '<tr>' +
                            '<td>' + car.brand + '</td>' +
                            '<td>' + car.model + '</td>' +
                            '<td>' + car.year + '</td>' +
                            '<td>' + car.price.toLocaleString('hu-HU') + '</td>' +
                            '</tr>';

                        $tbody.append(row);
                    });
                },
            });
        }
    }

    loadTop3Cheapest();


    // =========================================================
    // 5. LOGIN / REGISTRATION TABS
    // =========================================================

    // Tab switching (Login View)
    $(document).on('click', '#tab_login', function () { 
        $('#tab_login').addClass('active-tab'); 
        $('#tab_register').removeClass('active-tab');
        $('#register_form').hide();
        $('#login_form').fadeIn();
        $('#json_output_container').hide(); 
    });

    // Tab switching (Registration View)
    $(document).on('click', '#tab_register', function () { 
        $('#tab_register').addClass('active-tab');
        $('#tab_login').removeClass('active-tab');
        $('#login_form').hide();
        $('#register_form').fadeIn();
        $('#json_output_container').hide();
    });

    // --- JSON GENERATION (Registration Submit) ---
    $('#register_form').on('submit', function (e) {
        e.preventDefault();

        // Create Data Object
        let registrationData = {
            username: $('#reg_username').val(), 
            email: $('#reg_email').val(),       
            password_hash: '********',
            date: new Date().toISOString()
        };

        let jsonOutput = JSON.stringify(registrationData, null, 4);

        // Display JSON on screen
        $('#json_code_block').text(jsonOutput); 
        $('#json_output_container').fadeIn();

        alert('Registration successful! JSON data displayed below.');
        
        $(this)[0].reset();
    });

    // Login simulation
    $('#login_form').on('submit', function(e) {
        e.preventDefault();
        alert("Login successful (Simulation).");
        $(this)[0].reset();
    });


    // =========================================================
    // 6. CONTACT FORM VALIDATION
    // =========================================================
    $('#contact_form').on('submit', function (e) { 
        e.preventDefault();
        let isValid = true;
        const $form = $(this);
        const $errorContainer = $('#error_message_box'); 
        
        // Reset UI
        $errorContainer.hide().empty();
        $('.error-field').removeClass('error-field'); 

        const $name = $('#contact_name'); 
        const $email = $('#contact_email');
        const $message = $('#contact_message');

        // Name Validation
        if ($name.val().length < 2) {
            isValid = false;
            $name.addClass('error-field');
            $errorContainer.append('<p>The name is too short.</p>');
        }

        // Email Validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val())) {
            isValid = false;
            $email.addClass('error-field');
            $errorContainer.append('<p>Invalid email format.</p>');
        }

        // Message Validation
        if ($message.val().length < 10) {
            isValid = false;
            $message.addClass('error-field');
            $errorContainer.append('<p>The message is too short.</p>');
        }

        if (isValid) {
            alert('Message sent successfully!');
            $form.get(0).reset();
        } else {
            $errorContainer.show();
            // Shake animation
            $form.animate({ left: '-10px' }, 50).animate({ left: '10px' }, 50).animate({ left: '0px' }, 50);
        }
    });


    // =========================================================
    // 7. YOUTUBE API VIDEO CONTROL
    // =========================================================
    var player;

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'Yfsm_62odgY',
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    function onPlayerReady(event) {
        $('#ytPlayBtn').on('click', function () {
            player.playVideo();
        });

        $('#ytPauseBtn').on('click', function () {
            player.pauseVideo();
        });

        $('#ytMuteBtn').on('click', function () {
            if (player.isMuted()) {
                player.unMute();
                $(this).text("🔇 Unmute");
            } else {
                player.mute();
                $(this).text("🔊 Mute");
            }
        });
    }

});