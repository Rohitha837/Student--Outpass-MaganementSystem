const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("adminEmail")
                    .value
                    .trim();

            const password =
                document.getElementById("adminPassword")
                    .value;


            if (!email || !password) {

                alert(
                    "Please enter admin email and password."
                );

                return;
            }


            const loginButton =
                adminLoginForm.querySelector(
                    'button[type="submit"]'
                );


            loginButton.disabled = true;

            loginButton.textContent =
                "Signing in...";


            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/auth/admin-login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            identifier: email,
                            password: password
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    let errorMessage =
                        "Admin login failed.";

                    if (
                        typeof data.detail ===
                        "string"
                    ) {
                        errorMessage =
                            data.detail;
                    }

                    else if (
                        Array.isArray(
                            data.detail
                        )
                    ) {
                        errorMessage =
                            data.detail
                                .map(error =>
                                    error.msg ||
                                    JSON.stringify(error)
                                )
                                .join("\n");
                    }

                    alert(errorMessage);

                    return;
                }


                /* Save Admin JWT */

                localStorage.setItem(
                    "admin_access_token",
                    data.access_token
                );

                localStorage.setItem(
                    "admin_token_type",
                    data.token_type
                );


                alert(
                    "Admin login successful!"
                );


                /* Next page will be created next */

                window.location.href =
                    "admin-dashboard.html";

            }

            catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                alert(
                    "Cannot connect to the backend server. " +
                    "Please make sure FastAPI is running."
                );

            }

            finally {

                loginButton.disabled = false;

                loginButton.textContent =
                    "Sign In as Admin";
            }
        }
    );
}