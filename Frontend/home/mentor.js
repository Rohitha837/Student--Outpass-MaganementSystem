const API_URL = "http://127.0.0.1:8000";

let mentorRequests = [];

document.addEventListener("DOMContentLoaded", () => {
    loadMentorRequests();
});


async function loadMentorRequests() {

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "index.html";
        return;
    }

    const tableBody =
        document.getElementById("requestsTable") ||
        document.querySelector("#requestsTable tbody") ||
        document.querySelector("tbody");

    if (!tableBody) {
        console.error("Requests table body not found.");
        return;
    }

    tableBody.innerHTML = `
        <tr>
            <td colspan="10">Loading requests...</td>
        </tr>
    `;

    try {

        const response = await fetch(`${API_URL}/mentor/requests`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        console.log("Mentor requests:", data);

        if (response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");

            alert("Session expired. Please login again.");
            window.location.href = "index.html";
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to load mentor requests."
            );
        }

        mentorRequests = data;

        displayRequests(tableBody);

    } catch (error) {

        console.error("Mentor request error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    Unable to load requests.
                </td>
            </tr>
        `;
    }
}


function displayRequests(tableBody) {

    if (!mentorRequests.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    No pending outpass requests.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = "";

    mentorRequests.forEach(request => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${request.request_id}</td>

            <td>${request.student_id}</td>

            <td>${request.destination}</td>

            <td>${request.from_date}</td>

            <td>${request.to_date}</td>

            <td>${request.out_time}</td>

            <td>${request.return_time}</td>

            <td>${request.request_type}</td>

            <td>
                <button
                    type="button"
                    class="view-btn"
                    onclick="viewRequest(${request.id})">
                    View
                </button>

                <button
                    type="button"
                    class="approve-btn"
                    onclick="approveRequest(${request.id})">
                    Approve
                </button>

                <button
                    type="button"
                    class="reject-btn"
                    onclick="rejectRequest(${request.id})">
                    Reject
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


function viewRequest(requestId) {

    const request = mentorRequests.find(
        item => item.id === requestId
    );

    if (!request) {
        alert("Request not found.");
        return;
    }

    alert(
        "OUTPASS DETAILS\n\n" +
        "Request ID: " + request.request_id +
        "\nStudent ID: " + request.student_id +
        "\nDestination: " + request.destination +
        "\nFrom Date: " + request.from_date +
        "\nTo Date: " + request.to_date +
        "\nOut Time: " + request.out_time +
        "\nReturn Time: " + request.return_time +
        "\nRequest Type: " + request.request_type +
        "\nReason: " + request.reason +
        "\nStatus: " + request.status
    );
}


async function approveRequest(requestId) {

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "index.html";
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to approve this outpass?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/mentor/requests/${requestId}/approve`,
            {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log("Approve response:", data);

        if (!response.ok) {
            alert(data.detail || "Unable to approve request.");
            return;
        }

        alert(
            "Outpass approved successfully!\n\n" +
            "Request ID: " + data.request_id
        );

        loadMentorRequests();

    } catch (error) {

        console.error("Approve error:", error);

        alert(
            "Cannot connect to backend server."
        );
    }
}


async function rejectRequest(requestId) {

    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "index.html";
        return;
    }

    const reason = prompt(
        "Enter the reason for rejecting this outpass:"
    );

    if (reason === null) {
        return;
    }

    if (!reason.trim()) {
        alert("Rejection reason is required.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/mentor/requests/${requestId}/reject`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    reason: reason.trim()
                })
            }
        );

        const data = await response.json();

        console.log("Reject response:", data);

        if (!response.ok) {
            alert(data.detail || "Unable to reject request.");
            return;
        }

        alert(
            "Outpass rejected successfully!\n\n" +
            "Request ID: " + data.request_id
        );

        loadMentorRequests();

    } catch (error) {

        console.error("Reject error:", error);

        alert(
            "Cannot connect to backend server."
        );
    }
}