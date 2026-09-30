const modal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

const viewButtons = document.querySelectorAll(".view-btn");
const approveButtons = document.querySelectorAll(".approve-btn");
const rejectButtons = document.querySelectorAll(".reject-btn");


// VIEW REQUEST
viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {
        modal.style.display = "flex";
    });

});


// CLOSE MODAL
closeModal.addEventListener("click", function () {
    modal.style.display = "none";
});


// CLOSE WHEN CLICKING OUTSIDE
window.addEventListener("click", function (event) {

    if (event.target === modal) {
        modal.style.display = "none";
    }

});


// APPROVE REQUEST
approveButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");
        const status = row.querySelector(".status");

        status.textContent = "Approved";
        status.className = "status approved";

        button.disabled = true;

        const rejectButton = row.querySelector(".reject-btn");

        if (rejectButton) {
            rejectButton.disabled = true;
        }

    });

});


// REJECT REQUEST
rejectButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");
        const status = row.querySelector(".status");

        status.textContent = "Rejected";
        status.className = "status rejected";

        button.disabled = true;

        const approveButton = row.querySelector(".approve-btn");

        if (approveButton) {
            approveButton.disabled = true;
        }

    });

});