document.addEventListener("DOMContentLoaded", function () {

    const requestsTable =
        document.getElementById("requestsTable");

    const statusFilter =
        document.getElementById("statusFilter");


    function getRequests() {

        return JSON.parse(
            localStorage.getItem("outpassRequests")
        ) || [];

    }


    function displayRequests(filter = "all") {

        const requests = getRequests();

        requestsTable.innerHTML = "";


        let filteredRequests = requests;


        if (filter !== "all") {

            filteredRequests = requests.filter(function (request) {

                return request.status.toLowerCase() === filter;

            });

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


        filteredRequests.forEach(function (request) {

            const row =
                document.createElement("tr");


            const type =
                request.requestType === "emergency"
                    ? "Emergency"
                    : "Normal";


            row.innerHTML = `

                <td>
                    #${request.id}
                </td>

                <td>
                    ${request.destination}
                </td>

                <td>
                    ${request.fromDate}
                </td>

                <td>
                    ${request.toDate}
                </td>

                <td>
                    ${type}
                </td>

                <td>

                    <span class="status ${request.status.toLowerCase()}">
                        ${request.status}
                    </span>

                </td>

                <td>

                    <button
                        class="view-btn"
                        onclick="viewRequest('${request.id}')">

                        View

                    </button>

                </td>

            `;


            requestsTable.appendChild(row);

        });

    }


    window.viewRequest = function (requestId) {

        const requests = getRequests();


        const request =
            requests.find(function (item) {

                return item.id === requestId;

            });


        if (!request) {

            alert("Request not found.");

            return;

        }


        alert(

            "OUTPASS DETAILS\n\n" +

            "Request ID: #" + request.id +

            "\nStudent Name: " + request.studentName +

            "\nStudent ID: " + request.studentId +

            "\nDepartment: " + request.department +

            "\nYear: " + request.year +

            "\nDestination: " + request.destination +

            "\nReason: " + request.reason +

            "\nFrom Date: " + request.fromDate +

            "\nTo Date: " + request.toDate +

            "\nOut Time: " + request.outTime +

            "\nReturn Time: " + request.returnTime +

            "\nType: " +

            (request.requestType === "emergency"
                ? "Emergency"
                : "Normal") +

            "\nStatus: " + request.status +

            "\nRemarks: " + request.remarks

        );

    };


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                displayRequests(this.value);

            }
        );

    }


    displayRequests();

});