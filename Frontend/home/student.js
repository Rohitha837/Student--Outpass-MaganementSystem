// ============================================================
// STUDENT OUTPASS
// ============================================================

const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", function () {

    const outpassForm = document.getElementById("outpassForm");

    if (!outpassForm) {
        console.error("❌ outpassForm not found");
        return;
    }

    console.log("✅ Apply Outpass page loaded");


    // --------------------------------------------------------
    // Submit Form
    // --------------------------------------------------------

    outpassForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("✅ Submit button clicked");


        // ----------------------------------------------------
        // Check login
        // ----------------------------------------------------

        const token = localStorage.getItem("access_token");

        if (!token) {

            alert("Please login first.");

            window.location.href = "index.html";

            return;
        }


        // ----------------------------------------------------
        // Get values
        // ----------------------------------------------------

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

        const requestType =
            document.getElementById("requestType").value;

        const remarksElement =
            document.getElementById("remarks");

        const remarks =
            remarksElement
                ? remarksElement.value.trim()
                : "";


        // ----------------------------------------------------
        // Validation
        // ----------------------------------------------------

        if (
            !destination ||
            !reason ||
            !fromDate ||
            !toDate ||
            !outTime ||
            !returnTime ||
            !requestType
        ) {

            alert("Please fill all required fields.");

            return;
        }


        if (toDate < fromDate) {

            alert("To Date cannot be before From Date.");

            return;
        }


        if (
            fromDate === toDate &&
            returnTime <= outTime
        ) {

            alert(
                "Expected Return Time must be later than Out Time."
            );

            return;
        }


        if (
            requestType === "emergency" &&
            !remarks
        ) {

            alert(
                "Please provide the emergency reason in Additional Remarks."
            );

            return;
        }


        // ----------------------------------------------------
        // Backend data
        // ----------------------------------------------------

        const outpassData = {

            destination: destination,

            from_date: fromDate,

            to_date: toDate,

            out_time: outTime,

            return_time: returnTime,

            request_type: requestType,

            reason: reason,

            emergency_reason:
                requestType === "emergency"
                    ? remarks
                    : null
        };


        console.log(
            "📤 Sending outpass:",
            outpassData
        );


        // ----------------------------------------------------
        // Submit button
        // ----------------------------------------------------

        const submitButton =
            outpassForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";
        }


        try {

            // ------------------------------------------------
            // POST request
            // ------------------------------------------------

            const response = await fetch(
                `${API_URL}/outpasses/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(outpassData)
                }
            );


            console.log(
                "📥 Response status:",
                response.status
            );


            const data = await response.json();


            console.log(
                "📥 Backend response:",
                data
            );


            // ------------------------------------------------
            // Unauthorized
            // ------------------------------------------------

            if (response.status === 401) {

                localStorage.removeItem("access_token");
                localStorage.removeItem("token_type");

                alert(
                    "Your login session has expired. Please login again."
                );

                window.location.href = "index.html";

                return;
            }


            // ------------------------------------------------
            // Forbidden
            // ------------------------------------------------

            if (response.status === 403) {

                alert(
                    data.detail ||
                    "You are not allowed to submit this outpass."
                );

                return;
            }


            // ------------------------------------------------
            // Other backend errors
            // ------------------------------------------------

            if (!response.ok) {

                console.error(
                    "❌ Backend error:",
                    data
                );

                alert(
                    data.detail ||
                    "Unable to submit outpass request."
                );

                return;
            }


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            alert(
                "Outpass request submitted successfully!\n\n" +
                "Request ID: " +
                data.request_id +
                "\nStatus: " +
                data.status
            );


            // Clear form
            outpassForm.reset();


            // Go to My Requests
            window.location.href =
                "my-requests.html";


        } catch (error) {

            console.error(
                "❌ Outpass submission error:",
                error
            );

            alert(
                "Cannot connect to the backend server.\n\n" +
                "Please make sure FastAPI is running."
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Outpass Request";
            }
        }

    });

});