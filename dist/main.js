"use strict";
// ---------- Enum-и ----------
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ---------- Клас ----------
class UniversityManagementSystem {
    constructor() {
        // Используем Map вместо массивов для разнообразия реализации
        this.students = new Map();
        this.courses = new Map();
        // ключ: courseId, значение: множество studentId
        this.registrations = new Map();
        this.grades = [];
        this.studentCounter = 1;
        this.courseCounter = 1;
    }
    // ---- Внутренние хелперы ----
    getStudent(studentId) {
        return this.students.get(studentId);
    }
    getCourse(courseId) {
        return this.courses.get(courseId);
    }
    ensureCourseSet(courseId) {
        let set = this.registrations.get(courseId);
        if (!set) {
            set = new Set();
            this.registrations.set(courseId, set);
        }
        return set;
    }
    isRegistered(studentId, courseId) {
        const set = this.registrations.get(courseId);
        if (!set)
            return false;
        return set.has(studentId);
    }
    // ---- Публічні методи ----
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.studentCounter++ });
        this.students.set(newStudent.id, newStudent);
        return newStudent;
    }
    addCourse(course) {
        const newCourse = Object.assign(Object.assign({}, course), { id: this.courseCounter++ });
        this.courses.set(newCourse.id, newCourse);
        return newCourse;
    }
    registerForCourse(studentId, courseId) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student) {
            console.error("Студент не знайдений:", studentId);
            return;
        }
        if (!course) {
            console.error("Курс не знайдений:", courseId);
            return;
        }
        if (student.status !== StudentStatus.Active) {
            console.error(`Студент зі статусом ${student.status} не може реєструватися на курс.`);
            return;
        }
        if (student.faculty !== course.faculty) {
            console.error("Факультет студента не відповідає факультету курсу:", student.faculty, course.faculty);
            return;
        }
        const set = this.ensureCourseSet(courseId);
        if (set.size >= course.maxStudents) {
            console.error("Курс переповнений.");
            return;
        }
        if (set.has(studentId)) {
            console.warn("Студент вже зареєстрований на цей курс.");
            return;
        }
        set.add(studentId);
    }
    setGrade(studentId, courseId, grade) {
        const student = this.getStudent(studentId);
        const course = this.getCourse(courseId);
        if (!student || !course) {
            console.error("Невірний studentId або courseId при виставленні оцінки.");
            return;
        }
        if (!this.isRegistered(studentId, courseId)) {
            console.error("Студент не зареєстрований на курс, оцінку виставити не можна.");
            return;
        }
        const record = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };
        // Якщо є попередній запис — оновлюємо
        const idx = this.grades.findIndex((g) => g.studentId === studentId &&
            g.courseId === courseId &&
            g.semester === course.semester);
        if (idx >= 0) {
            this.grades[idx] = record;
        }
        else {
            this.grades.push(record);
        }
    }
    updateStudentStatus(studentId, newStatus) {
        const student = this.getStudent(studentId);
        if (!student) {
            console.error("Студент не знайдений:", studentId);
            return;
        }
        const current = student.status;
        if ((current === StudentStatus.Graduated ||
            current === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active) {
            console.error("Не можна повернути студента зі статусу Graduated/Expelled в Active.");
            return;
        }
        student.status = newStatus;
        this.students.set(student.id, student);
    }
    getStudentsByFaculty(faculty) {
        const result = [];
        for (const student of this.students.values()) {
            if (student.faculty === faculty) {
                result.push(student);
            }
        }
        return result;
    }
    getStudentGrades(studentId) {
        return this.grades.filter((g) => g.studentId === studentId);
    }
    getAvailableCourses(faculty, semester) {
        const result = [];
        for (const course of this.courses.values()) {
            if (course.faculty !== faculty || course.semester !== semester) {
                continue;
            }
            const registeredSet = this.registrations.get(course.id);
            const count = registeredSet ? registeredSet.size : 0;
            if (count < course.maxStudents) {
                result.push(course);
            }
        }
        return result;
    }
    calculateAverageGrade(studentId) {
        const records = this.getStudentGrades(studentId);
        if (records.length === 0) {
            return 0;
        }
        let sum = 0;
        for (const record of records) {
            sum += record.grade;
        }
        const avg = sum / records.length;
        return Math.round(avg * 100) / 100;
    }
    getHonorsStudentsByFaculty(faculty) {
        const students = this.getStudentsByFaculty(faculty);
        const honors = [];
        for (const st of students) {
            const avg = this.calculateAverageGrade(st.id);
            if (avg >= 4.5) {
                honors.push(st);
            }
        }
        return honors;
    }
}
// ---------- Приклад використання (можно менять/комментировать) ----------
const ums2 = new UniversityManagementSystem();
const csCourse = ums2.addCourse({
    name: "Основи програмування",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 3
});
const lawCourse = ums2.addCourse({
    name: "Теорія держави і права",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.Second,
    faculty: Faculty.Law,
    maxStudents: 2
});
const stA = ums2.enrollStudent({
    fullName: "Сергій Сидоренко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-12"
});
const stB = ums2.enrollStudent({
    fullName: "Ірина Бойко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-12"
});
// Реєстрація
ums2.registerForCourse(stA.id, csCourse.id);
ums2.registerForCourse(stB.id, csCourse.id);
// Оцінки
ums2.setGrade(stA.id, csCourse.id, Grade.Excellent);
ums2.setGrade(stB.id, csCourse.id, Grade.Good);
console.log("Середній бал A:", ums2.calculateAverageGrade(stA.id));
console.log("Відмінники CS:", ums2.getHonorsStudentsByFaculty(Faculty.Computer_Science));
console.log("Доступні курси CS, First:", ums2.getAvailableCourses(Faculty.Computer_Science, Semester.First));
