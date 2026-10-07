```javascript
// ========================================
// MENTOR DASHBOARD
// ========================================

// Main request modal
const requestModal = document.getElementById("requestModal");
const closeModal = document.getElementById("closeModal");

// Request buttons
const viewButtons = document.querySelectorAll(".view-btn");
const approveButtons = document.querySelectorAll(".approve-btn");
const rejectButtons = document.querySelectorAll(".reject-btn");


// ========================================
// REQUEST DATA
// ========================================

const requestDetails = {

    OUT004: {
        id: "#OUT004",
        student: "Rohit Kumar",
        rollNumber: "22CSE001",
        destination: "Chittoor",
        fromDate: "30-09-2026",
        toDate: "30-09-2026",
        type: "Normal",
        reason: "Personal work",
        contact: "9876543210"
    },

    OUT005: {
        id: "#OUT005",
        student: "Priya S",
        rollNumber: "22CSE002",
        destination: "Tirupati",
        fromDate: "01-10-2026",
        toDate: "01-10-2026",
        type: "Normal",
        reason: "Family function",
        contact: "9876543211"
    },

    OUT006: {
        id: "#OUT006",
        student: "Anjali R",
        rollNumber: "22CSE003",
        destination: "Home",
        fromDate: "30-09-2026",
        toDate: "30-09-2026",
        type: "Emergency",
        reason: "Medical emergency",
        contact: "9876543212"
    }

};


// ========================================
// STATISTICS
// ========================================

const statCards = document.querySelectorAll(".stat-card");

const totalElement = statCards[0]?.querySelector("p");
const pendingElement = statCards[1]?.querySelector("p");
const approvedElement = statCards[2]?.querySelector("p");
const rejectedElement = statCards[3]?.querySelector("p");


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {

    const rows = document.querySelectorAll(
        ".requests-section#pending tbody tr"
    );

    let pending = 0;
    let approved = 0;
    let rejected = 0;

    rows.forEach(function (row) {

        const status = row
            .querySelector(".status")
            ?.textContent
            .trim();

        if (status === "Pending") {
            pending++;
        }

        if (status === "Approved") {
            approved++;
        }

        if (status === "Rejected") {
            rejected++;
        }

    });


    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (approvedElement) {
        approvedElement.textContent = approved;
    }

    if (rejectedElement) {
        rejectedElement.textContent = rejected;
    }

}


// ========================================
// VIEW REQUEST
// ========================================

viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");

        const requestId = row
            .querySelector("td")
            .textContent
            .trim()
            .replace("#", "");

        const request = requestDetails[requestId];

        if (!request) {
            return;
        }


        const details = document.querySelectorAll(
            ".request-details .detail-item strong"
        );


        details[0].textContent = request.id;
        details[1].textContent = request.student;
        details[2].textContent = request.rollNumber;
        details[3].textContent = request.destination;
        details[4].textContent = request.fromDate;
        details[5].textContent = request.toDate;
        details[6].textContent = request.type;
        details[7].textContent = request.reason;
        details[8].textContent = request.contact;


        requestModal.style.display = "flex";

    });

});


// ========================================
// CLOSE REQUEST MODAL
// ========================================

closeModal.addEventListener("click", function () {

    requestModal.style.display = "none";

});


window.addEventListener("click", function (event) {

    if (event.target === requestModal) {

        requestModal.style.display = "none";

    }

});


// ========================================
// APPROVE REQUEST
// ========================================

approveButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");

        const statusCell = row.querySelector(".status");

        if (!statusCell) {
            return;
        }


        // Prevent duplicate action
        if (statusCell.textContent.trim() !== "Pending") {
            return;
        }


        const studentName = row
            .querySelector("td:nth-child(2)")
            .textContent
            .trim();


        const confirmed = confirm(
            `Approve outpass request for ${studentName}?`
        );


        if (!confirmed) {
            return;
        }


        // Update status
        statusCell.textContent = "Approved";

        statusCell.className = "status approved";


        // Disable approve/reject buttons
        const approveButton = row.querySelector(".approve-btn");
        const rejectButton = row.querySelector(".reject-btn");

        approveButton.disabled = true;
        rejectButton.disabled = true;


        // Update statistics
        updateStatistics();


        alert("Outpass request approved successfully.");

    });

});


// ========================================
// REJECT REQUEST
// ========================================

rejectButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const row = button.closest("tr");

        const statusCell = row.querySelector(".status");

        if (!statusCell) {
            return;
        }


        // Prevent duplicate action
        if (statusCell.textContent.trim() !== "Pending") {
            return;
        }


        const studentName = row
            .querySelector("td:nth-child(2)")
            .textContent
            .trim();


        const confirmed = confirm(
            `Reject outpass request for ${studentName}?`
        );


        if (!confirmed) {
            return;
        }


        // Update status
        statusCell.textContent = "Rejected";

        statusCell.className = "status rejected";


        // Disable buttons
        const approveButton = row.querySelector(".approve-btn");
        const rejectButton = row.querySelector(".reject-btn");

        approveButton.disabled = true;
        rejectButton.disabled = true;


        // Update statistics
        updateStatistics();


        alert("Outpass request rejected successfully.");

    });

});


// ========================================
// INITIAL STATISTICS
// ========================================

updateStatistics();
