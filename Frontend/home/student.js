document.addEventListener("DOMContentLoaded", function () {

    const outpassForm = document.getElementById("outpassForm");

    if (!outpassForm) {
        console.error("outpassForm not found");
        return;
    }

    outpassForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const studentName = document.getElementById("studentName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const department = document.getElementById("department").value;
        const year = document.getElementById("year").value;

        const destination = document.getElementById("destination").value.trim();
        const reason = document.getElementById("reason").value.trim();

        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        const outTime = document.getElementById("outTime").value;
        const returnTime = document.getElementById("returnTime").value;

        const requestType = document.getElementById("requestType").value;

        const remarks = document.getElementById("remarks").value.trim();


        // Required fields validation

        if (
            studentName === "" ||
            studentId === "" ||
            department === "" ||
            year === "" ||
            destination === "" ||
            reason === "" ||
            fromDate === "" ||
            toDate === "" ||
            outTime === "" ||
            returnTime === "" ||
            requestType === ""
        ) {
            alert("Please fill all required fields.");
            return;
        }


        // Date validation

        if (toDate < fromDate) {
            alert("Return date cannot be before the outpass date.");
            return;
        }


        // Time validation

        if (
            fromDate === toDate &&
            returnTime <= outTime
        ) {
            alert("Expected return time must be later than out time.");
            return;
        }


        // Get existing requests

        let requests = JSON.parse(
            localStorage.getItem("outpassRequests")
        ) || [];


        // Create request ID

        const requestId =
            "OUT" + String(Date.now()).slice(-6);


        // Create new request

        const newRequest = {

            id: requestId,

            studentName: studentName,

            studentId: studentId,

            department: department,

            year: year,

            destination: destination,

            reason: reason,

            fromDate: fromDate,

            toDate: toDate,

            outTime: outTime,

            returnTime: returnTime,

            requestType: requestType,

            remarks: remarks,

            status: "Pending",

            submittedAt: new Date().toLocaleString()
        };


        // Add request

        requests.push(newRequest);


        // Save request

        localStorage.setItem(
            "outpassRequests",
            JSON.stringify(requests)
        );


        // Success message

        alert(
            "Outpass request submitted successfully!\n\n" +
            "Request ID: #" + requestId +
            "\nStatus: Pending"
        );


        // Clear form

        outpassForm.reset();


        // Open My Requests

        window.location.href = "my-requests.html";

    });

});