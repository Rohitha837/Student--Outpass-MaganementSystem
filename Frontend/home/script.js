const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");
    const roleError = document.getElementById("roleError");

    usernameError.textContent = "";
    passwordError.textContent = "";
    roleError.textContent = "";

    let isValid = true;

    if (username === "") {
        usernameError.textContent = "Username is required.";
        isValid = false;
    }

    if (password === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    }

    if (role === "") {
        roleError.textContent = "Please select your role.";
        isValid = false;
    }

    if (isValid) {
        alert("Login form is valid!");
    }
});
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }
});
