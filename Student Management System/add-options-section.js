// For course options 
const update_course_options = document.getElementById("update-course-select");
const delete_course_options = document.getElementById("delete-course-select");
const courses_options = document.getElementById("course-code-section");
const search_courses_options = document.getElementById("search-course-code-section");

// For student options
const update_student_options = document.getElementById("update-student-select");
const delete_student_options = document.getElementById("delete-student-select");
const students_options = document.getElementById("student-id-section");
const search_students_options = document.getElementById("search-student-id-section");

// Adds course option when new course is added 
const add_course_option = (course_code, course_name) => {
    let option = document.createElement("option");
    option.value = course_code;
    option.text = course_code + " - " + course_name;
    courses_options.appendChild(option);
    // Clone the options to not get any conflicted
    search_courses_options.appendChild(option.cloneNode(true));
    update_course_options.appendChild(option.cloneNode(true));
    delete_course_options.appendChild(option.cloneNode(true));
}

// Adds student option when new student is added
const add_student_option = (student_id, student_name, student_surname) => {

    let option = document.createElement("option");
    option.value = student_id;
    option.text = student_id + " - " + student_name + " " + student_surname;
    students_options.appendChild(option);
    // Clone the options to not get any conflicted
    search_students_options.appendChild(option.cloneNode(true));
    update_student_options.appendChild(option.cloneNode(true));
    delete_student_options.appendChild(option.cloneNode(true));

}

// To use methods in course-options-section.js 
export { add_course_option, add_student_option };