// =============================================
// main.js - SVU Events Website
// JavaScript handles: slider, filtering, form validation
// =============================================


// ---- SLIDER (index.html) ----
// Simple manual slider for featured events section

var currentSlide = 0;

function initSlider() {
    var slides = document.querySelectorAll(".slide-item");
    if (slides.length === 0) return; // not on homepage, skip

    // show only first slide at start
    showSlide(0);

    // auto move every 3 seconds
    setInterval(function() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 3000);
}

function showSlide(index) {
    var slides = document.querySelectorAll(".slide-item");
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slides[index]) {
        slides[index].style.display = "block";
    }

    // update dots if they exist
    var dots = document.querySelectorAll(".slider-dot");
    for (var j = 0; j < dots.length; j++) {
        dots[j].classList.remove("active-dot");
    }
    if (dots[index]) {
        dots[index].classList.add("active-dot");
    }
}

// clicking a dot jumps to that slide
function goToSlide(n) {
    currentSlide = n;
    showSlide(n);
}


// ---- FILTERING (events page) ----
// filters event cards by search text, category checkboxes, and date

function filterEvents() {
    var searchVal = "";
    var dateVal = "";
    var locationVal = "";
    var checkedCats = [];

    var searchInput = document.getElementById("searchInput");
    var dateInput = document.getElementById("dateInput");
    var locationInput = document.getElementById("locationInput");

    if (searchInput) searchVal = searchInput.value.toLowerCase().trim();
    if (dateInput) dateVal = dateInput.value; // format: yyyy-mm-dd
    if (locationInput) locationVal = locationInput.value.toLowerCase().trim();

    // collect checked categories
    var checkboxes = document.querySelectorAll('input[name="category"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        checkedCats.push(checkboxes[i].value.toLowerCase());
    }

    var cards = document.querySelectorAll(".event-item");

    for (var k = 0; k < cards.length; k++) {
        var card = cards[k];

        var title = card.getAttribute("data-title") || "";
        var cat = card.getAttribute("data-category") || "";
        var date = card.getAttribute("data-date") || ""; // expected yyyy-mm-dd
        var location = card.getAttribute("data-location") || "";

        var titleMatch = title.toLowerCase().indexOf(searchVal) !== -1;

        // if no categories checked, show all; otherwise check if card category matches
        var catMatch = true;
        if (checkedCats.length > 0) {
            catMatch = checkedCats.indexOf(cat.toLowerCase()) !== -1;
        }

        // date filter: show cards on or after picked date
        var dateMatch = true;
        if (dateVal !== "") {
            dateMatch = date >= dateVal;
        }

        // location filter: partial match so "dam" matches "Damascus"
        var locationMatch = true;
        if (locationVal !== "") {
            locationMatch = location.toLowerCase().indexOf(locationVal) !== -1;
        }

        if (titleMatch && catMatch && dateMatch && locationMatch) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

function initFilter() {
    var searchInput = document.getElementById("searchInput");
    var dateInput = document.getElementById("dateInput");
    var locationInput = document.getElementById("locationInput");
    var checkboxes = document.querySelectorAll('input[name="category"]');
    var searchBtn = document.getElementById("searchBtn");
    var resetBtn = document.getElementById("resetBtn");

    if (!searchInput && !dateInput) return; // not on events page

    // search button triggers filter manually
    if (searchBtn) {
        searchBtn.addEventListener("click", filterEvents);
    }

    // pressing Enter in any text input also triggers filter
    if (searchInput) {
        searchInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") filterEvents();
        });
    }
    if (locationInput) {
        locationInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") filterEvents();
        });
    }

    if (dateInput) {
        dateInput.addEventListener("change", filterEvents);
    }
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", filterEvents);
    }
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            if (searchInput) searchInput.value = "";
            if (dateInput) dateInput.value = "";
            if (locationInput) locationInput.value = "";
            var allChecks = document.querySelectorAll('input[name="category"]');
            for (var j = 0; j < allChecks.length; j++) {
                allChecks[j].checked = false;
            }
            filterEvents();
        });
    }
}


// ---- CONTACT FORM VALIDATION ----

function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return; // not on contact page

    form.addEventListener("submit", function(e) {
        e.preventDefault(); // stop actual submit

        var name = document.getElementById("nameField").value.trim();
        var email = document.getElementById("emailField").value.trim();
        var message = document.getElementById("messageField").value.trim();

        var msgBox = document.getElementById("formMsg");

        // simple email check - just looks for @ and a dot after it
        var emailOk = email.indexOf("@") !== -1 && email.indexOf(".") > email.indexOf("@");

        if (name === "" || email === "" || message === "") {
            msgBox.className = "form-msg error";
            msgBox.style.display = "block";
            msgBox.textContent = "Please fill in all fields before sending.";
            return;
        }

        if (!emailOk) {
            msgBox.className = "form-msg warning";
            msgBox.style.display = "block";
            msgBox.textContent = "That email doesn't look right. Please check it.";
            return;
        }

        // all good
        msgBox.className = "form-msg success";
        msgBox.style.display = "block";
        msgBox.textContent = "Message sent! We will get back to you soon.";
        form.reset();
    });
}


// ---- SCROLL TO TOP BUTTON ----
// bonus feature - shows a small button when user scrolls down

function initScrollTop() {
    var btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", function() {
        if (window.scrollY > 200) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    });

    btn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// ---- RUN EVERYTHING ON PAGE LOAD ----

window.addEventListener("load", function() {
    initSlider();
    initFilter();
    initContactForm();
    initScrollTop();
});
