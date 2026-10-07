const API_URL = "http://127.0.0.1:8000";

const requestsTable = document.getElementById("requestsTable");
const statusFilter = document.getElementById("statusFilter");

let allRequests = [];


async function loadRequests() {

    requestsTable.innerHTML = `
        <tr>
            <td colspan="7">
                Loading requests...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            `${API_URL}/outpasses/my-requests`
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail || "Unable to load requests."
            );

        }

        allRequests = data;

        displayRequests();

    } catch (error) {

        console.error("Error loading requests:", error);

        requestsTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load requests.
                </td>
            </tr>
        `;

    }
}


function displayRequests() {

    const selectedStatus = statusFilter.value;

    let filteredRequests = allRequests;


    if (selectedStatus !== "all") {

        filteredRequests = allRequests.filter(
            request =>
                request.status === selectedStatus
        );

    }


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


    requestsTable.innerHTML = "";


    filteredRequests.forEach(request => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                ${request.request_id}
            </td>

            <td>
                ${request.destination}
            </td>

            <td>
                ${request.from_date}
            </td>

            <td>
                ${request.to_date}
            </td>

            <td>
                ${request.request_type}
            </td>

            <td>
                <span class="status ${request.status.toLowerCase()}">
                    ${request.status}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="view-btn"
                    onclick="viewRequest(${request.id})">

                    View

                </button>
            </td>

        `;


        requestsTable.appendChild(row);

    });

}


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

        "Request ID: " + request.request_id +

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


statusFilter.addEventListener(
    "change",
    displayRequests
);


loadRequests();