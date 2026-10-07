const token = localStorage.getItem("admin_access_token");

if (!token) {
    window.location.href = "admin-login.html";
}

const studentsTableBody = document.getElementById("studentsTableBody");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");
const pendingStudents = document.getElementById("pendingStudents");
const refreshBtn = document.getElementById("refreshBtn");
const logoutBtn = document.getElementById("logoutBtn");


async function loadPendingStudents() {
    loadingMessage.hidden = false;
    errorMessage.hidden = true;
    emptyMessage.hidden = true;

    studentsTableBody.innerHTML = "";

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/admin/students/pending",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to load pending students."
            );
        }

        loadingMessage.hidden = true;

        pendingStudents.textContent = data.length;

        if (data.length === 0) {
            emptyMessage.hidden = false;
            return;
        }

        data.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.student_id || "-"}</td>
                <td>${student.name || "-"}</td>
                <td>${student.email || "-"}</td>
                <td>${student.department || "-"}</td>
                <td>${student.year || "-"}</td>
                <td>${student.section || "-"}</td>
                <td>${student.phone_number || "-"}</td>
                <td>
                    <button
                        type="button"
                        class="verify-btn"
                        data-id="${student.id}"
                    >
                        Verify
                    </button>
                </td>
            `;

            studentsTableBody.appendChild(row);
        });

        addVerifyButtonListeners();

    } catch (error) {
        console.error("Load students error:", error);

        loadingMessage.hidden = true;

        errorMessage.textContent = error.message;
        errorMessage.hidden = false;
    }
}


function addVerifyButtonListeners() {
    const verifyButtons = document.querySelectorAll(".verify-btn");

    verifyButtons.forEach(button => {
        button.addEventListener("click", async function () {

            const studentId = this.dataset.id;

            const confirmVerification = confirm(
                "Are you sure you want to verify this student?"
            );

            if (!confirmVerification) {
                return;
            }

            this.disabled = true;
            this.textContent = "Verifying...";

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/admin/students/${studentId}/verify`,
                    {
                        method: "PATCH",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Unable to verify student."
                    );
                }

                alert("Student verified successfully!");

                await loadPendingStudents();

            } catch (error) {
                console.error("Verify student error:", error);

                alert(error.message);

                this.disabled = false;
                this.textContent = "Verify";
            }
        });
    });
}


refreshBtn.addEventListener("click", loadPendingStudents);


logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_token_type");

    window.location.href = "admin-login.html";
});


loadPendingStudents();