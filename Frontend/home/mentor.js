// =========================
// REQUEST DETAILS MODAL
// =========================

const modal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

const viewButtons = document.querySelectorAll(".view-btn");


// Open modal

viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        modal.style.display = "flex";

    });

});


// Close modal

closeModal.addEventListener("click", function () {

    modal.style.display = "none";

});


// Close when clicking outside

window.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});