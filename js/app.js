// Basic app.js to initialize turn.js and handle events
$(document).ready(function () {
    var $flipbook = $('.flipbook');
    var $slider = $('#page-slider');
    var $pageCurrent = $('#page-current');
    var $pageTotal = $('#page-total');

    // Detect display mode based on window width
    function checkDisplayMode() {
        return $(window).width() < 900 ? 'single' : 'double';
    }

    // Initialize Turn.js

    // --- Brand Animation Setup (PRE-INIT) ---
    // Wrap letters and add index for CSS staggering
    var textWrapper = document.querySelector('.brand-text');
    if (textWrapper) {
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, function (match, i) {
            return "<span class='letter' style='--i:" + i + ";'>" + match + "</span>";
        });
    }

    $flipbook.turn({
        width: 1100,
        height: 700,
        autoCenter: true,
        elevation: 50,
        gradients: true,
        display: checkDisplayMode(),
        when: {
            turning: function (event, page, view) {
                // Update current page display
                $pageCurrent.text(page);

                // Sync slider
                $slider.val(page);

                // Disable/enable buttons based on page
                // Disable/enable buttons based on page
                if (page === 1) {
                    $('#btn-first, #btn-prev').prop('disabled', true);
                    $('#prev-btn').hide();
                } else {
                    $('#btn-first, #btn-prev').prop('disabled', false);
                    $('#prev-btn').show();
                }

                if (page === $flipbook.turn('pages')) {
                    $('#btn-next, #btn-last').prop('disabled', true);
                    $('#next-btn').hide();
                } else {
                    $('#btn-next, #btn-last').prop('disabled', false);
                    $('#next-btn').show();
                }
            },
            turned: function (event, page, view) {
                // Update current page display when turn is complete
                $pageCurrent.text(page);
                $slider.val(page);
            }
        }
    });

    // Set total pages text and slider attributes
    var totalPages = $flipbook.turn('pages');
    $pageTotal.text(totalPages);
    $slider.attr('max', totalPages);
    $slider.val(1);
    $pageCurrent.text(1);

    // Navigation buttons
    $('#btn-first').click(function () {
        $flipbook.turn('page', 1);
    });

    $('#btn-prev').click(function () {
        $flipbook.turn('previous');
    });

    $('#btn-next').click(function () {
        $flipbook.turn('next');
    });

    // Side Navigation Arrows
    $('#prev-btn').click(function () {
        $flipbook.turn('previous');
    });

    $('#next-btn').click(function () {
        $flipbook.turn('next');
    });

    $('#btn-last').click(function () {
        $flipbook.turn('page', totalPages);
    });

    // Slider input
    $slider.on('input change', function () {
        var page = parseInt($(this).val(), 10);
        $flipbook.turn('page', page);
    });

    // Zoom controls
    var zoomLevel = 1;
    var zoomStep = 0.2;
    var zoomMax = 2.0;
    var zoomMin = 0.6;

    function applyZoom() {
        $flipbook.css('transform', 'scale(' + zoomLevel + ')');
        $flipbook.css('transform-origin', 'center center');
    }

    $('#btn-zoom-in').click(function () {
        if (zoomLevel < zoomMax) {
            zoomLevel += zoomStep;
            applyZoom();
        }
    });

    $('#btn-zoom-out').click(function () {
        if (zoomLevel > zoomMin) {
            zoomLevel -= zoomStep;
            applyZoom();
        }
    });

    $('#btn-zoom-reset').click(function () {
        zoomLevel = 1;
        applyZoom();
    });

    // Keyboard navigation
    $(document).keydown(function (e) {
        if (e.keyCode == 37) { // Left arrow
            $flipbook.turn('previous');
        } else if (e.keyCode == 39) { // Right arrow
            $flipbook.turn('next');
        }
    });

    // --------- UPDATED PRINT BUTTON: OPEN STATIC PDF ----------
    // Replace the old window.print() logic with this block.
    $('#btn-print').click(function () {
        // Put your static PDF file in the same folder as index.html,
        // or adjust the path if it is in /assets, /pdf, etc.
        var pdfUrl = 'Chair installation manual_sample final.pdf'; // Corrected filename

        // Option A: Open in new tab (user clicks browser print)
        window.open(pdfUrl, '_blank');

        // Option B (alternative): force download instead of open
        // var link = document.createElement('a');
        // link.href = pdfUrl;
        // link.download = 'Chair-installation-manual.pdf';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    });
    // --------- END UPDATED PRINT BUTTON ----------

    // Fullscreen toggle
    $('#btn-fullscreen').click(function () {
        var elem = document.documentElement;
        if (!document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            }
        }
    });

    // Handle window resize to switch display mode
    $(window).on('resize', function () {
        var displayMode = checkDisplayMode();
        $flipbook.turn('display', displayMode);
    });

    // Ensure correct display on load
    $flipbook.turn('display', checkDisplayMode());

    // Hide loader after initialization
    setTimeout(function () {
        $('#loader').fadeOut(500);
    }, 1000); // Small delay to ensure render

    // --- Brand Animation Trigger ---
    // Configured via CSS in animation.css using .brand-text .letter
});

