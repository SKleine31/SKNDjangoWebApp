
let allStudents = [];

const studentSearch = document.getElementById("student-search");
const programFilter = document.getElementById("program-filter");
const clearFilters = document.getElementById("clear-filters");
const refreshStudents = document.getElementById("refresh-students");

const studentCount = document.getElementById("student-count");
const resultCount = document.getElementById("result-count");
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const studentTableBody = document.getElementById("student-table-body");


async function loadStudents() {
    loadingMessage.textContent = "Loading students...";
    errorMessage.textContent = "";
    refreshStudents.disabled = true;

    try {
        const response = await fetch("/api/students/");

        if (response.status === 401) {
            throw new Error("You must be logged in to access student data.");
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        allStudents = data.students;

        studentCount.textContent = data.count;

        populateProgramFilter();
        renderStudents();

        loadingMessage.textContent = "";

    } catch (error) {
        console.error("Error loading students:", error);

        studentCount.textContent = "0";
        resultCount.textContent = "Showing 0 students";
        studentTableBody.innerHTML = "";

        loadingMessage.textContent = "";
        errorMessage.textContent = `Error loading students: ${error.message}`;

    } finally {
        refreshStudents.disabled = false;
    }
}


function populateProgramFilter() {
    const currentValue = programFilter.value;

    const programs = [...new Set(
        allStudents.map(student => student.program)
    )].sort();

    programFilter.innerHTML = '<option value="">All programs</option>';

    programs.forEach(program => {
        const option = document.createElement("option");

        option.value = program;
        option.textContent = program;

        programFilter.appendChild(option);
    });

    if (programs.includes(currentValue)) {
        programFilter.value = currentValue;
    }
}


function renderStudents() {
    const searchText = studentSearch.value.toLowerCase().trim();
    const selectedProgram = programFilter.value;

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch =
            student.student_name.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText);

        const matchesProgram =
            selectedProgram === "" ||
            student.program === selectedProgram;

        return matchesSearch && matchesProgram;
    });

    studentTableBody.innerHTML = "";

    if (filteredStudents.length === 0) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="5">No students match the current filters.</td>
        `;

        studentTableBody.appendChild(row);

    } else {
        filteredStudents.forEach(student => {
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
    }

    resultCount.textContent =
        `Showing ${filteredStudents.length} students`;
}


studentSearch.addEventListener("input", renderStudents);

programFilter.addEventListener("change", renderStudents);


clearFilters.addEventListener("click", () => {
    studentSearch.value = "";
    programFilter.value = "";

    renderStudents();
});


refreshStudents.addEventListener("click", loadStudents);


document.addEventListener("DOMContentLoaded", loadStudents);
