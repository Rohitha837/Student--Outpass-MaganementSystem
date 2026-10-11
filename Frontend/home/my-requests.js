// ============================================================
// MY REQUESTS
// ============================================================

const API_URL = "http://127.0.0.1:8000";

const requestsTable = document.getElementById("requestsTable");
const statusFilter = document.getElementById("statusFilter");

let allRequests = [];


// ============================================================
// LOAD MY REQUESTS
// ============================================================

async function loadRequests() {

    const token = localStorage.getItem("access_token");

    // No login token
    if (!token) {
        alert("Please login first.");
        window.location.href = "index.html";
        return;
    }

    requestsTable.innerHTML = `
        <tr>
            <td colspan="7" class="no-data">
                Loading requests...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            `${API_URL}/outpasses/my-requests`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();


        // ----------------------------------------------------
        // Session expired / invalid token
        // ----------------------------------------------------

        if (response.status === 401) {

            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");

            alert("Your login session has expired. Please login again.");

            window.location.href = "index.html";

            return;
        }


        // ----------------------------------------------------
        // Other backend errors
        // ----------------------------------------------------

        if (!response.ok) {

            console.error("Backend error:", data);

            throw new Error(
                data.detail || "Unable to load requests."
            );
        }


        // ----------------------------------------------------
        // Store requests
        // ----------------------------------------------------

        allRequests = Array.isArray(data) ? data : [];

        displayRequests();

    } catch (error) {

        console.error(
            "Error loading requests:",
            error
        );

        requestsTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    Unable to load requests.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// DISPLAY REQUESTS
// ============================================================

function displayRequests() {

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "all";


    let filteredRequests = allRequests;


    // --------------------------------------------------------
    // Filter by status
    // --------------------------------------------------------

    if (selectedStatus !== "all") {

        filteredRequests = allRequests.filter(
            request =>
                request.status.toLowerCase() ===
                selectedStatus.toLowerCase()
        );
    }


    // --------------------------------------------------------
    // No requests
    // --------------------------------------------------------

    if (filteredRequests.length === 0) {

        requestsTable.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    No outpass requests found.
                </td>
            </tr>
        `;

        return;
    }


    // --------------------------------------------------------
    // Display requests
    // --------------------------------------------------------

    requestsTable.innerHTML = "";


    filteredRequests.forEach(request => {

        const row = document.createElement("tr");


        const statusClass =
            request.status
                .toLowerCase()
                .replace(/\s+/g, "-");


        row.innerHTML = `
            <td>${request.request_id}</td>

            <td>${request.destination}</td>

            <td>${request.from_date}</td>

            <td>${request.to_date}</td>

            <td>${request.request_type}</td>

            <td>
                <span class="status ${statusClass}">
                    ${request.status}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="view-btn"
                    data-request-id="${request.id}"
                >
                    View
                </button>
            </td>
        `;


        const viewButton =
            row.querySelector(".view-btn");


        viewButton.addEventListener(
            "click",
            function () {
                viewRequest(request.id);
            }
        );


        requestsTable.appendChild(row);
    });
}


// ============================================================
// VIEW REQUEST DETAILS
// ============================================================

function viewRequest(requestId) {

    const request = allRequests.find(
        item => item.id === requestId
    );


    if (!request) {

        alert("Request not found.");

        return;
    }


    alert(
        "OUTPASS DETAILS\n\n" +

        "Request ID: " +
        request.request_id +

        "\nDestination: " +
        request.destination +

        "\nFrom Date: " +
        request.from_date +

        "\nTo Date: " +
        request.to_date +

        "\nOut Time: " +
        request.out_time +

        "\nReturn Time: " +
        request.return_time +

        "\nRequest Type: " +
        request.request_type +

        "\nReason: " +
        request.reason +

        "\nStatus: " +
        request.status
    );
}


// ============================================================
// STATUS FILTER
// ============================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        displayRequests
    );
}


// ============================================================
// INITIAL LOAD
// ============================================================

loadRequests();