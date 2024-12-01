import { courses, students } from './store.js';
import { add_course_option, add_student_option } from './add-options-section.js';
import { recalculate_GPA } from './register-student.js';

// Student Buttons for CRUD Operations 
const add_student_btn = document.getElementById("add-student");
const update_student_btn = document.getElementById("update-student");
const delete_student_btn = document.getElementById("delete-student");

// Course Buttons for CRUD Operations 
const add_course_btn = document.getElementById("add-course");
const update_course_btn = document.getElementById("update-course");
const delete_course_btn = document.getElementById("delete-course");


// To clear inputs after adding a course or a student 
const clear_inputs = (css_selector) => {
    let input_fields = document.querySelectorAll(css_selector);
    input_fields.forEach(input_field => {
        input_field.value = "";
    });
}


function add_course(event) {
    const course_code = document.getElementById("course-code").value.trim();
    const course_name = document.getElementById("course-name").value.trim();
    const course_instructor = document.getElementById("course-instructor").value.trim();
    const course_description = document.getElementById("course-description").value.trim();
    const course_credit = document.getElementById("course-credit");
    const course_capacity = document.getElementById("course-capacity");
    const course_grading_scale = Number(document.getElementById("course-grading-scale").value);

    if (!course_code || !course_name || !course_instructor || !course_description || !course_credit || !course_capacity || !course_grading_scale) {
        alert("Please fill all fields");
        return;
    }
    if (!course_credit.checkValidity()) {
        alert("credit must be between 1 and 10");
        return;
    }
    if (!course_capacity.checkValidity()) {
        alert("capacity must be between 10 and 100");
        return;
    }
    // Check by course code 
    const course_exists = courses.find(course => course.course_code === course_code);
    if (course_exists) {
        alert("Course already exists");
        return;
    }
    const course = {
        course_code: course_code,
        course_name: course_name,
        course_instructor: course_instructor,
        course_description: course_description,
        course_credit: Number(course_credit.value),
        course_capacity: Number(course_capacity.value),
        course_grading_scale: course_grading_scale,
        registered_students: []
    }
    courses.push(course);
    clear_inputs("#course-crud-section input");
    // add course option to another 
    add_course_option(course_code, course_name);
    alert("Course added successfully");
}
function update_course(event) {
    const course_code = document.getElementById("update-course-select").value;
    const new_name = document.getElementById("update-course-name").value.trim();
    const new_instructor = document.getElementById("update-course-instructor").value.trim();
    const new_description = document.getElementById("update-course-description").value.trim();
    const new_credit = Number(document.getElementById("update-course-credit").value);
    const new_capacity = Number(document.getElementById("update-course-capacity").value);
    const course = courses.find(course => course.course_code === course_code);
    if (!course) {
        alert("Add Course First");
        return;
    }

    if (new_capacity && new_capacity < course.registered_students.length) {
        alert(`Cannot reduce capacity below current enrollment (${course.registered_students.length} students)`);
        return;
    }

    const old_credit = course.course_credit;

    if (new_name) {
        course.course_name = new_name;
    }
    if (new_instructor) {
        course.course_instructor = new_instructor;
    }
    if (new_description) {
        course.course_description = new_description;
    }
    if (new_credit) {
        course.course_credit = new_credit;
    }
    if (new_capacity) {
        course.course_capacity = new_capacity;
    }



    // If credit changed we must recalculate the GPA
    if (new_credit && new_credit !== old_credit) {
        course.registered_students.forEach(enrolled_student => {
            const student = students.find(student => student.student_id === enrolled_student.student_id);
            if (student) {
                student.student_GPA = recalculate_GPA(student.student_id);
            }
        });
    }

    // Update options with new Course Code and new Course Name 
    document.querySelectorAll(`option[value="${course_code}"]`).forEach(option => {
        option.textContent = `${course_code} - ${course.course_name}`;
    });

    clear_inputs("#course-crud-section input");
    alert("Course updated successfully");
}

function delete_course(event) {
    const course_code = document.getElementById("delete-course-select").value;

    const course = courses.find(course => course.course_code === course_code);
    if (!course) {
        alert("Add Course First");
        return;
    }

    // get all the student ID that registered the course
    const course_registered_students = course.registered_students.map(student => student.student_id);

    for (let student of students) {
        student.registered_courses = student.registered_courses.filter(code => code !== course_code);
        // Recalculate the GPA for student that registered the course
        if (course_registered_students.includes(student.student_id)) {
            student.student_GPA = recalculate_GPA(student.student_id);
        }
    }

    // Delete the course from courses
    const courseIndex = courses.findIndex(course => course.course_code === course_code);
    if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
    }

    // Remove all the options for that course
    document.querySelectorAll(`option[value="${course_code}"]`).forEach(option => {
        option.remove();
    });

    alert("Course deleted successfully");
}


function add_student(event) {
    event.preventDefault();
    const student_id = document.getElementById("student-id").value.trim();
    const student_name = document.getElementById("student-name").value.trim();
    const student_surname = document.getElementById("student-surname").value.trim();
    const student_email = document.getElementById("student-email");
    const student_email_value = student_email.value.trim();


    if (!student_id || !student_name || !student_surname || !student_email.value.trim()) {
        alert("Please fill all fields");
        return;
    }

    if (student_id.length !== 9) {
        alert("Student ID must be 9 digits");
        return;
    }

    // https://www.w3schools.com/js/js_validation_api.asp 
    if (!student_email.checkValidity()) {
        alert("Invalid email");
        return;
    }
    // email and student id should be unique 
    const student_exists = students.find(student => student.student_id === student_id);
    const email_exists = students.find(student => student.student_email === student_email_value);

    if (student_exists) {
        alert("Student already exists");
        return;
    }
    if (email_exists) {
        alert("Email already exists");
        return;
    }

    const student = {
        student_id: student_id,
        student_name: student_name,
        student_surname: student_surname,
        student_email: student_email_value,
        student_GPA: 0,
        registered_courses: []
    }
    students.push(student);
    clear_inputs("#student-crud-section input");
    alert("Student added successfully");
    add_student_option(student_id, student_name, student_surname);
}

function update_student(event) {
    const student_id = document.getElementById("update-student-select").value;
    const new_name = document.getElementById("update-student-name").value.trim();
    const new_surname = document.getElementById("update-student-surname").value.trim();
    const new_email = document.getElementById("update-student-email").value.trim();

    const student = students.find(student => student.student_id === student_id);
    if (!student) {
        alert("First add Student");
        return;
    }

    if (new_name) {
        student.student_name = new_name;
    }

    if (new_surname) {
        student.student_surname = new_surname;
    }

    if (new_email) {
        // is the new email exist in the other student
        const email_exists = students.find(student => student.student_id !== student_id && student.student_email === new_email);
        if (email_exists) {
            alert("Email already exists");
            return;
        }
        student.student_email = new_email;
    }

    // courses have full_name propery so it have to be updated
    const fullname = `${student.student_name} ${student.student_surname}`;
    for (let course_code of student.registered_courses) {
        const course = courses.find(course => course.course_code === course_code);
        if (course) {
            const student_in_course = course.registered_students.find(student => student.student_id === student_id);
            if (student_in_course) {
                student_in_course.student_fullname = fullname;
            }
        }
    }

    // Change all the options with new values
    document.querySelectorAll(`option[value="${student_id}"]`).forEach(option => {
        option.textContent = `${student_id} - ${fullname}`;
    });

    clear_inputs("#student-crud-section input");
    alert("Student updated successfully");

}
function delete_student(event) {
    const student_id = document.getElementById("delete-student-select").value;

    const student = students.find(student => student.student_id === student_id);
    if (!student) {
        alert("First add student");
        return;
    }

    // For all course that student register it have to be deleted
    for (let course_code of student.registered_courses) {
        const course = courses.find(course => course.course_code === course_code);
        if (course) {
            course.registered_students = course.registered_students.filter(course_student => course_student.student_id !== student_id);
        }
    }

    // Delete student from students list 
    const student_index = students.findIndex(student => student.student_id === student_id);
    if (student_index !== -1) {
        students.splice(student_index, 1);
    }

    // Delete all the options for student
    document.querySelectorAll(`option[value="${student_id}"]`).forEach(option => {
        option.remove();
    });

    alert("Student deleted successfully");

}

// Student crud buttons
add_student_btn.addEventListener("click", add_student);
update_student_btn.addEventListener("click", update_student);
delete_student_btn.addEventListener("click", delete_student);

// Course crud buttons 
add_course_btn.addEventListener("click", add_course);
update_course_btn.addEventListener("click", update_course)
delete_course_btn.addEventListener("click", delete_course)

