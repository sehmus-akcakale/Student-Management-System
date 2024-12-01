import { courses, students } from "./store.js";
import { calculate_letter_grade, recalculate_GPA } from "./register-student.js";


// All the buttons for course details
const view_button = document.getElementById("view-course-details");
const course_details = document.querySelector(".view-course-details");
var delete_course_student_button;
var update_course_student_button;
var all_student_button;
var passed_student_button;
var failed_student_button;
var course_detail_button;
var change_grading_scale_button;

let current_course;

// After selecting one option from our button we delete the before result
const delete_existing_container = () => {
    const existingContainer_1 = course_details.querySelector('.course-option-result');
    if (existingContainer_1) {
        existingContainer_1.remove();
    }
    const existingContainer_2 = course_details.querySelector('.option-result-output');
    if (existingContainer_2) {
        existingContainer_2.remove();
    }

}

// General function for student information with given condition
const append_student_information = (condition) => {
    if (!current_course) {
        alert("You have to add a course first");
        return;
    }
    const course = current_course;
    let students;

    switch (condition) {
        case "all":
            students = course.registered_students;
            break;
        case "passed":
            students = course.registered_students.filter(student => student.student_letter_grade !== "F");
            break;
        case "failed":
            students = course.registered_students.filter(student => student.student_letter_grade === "F");
            break;
        default:
            console.log("default");
            break;
    }
    // Student informations 
    let student_info = `
   
        <h3 class="option-result-header">Informations</h3>
        <table>
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Midterm</th>
                    <th>Final</th>
                    <th>Final Grade</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {

        return `
                        <tr>
                            <td>${student.student_id}</td>
                            <td>${student.student_fullname}</td>
                            <td>${student.student_midterm}</td>
                            <td>${student.student_final}</td>
                            <td style="color: ${student.student_letter_grade === 'F' ? 'red' : 'blue'};">
                                ${student.student_letter_grade}
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
   
`;
    delete_existing_container();
    const result_container = document.createElement('div');
    result_container.className = 'course-option-result';
    result_container.innerHTML = student_info;
    course_details.appendChild(result_container);

}


// Course Detailed information about the selecting course
const append_course_information = (course) => {
    let course_info = `
        <h3>Course Informations</h3>
        <p>Course Code: ${course.course_code}</p>
        <p>Course Name: ${course.course_name}</p>
        <p>Course Instructor: ${course.course_instructor}</p>
        <p>Course Description: ${course.course_description}</p>
        <p>Course Credit: ${course.course_credit}</p>
        <p>Course Capacity: ${course.course_capacity}</p>
        <p>Course Grading Scale: ${course.course_grading_scale}</p>
    `;

    let course_detail = document.createElement("div");
    course_detail.className = "course-detail";
    course_detail.innerHTML = course_info;
    course_details.appendChild(course_detail);
}

// Part for deleting and updating student information
const append_general_part = (course) => {
    // adding registered student information to the options
    let options = "";
    for (let student of course.registered_students) {
        options += `<option value="${student.student_id}">${student.student_id} - ${student.student_fullname}</option>`;
    }

    let info = `
            <summary>Update/Delete Student Information</summary>
            <details>
                <summary>Update Student Information</summary>
                <div id="update-student-information">
                    <label for="update-information">Students</label>
                    <select name="update-information" id="update-information">
                        ${options}
                    </select>
                    
                    <div class="update-student-section-detail">
                        <label for="update-student-midterm">Midterm Result</label>
                        <input type="number" 
                            min="0" 
                            max="100" 
                            name="update-student-midterm" 
                            id="update-student-midterm"
                            required>
                    </div>
                    
                    <div class="update-student-section-detail">
                        <label for="update-student-final">Final Result</label>
                        <input type="number" 
                            min="0" 
                            max="100" 
                            name="update-student-final" 
                            id="update-student-final"
                            required>
                    </div>
                    <button class="update-course-student">Update Student</button>
                </div>
            </details>
            <details>
                <summary>Delete Student Information</summary>
                <div id="delete-student-information">
                    <label for="delete-information">Students</label>
                    <select name="delete-information" id="delete-information">
                        ${options}
                    </select>
                    <button class="delete-course-student">Delete Student</button>
                </div>
            </details>


    ` ;
    let details_container = document.createElement("details");
    details_container.innerHTML = info;
    course_details.appendChild(details_container);

}

// Course options buttons 
const append_student_part = () => {
    let student_info = `
                <div class="view-course-options">
                    <button class="get-all-student">All Student</button>
                    <button class="get-passed-student">Passed Student</button>
                    <button class="get-failed-student">Failed Student</button>
                    <button class="get-course-detail">Course Detail</button>
                    <button class="change-course-grading-scale">Change Grading Scale</button>
                </div>
                <div class="course-option-result">

                </div>
    `;

    let course_output_view = document.createElement("div");
    course_output_view.className = "course-output-view";
    course_output_view.innerHTML = student_info;
    course_details.appendChild(course_output_view);

}

// I calculated the mean score for all student if needed I can make it for only 
// passed student or failed student
const append_course_detail = () => {
    if (!current_course) {
        alert("You have to add a course first");
        return;
    }
    const course = current_course;
    let numberOfPassedStudent = 0;
    let numberOfFailedStudent = 0;
    let totalScore = 0;
    let numberOfStudent = course.registered_students.length;
    for (let student of course.registered_students) {
        totalScore += (student.student_midterm * 0.4 + student.student_final * 0.6);
        if (student.student_letter_grade === "F") {
            numberOfFailedStudent++;
        } else {
            numberOfPassedStudent++;
        }
    }
    // if no one registered the course mean is equal to zero
    let mean;
    if (numberOfStudent === 0) {
        mean = 0;
    } else {
        mean = totalScore / numberOfStudent;
    }
    let info = `
        <p>Number of Passed Student: ${numberOfPassedStudent}</p>
        <p>Number of Failed Student: ${numberOfFailedStudent}</p>
        <p>Mean Score of the Entire Class: ${mean}</p>
    `;

    delete_existing_container();
    const result_container = document.createElement('div');
    result_container.className = 'option-result-output';
    result_container.innerHTML = info;
    course_details.appendChild(result_container);

}

// Changing grading scale and recalculate the GPA of student that registered the course
const change_grading_scale = () => {

    let new_grading_scale = current_course.course_grading_scale === 7 ? 10 : 7;
    current_course.course_grading_scale = new_grading_scale;

    // Last p element have grading scale so I need to rechange it 
    const pElements = document.querySelectorAll('.course-detail > p');
    const lastP = pElements[pElements.length - 1];
    if (lastP) {
        lastP.textContent = `Course Grading Scale: ${new_grading_scale}`;
    }

    for (let course_student of current_course.registered_students) {
        // it would be better approach when old letter grade not equal to the new grade so
        // I could impelent it if needed
        course_student.student_letter_grade = calculate_letter_grade(course_student.student_midterm, course_student.student_final, new_grading_scale);
        let student = students.find(student => student.student_id === course_student.student_id);
        if (student) {
            student.student_GPA = recalculate_GPA(student.student_id);
        }
    }
    delete_existing_container();
    alert("Grading Scale Has Been Changed");
}

const update_course_student = () => {
    const student_id = document.getElementById("update-information").value;
    const midterm = document.getElementById("update-student-midterm");
    const final = document.getElementById("update-student-final");
    const midterm_value = Number(midterm.value);
    const final_value = Number(final.value);
    if (!midterm || !final) {
        alert("Please fill all fields");
        return;
    }
    if (!midterm.checkValidity()) {
        alert("midterm result must be between 0 and 100");
        return;
    }
    if (!final.checkValidity()) {
        alert("final result must be between 0 and 100");
        return;
    }
    const course = current_course;
    const course_student = course.registered_students.find(student => student.student_id === student_id);
    if (!course_student) {
        alert("Student not found");
        return;
    }
    // change the values and recalculate the GPA
    course_student.student_midterm = midterm_value;
    course_student.student_final = final_value;
    course_student.student_letter_grade = calculate_letter_grade(midterm_value, final_value, course.course_grading_scale);
    const student = students.find(student => student.student_id === course_student.student_id);
    if (student) {
        student.student_GPA = recalculate_GPA(student.student_id);
    }
    delete_existing_container();
    alert("Student Information Has Been Updated");
}

const delete_course_student = () => {
    const student_id = document.getElementById("delete-information").value;
    const course = current_course;
    // After deleting information we need to delete the student options 
    const deleted_option = document.querySelector("#delete-student-information option[value='" + student_id + "']");
    if (deleted_option) {
        deleted_option.remove();
    }
    const updated_option = document.querySelector("#update-student-information option[value='" + student_id + "']")
    if (updated_option) {
        updated_option.remove();
    }
    const course_student = course.registered_students.find(student => student.student_id === student_id);
    if (!course_student) {
        alert("Student not found");
        return;
    }
    // After Deleting student from course make necessery update
    console.log(students);
    const student = students.find(student => student.student_id === course_student.student_id);
    if (student) {
        student.registered_courses = student.registered_courses.filter(course_code => course_code !== course.course_code);
        student.student_GPA = recalculate_GPA(student.student_id);
    }
    course.registered_students = course.registered_students.filter(student => student.student_id !== student_id);
    delete_existing_container();

    alert("Student Information Has Been Deleted");

}

function view_course_details() {
    course_details.innerHTML = "";
    const course_code = document.getElementById("search-course-code-section").value;
    if (!course_code) {
        alert("You have to first add a course");
        return;
    }
    const course = courses.find(course => course.course_code === course_code);
    current_course = course;

    append_course_information(course);
    append_general_part(course);
    append_student_part(course);

    // Add Buttons after adding the details to the DOM
    all_student_button = document.querySelector(".get-all-student");
    passed_student_button = document.querySelector(".get-passed-student");
    failed_student_button = document.querySelector(".get-failed-student");
    course_detail_button = document.querySelector(".get-course-detail");
    change_grading_scale_button = document.querySelector(".change-course-grading-scale");
    delete_course_student_button = document.querySelector(".delete-course-student");
    update_course_student_button = document.querySelector(".update-course-student");


    // Add event listener after adding the details to the DOM
    all_student_button.addEventListener("click", () => append_student_information("all"));
    passed_student_button.addEventListener("click", () => append_student_information("passed"));
    failed_student_button.addEventListener("click", () => append_student_information("failed"));
    course_detail_button.addEventListener("click", append_course_detail);
    change_grading_scale_button.addEventListener("click", change_grading_scale)
    update_course_student_button.addEventListener("click", update_course_student);
    delete_course_student_button.addEventListener("click", delete_course_student);

}

view_button.addEventListener("click", view_course_details);

