// =========================
// CONTACT FORM
// =========================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (name === "" || email === "" || message === "") {
            alert("Please fill in all the fields.");
            return;
        }

        alert(
            "Thank you, " +
            name +
            "! Your message has been received."
        );

        contactForm.reset();

    });

}


// =========================
// CURRENT YEAR
// =========================

const yearElement = document.querySelector(".footer-bottom p");

if (yearElement) {

    const currentYear = new Date().getFullYear();

    yearElement.innerHTML =
        "&copy; " +
        currentYear +
        " Omo Rabi Software. All rights reserved.";

}// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

    });


    const navigationLinks = navLinks.querySelectorAll("a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

        });

    });

}