import { courses, students } from './store.js';

// Midterm - Final Weight
const MIDTERM_WEIGHT = 0.4;
const FINAL_WEIGHT = 0.6;

const register_btn = document.getElementById("add-student-to-course");

// calculate letter grade for given scale 
export const calculate_letter_grade = (midterm_result, final_result, course_grading_scale) => {
    // Calculate the total score
    let total = (midterm_result * MIDTERM_WEIGHT) + (final_result * FINAL_WEIGHT);

    if (course_grading_scale === 10) {
        if (total >= 90) {
            return "A";
        } else if (total >= 80) {
            return "B";
        } else if (total >= 70) {
            return "C";
        } else if (total >= 60) {
            return "D";
        } else {
            return "F";
        }
    } else if (course_grading_scale === 7) {
        if (total >= 93) {
            return "A";
        } else if (total >= 85) {
            return "B";
        } else if (total >= 77) {
            return "C";
        } else if (total >= 70) {
            return "D";
        } else {
            return "F";
        }
    } else {
        return "Invalid grading scale";
    }
}

// formula for calculating GPA
// GPA = Sum of (letter_grade * course_credit) / Sum of course_credit
export const recalculate_GPA = (student_id) => {
    let student = students.find(student => student.student_id === student_id);

    if (!student || !student.registered_courses || student.registered_courses.length === 0) {
        return 0.00;
    }
    let total_credit = 0;
    let total_GPA = 0;
    let course_codes = student.registered_courses;
    for (let course_code of course_codes) {
        const course = courses.find(course => course.course_code === course_code);
        const student_letter_grade = course.registered_students.find(student => student.student_id === student_id).student_letter_grade;
        let letter_grade_value;
        switch (student_letter_grade) {
            case "A":
                letter_grade_value = 4;
                break;
            case "B":
                letter_grade_value = 3;
                break;
            case "C":
                letter_grade_value = 2;
                break;
            case "D":
                letter_grade_value = 1;
                break;
            case "F":
                letter_grade_value = 0;
                break;
            default:
                letter_grade_value = 0;
        }
        total_credit += course.course_credit;
        total_GPA += letter_grade_value * course.course_credit;
    }

    return (total_GPA / total_credit).toFixed(2);

}


function register_student(event) {

    const course_code = document.getElementById("course-code-section").value.trim();
    const student_id = document.getElementById("student-id-section").value.trim();
    const midterm = document.getElementById("add-student-midterm");
    const final = document.getElementById("add-student-final");
    const midterm_result = Number(midterm.value);
    const final_result = Number(final.value);


    if (!course_code || !student_id || !midterm_result || !final_result) {
        alert("Please fill all fields. You may have to first add a course or a student");
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

    const course = courses.find(course => course.course_code === course_code);
    const student = students.find(student => student.student_id === student_id);

    // Course have enough person to add the new student
    if (course.registered_students.length >= course.course_capacity) {
        alert("Course is full");
        return;
    }

    if (student.registered_courses.includes(course_code)) {
        alert("Student already registered to this course");
    } else {
        let letter_grade = calculate_letter_grade(midterm_result, final_result, course.course_grading_scale);
        course.registered_students.push({
            student_id: student_id,
            student_fullname: student.student_name + " " + student.student_surname,
            student_midterm: midterm_result,
            student_final: final_result,
            student_letter_grade: letter_grade
        })
        // add students registered courses to course code and recalculate the GPA 
        student.registered_courses.push(course_code);
        student.student_GPA = recalculate_GPA(student_id);
        alert("Student registered successfully");
    }
}

register_btn.addEventListener("click", register_student);
