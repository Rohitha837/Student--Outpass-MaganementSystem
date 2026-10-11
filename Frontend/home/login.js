const API_URL = "http://127.0.0.1:8000";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const identifier = document
            .getElementById("identifier")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        // Basic validation
        if (!identifier || !password) {
            alert("Please enter Student ID/email and password.");
            return;
        }

        const loginButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Login failed.");
                return;
            }

            // Store JWT token
            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "token_type",
                data.token_type
            );

            alert("Login successful!");

            // Go to student dashboard
            window.location.href = "student-dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Cannot connect to the backend. " +
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