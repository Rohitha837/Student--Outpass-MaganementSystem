// ============================================================
// STUDENT LOGIN
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // ----------------------------------------------------
        // Get form values
        // ----------------------------------------------------

        const identifier = document
            .getElementById("identifier")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (!identifier || !password) {
            alert("Please enter Student ID/email and password.");
            return;
        }

        // ----------------------------------------------------
        // Disable button while logging in
        // ----------------------------------------------------

        const loginButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        try {

            // ------------------------------------------------
            // Send login request to FastAPI
            // ------------------------------------------------

            const response = await fetch(
                "http://127.0.0.1:8000/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        identifier: identifier,
                        password: password
                    })
                }
            );

            const data = await response.json();

            // ------------------------------------------------
            // Handle error
            // ------------------------------------------------

            if (!response.ok) {

                alert(
                    data.detail ||
                    "Login failed. Please try again."
                );

                return;
            }

            // ------------------------------------------------
            // Store JWT token
            // ------------------------------------------------

            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "token_type",
                data.token_type
            );

            // ------------------------------------------------
            // Login successful
            // ------------------------------------------------

            alert("Login successful!");

            window.location.href =
                "student-dashboard.html";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Cannot connect to the backend server. " +
                "Please make sure FastAPI is running."
            );

        } finally {

            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        }
    });
}