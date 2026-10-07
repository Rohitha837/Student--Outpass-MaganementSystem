// ============================================================
// STUDENT SIGN UP
// ============================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const studentId =
            document.getElementById("student_id").value.trim();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const department =
            document.getElementById("department").value.trim();

        const year =
            Number(document.getElementById("year").value);

        const section =
            document.getElementById("section").value.trim();

        const phoneNumber =
            document.getElementById("phone_number").value.trim();

        const signupButton =
            signupForm.querySelector(
                'button[type="submit"]'
            );


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (
            !studentId ||
            !name ||
            !email ||
            !password ||
            !department ||
            !year ||
            !section ||
            !phoneNumber
        ) {
            alert("Please fill in all fields.");
            return;
        }


        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }


        // ----------------------------------------------------
        // Disable button
        // ----------------------------------------------------

        signupButton.disabled = true;

        signupButton.textContent =
            "Creating Account...";


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/auth/register",
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
            // Handle error
            // ------------------------------------------------

            
            if (!response.ok) {
               let errorMessage = "Registration failed. Please try again.";

             if (typeof data.detail === "string") {
                 errorMessage = data.detail;
            } else if (Array.isArray(data.detail)) {
              errorMessage = data.detail
            .map(error => {
                if (typeof error === "string") {
                    return error;
                }

                if (error.msg) {
                    return error.msg;
                }

                return JSON.stringify(error);
            })
            .join("\n");
    } else if (data.detail) {
        errorMessage = JSON.stringify(data.detail, null, 2);
    }

    alert(errorMessage);
    return;
}

            // ------------------------------------------------
            // Registration successful
            // ------------------------------------------------

            alert(
                "Account created successfully!\n\n" +
                "Your account is waiting for verification."
            );


            // Go to login
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

            signupButton.textContent =
                "Create Account";
        }

    });
}