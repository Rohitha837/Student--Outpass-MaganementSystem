const outpassForm = document.getElementById("outpassForm");

if (outpassForm) {

    outpassForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const destination =
            document.getElementById("destination").value.trim();

        const reason =
            document.getElementById("reason").value.trim();

        const fromDate =
            document.getElementById("fromDate").value;

        const toDate =
            document.getElementById("toDate").value;

        const outTime =
            document.getElementById("outTime").value;

        const returnTime =
            document.getElementById("returnTime").value;

        const emergency =
            document.getElementById("emergency").checked;


        // Basic validation

        if (destination === "") {
            alert("Please enter destination.");
            return;
        }

        if (reason === "") {
            alert("Please enter the reason.");
            return;
        }

        if (fromDate === "") {
            alert("Please select From Date.");
            return;
        }

        if (toDate === "") {
            alert("Please select To Date.");
            return;
        }

        if (outTime === "") {
            alert("Please select Out Time.");
            return;
        }

        if (returnTime === "") {
            alert("Please select Return Time.");
            return;
        }


        // Date validation

        if (toDate < fromDate) {
            alert("To Date cannot be before From Date.");
            return;
        }


        // Time validation for same day

        if (fromDate === toDate && returnTime <= outTime) {
            alert("Return Time must be after Out Time.");
            return;
        }


        // Success message

        if (emergency) {

            alert(
                "Emergency outpass request submitted successfully!"
            );

        } else {

            alert(
                "Outpass request submitted successfully!"
            );
        }


        // Clear form

        outpassForm.reset();

    });
}