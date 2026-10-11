// ============================================================
// STUDENT SIGN UP
// ============================================================

const API_URL = "http://127.0.0.1:8000";

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // ----------------------------------------------------
        // Get form values
        // ----------------------------------------------------

        const studentId =
            document.getElementById("student_id").value.trim();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const department =
            document.getElementById("department").value;

        const year =
            Number(document.getElementById("year").value);

        const section =
            document.getElementById("section").value.trim();

        const phoneNumber =
            document.getElementById("phone_number").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirm_password").value;

        const signupButton =
            signupForm.querySelector('button[type="submit"]');


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (
            !studentId ||
            !name ||
            !email ||
            !department ||
            !year ||
            !section ||
            !phoneNumber ||
            !password ||
            !confirmPassword
        ) {
            alert("Please fill in all fields.");
            return;
        }


        // ----------------------------------------------------
        // Password validation
        // ----------------------------------------------------

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }


        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }


        // ----------------------------------------------------
        // Phone validation
        // ----------------------------------------------------

        const phonePattern = /^[0-9]{10,15}$/;

        if (!phonePattern.test(phoneNumber)) {
            alert("Please enter a valid phone number.");
            return;
        }


        // ----------------------------------------------------
        // Disable button
        // ----------------------------------------------------

        signupButton.disabled = true;
        signupButton.textContent = "Creating Account...";


        try {

            // ------------------------------------------------
            // Send registration request
            // ------------------------------------------------

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_id: studentId,
                        name: name,
                        email: email,
                        password: password,
                        department: department,
                        year: year,
                        section: section,
                        phone_number: phoneNumber
                    })
                }
            );


            const data = await response.json();


            // ------------------------------------------------
            // Handle backend errors
            // ------------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    "Registration failed. Please try again.";

                if (typeof data.detail === "string") {

                    errorMessage = data.detail;

                } else if (Array.isArray(data.detail)) {

                    errorMessage = data.detail
                        .map(error => {

                            if (typeof error === "string") {
                                return error;
                            }

                            return error.msg || JSON.stringify(error);

                        })
                        .join("\n");
                }

                alert(errorMessage);
                return;
            }


            // ------------------------------------------------
            // Registration successful
            // ------------------------------------------------

            alert(
                "Account created successfully!\n\n" +
                "Your account is waiting for Admin verification.\n\n" +
                "After verification, you can login."
            );


            // ------------------------------------------------
            // Go to login page
            // ------------------------------------------------

            window.location.href = "index.html";


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert(
                "Cannot connect to the backend server.\n\n" +
                "Please make sure FastAPI is running."
            );

        } finally {

            signupButton.disabled = false;
            signupButton.textContent = "Create Account";

        }

    });

}