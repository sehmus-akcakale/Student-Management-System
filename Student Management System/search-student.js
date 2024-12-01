import { courses, students } from './store.js';

const student_search_button = document.getElementById("search-student");
const student_details = document.getElementById("student-details");


function search_student() {
    student_details.innerHTML = "";
    const student_id = document.getElementById("search-student-id-section").value;
    if (!student_id) {
        alert("You have to first add a student");
        return;
    }
    const student = students.find(student => student.student_id === student_id);
    const student_courses = student.registered_courses;

    // general information about children 
    let student_values = `
        <h3>General Informations</h3>
        <p><strong>Student ID</strong>: ${student.student_id}</p>
        <p><strong>Student Name</strong>: ${student.student_name}</p>
        <p><strong>Student Email</strong>: ${student.student_email}</p>
        <p><strong>Student GPA</strong>: ${student.student_GPA}</p>
    `;
    let student_detail = document.createElement("div");
    student_detail.className = "student-general-details";
    student_detail.innerHTML = student_values;
    student_details.appendChild(student_detail);

    for (let course_code of student_courses) {

        const course_info = courses.find(course => course.course_code === course_code);
        const student_information = course_info["registered_students"].find(student => student.student_id === student_id);

        let course_values = `
            <div class="course-informations">
                <h3>Course Informations</h3>
                <p><strong>Course Code</strong>: ${course_info.course_code}</p>
                <p><strong>Course Name</strong>: ${course_info.course_name}</p>
                <p><strong>Course Instructor</strong>: ${course_info.course_instructor}</p>  
                <p><strong>Course Credit</strong>: ${course_info.course_credit}</p>
            </div>
            <div class="student-course-information">
                <p><strong>Midterm</strong>: ${student_information.student_midterm}</p>
                <p><strong>Final</strong>: ${student_information.student_final}</p>
                <p><strong>Final Grade</strong>: <span style="color: ${student_information.student_letter_grade === "F" ? "red" : "blue"};">
                    ${student_information.student_letter_grade}
                </span></p>
            </div>`;

        // each course detail about the studen
        let course_detail = document.createElement("div");
        course_detail.className = "student-course-detail";
        course_detail.innerHTML = course_values;
        student_details.appendChild(course_detail);
    }

}
student_search_button.addEventListener("click", search_student);