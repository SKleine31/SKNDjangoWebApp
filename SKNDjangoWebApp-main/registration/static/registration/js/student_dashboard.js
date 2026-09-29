async function loadStudents() {
    const studentTableBody = document.getElementById("student-table-body");
    const studentCount = document.getElementById("student-count");
    const message = document.getElementById("dashboard-message");

    try {
        message.textContent = "Loading students...";

        const response = await fetch("/api/students/");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        studentCount.textContent = data.count;
        studentTableBody.innerHTML = "";

        if (data.students.length === 0) {
            message.textContent = "No student records found.";
            return;
        }

        message.textContent = "";

        data.students.forEach(student => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.student_name}</td>
                <td>${student.program}</td>
                <td>${student.year_level}</td>
                <td>${student.email}</td>
            `;

            studentTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading students:", error);

        studentCount.textContent = "0";
        studentTableBody.innerHTML = "";
        message.textContent = `Error loading students: ${error.message}`;
    }
}

document.addEventListener("DOMContentLoaded", loadStudents);