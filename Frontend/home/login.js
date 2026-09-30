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

    let valid = true;

    if (username === "") {
        usernameError.textContent = "Username is required";
        valid = false;
    }

    if (password === "") {
        passwordError.textContent = "Password is required";
        valid = false;
    }

    if (role === "") {
        roleError.textContent = "Please select your role";
        valid = false;
    }

    if (!valid) {
        return;
    }

    if (role === "student") {
        window.location.href = "student-dashboard.html";
    }

    else if (role === "mentor") {
        window.location.href = "mentor-dashboard.html";
    }
    else if (role === "faculty") {
    window.location.href = "class-incharge-dashboard.html";
}

    else if (role === "hod") {
        window.location.href = "hod-dashboard.html";
    }

    else if (role === "admin") {
        window.location.href = "admin-dashboard.html";
    }
});