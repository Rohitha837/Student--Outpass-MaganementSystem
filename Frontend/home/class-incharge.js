const modal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

const viewButtons = document.querySelectorAll(".view-btn");
const approveButtons = document.querySelectorAll(".approve-btn");
const rejectButtons = document.querySelectorAll(".reject-btn");

const modalApproveButton = modal.querySelector(".approve-btn");
const modalRejectButton = modal.querySelector(".reject-btn");

let selectedRow = null;


// =========================
// VIEW REQUEST
// =========================

viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");

        selectedRow = row;

        const cells = row.querySelectorAll("td");

        const requestId = cells[0].textContent.trim();
        const student = cells[1].textContent.trim();
        const destination = cells[2].textContent.trim();
        const date = cells[3].textContent.trim();
        const type = cells[4].textContent.trim();

        document.querySelector(
            ".request-details p:nth-child(1)"
        ).innerHTML = `<strong>Request ID:</strong> ${requestId}`;

        document.querySelector(
            ".request-details p:nth-child(2)"
        ).innerHTML = `<strong>Student:</strong> ${student}`;

        document.querySelector(
            ".request-details p:nth-child(3)"
        ).innerHTML = `<strong>Destination:</strong> ${destination}`;

        document.querySelector(
            ".request-details p:nth-child(4)"
        ).innerHTML = `<strong>Reason:</strong> ${type} Outpass Request`;

        document.querySelector(
            ".request-details p:nth-child(5)"
        ).innerHTML = `<strong>From Date:</strong> ${date}`;

        document.querySelector(
            ".request-details p:nth-child(6)"
        ).innerHTML = `<strong>To Date:</strong> ${date}`;

        document.querySelector(
            ".request-details p:nth-child(7)"
        ).innerHTML = `<strong>Out Time:</strong> 10:00 AM`;

        document.querySelector(
            ".request-details p:nth-child(8)"
        ).innerHTML = `<strong>Return Time:</strong> 04:00 PM`;

        // Check current status
        const status = row.querySelector(".status").textContent.trim();

        if (status === "Pending" || status === "Emergency") {
            modalApproveButton.disabled = false;
            modalRejectButton.disabled = false;
        } else {
            modalApproveButton.disabled = true;
            modalRejectButton.disabled = true;
        }

        modal.style.display = "flex";
    });

});


// =========================
// CLOSE MODAL
// =========================

closeModal.addEventListener("click", function () {

    modal.style.display = "none";

    selectedRow = null;

});


// =========================
// CLOSE MODAL OUTSIDE
// =========================

window.addEventListener("click", function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

        selectedRow = null;
    }

});


// =========================
// TABLE APPROVE
// =========================

approveButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Ignore modal approve button
        if (button === modalApproveButton) {
            return;
        }

        const row = button.closest("tr");

        approveRequest(row);

    });

});


// =========================
// TABLE REJECT
// =========================

rejectButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Ignore modal reject button
        if (button === modalRejectButton) {
            return;
        }

        const row = button.closest("tr");

        rejectRequest(row);

    });

});


// =========================
// MODAL APPROVE
// =========================

modalApproveButton.addEventListener("click", function () {

    if (!selectedRow) {
        return;
    }

    approveRequest(selectedRow);

});


// =========================
// MODAL REJECT
// =========================

modalRejectButton.addEventListener("click", function () {

    if (!selectedRow) {
        return;
    }

    rejectRequest(selectedRow);

});


// =========================
// APPROVE REQUEST
// =========================

function approveRequest(row) {

    const student = row.cells[1].textContent.trim();

    const confirmed = confirm(
        `Are you sure you want to approve the outpass request from ${student}?`
    );

    if (!confirmed) {
        return;
    }

    updateRequestStatus(row, "Approved");

}


// =========================
// REJECT REQUEST
// =========================

function rejectRequest(row) {

    const student = row.cells[1].textContent.trim();

    const confirmed = confirm(
        `Are you sure you want to reject the outpass request from ${student}?`
    );

    if (!confirmed) {
        return;
    }

    updateRequestStatus(row, "Rejected");

}


// =========================
// UPDATE STATUS
// =========================

function updateRequestStatus(row, newStatus) {

    const status = row.querySelector(".status");

    const approveButton = row.querySelector(".approve-btn");
    const rejectButton = row.querySelector(".reject-btn");

    // Update status
    status.textContent = newStatus;

    // Remove old classes
    status.classList.remove(
        "pending",
        "emergency",
        "approved",
        "rejected"
    );

    // Add new class
    status.classList.add(newStatus.toLowerCase());

    // Disable table buttons
    approveButton.disabled = true;
    rejectButton.disabled = true;

    // Update statistics
    updateStatistics(newStatus);

    // Close modal
    modal.style.display = "none";

    selectedRow = null;

}


// =========================
// UPDATE STATISTICS
// =========================

function updateStatistics(newStatus) {

    const statCards = document.querySelectorAll(".stat-card");

    if (statCards.length < 4) {
        return;
    }

    const pendingElement = statCards[0].querySelector("h3");
    const approvedElement = statCards[1].querySelector("h3");
    const rejectedElement = statCards[2].querySelector("h3");

    let pendingCount = parseInt(
        pendingElement.textContent
    );

    let approvedCount = parseInt(
        approvedElement.textContent
    );

    let rejectedCount = parseInt(
        rejectedElement.textContent
    );

    if (newStatus === "Approved") {

        pendingCount--;
        approvedCount++;

    }

    if (newStatus === "Rejected") {

        pendingCount--;
        rejectedCount++;

    }

    pendingElement.textContent = pendingCount;
    approvedElement.textContent = approvedCount;
    rejectedElement.textContent = rejectedCount;

}