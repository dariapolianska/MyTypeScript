"use strict";
// -------- 1. Типи --------
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProfessor = addProfessor;
exports.addCourse = addCourse;
exports.addClassroom = addClassroom;
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getProfessorSchedule = getProfessorSchedule;
exports.getClassroomUtilization = getClassroomUtilization;
exports.getMostPopularCourseType = getMostPopularCourseType;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
// Внутрішній масив і паралельний масив id
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
const lessonIds = []; // індекси відповідають елементам schedule
let nextProfessorId = 1;
let nextCourseId = 1;
let nextLessonId = 1;
// -------- 2. Додавання даних --------
function addProfessor(prof) {
    const newProfessor = Object.assign(Object.assign({}, prof), { id: nextProfessorId++ });
    professors.push(newProfessor);
    return newProfessor;
}
function addCourse(course) {
    const newCourse = Object.assign(Object.assign({}, course), { id: nextCourseId++ });
    courses.push(newCourse);
    return newCourse;
}
function addClassroom(room) {
    const exists = classrooms.some((c) => c.number === room.number);
    if (!exists) {
        classrooms.push(room);
    }
}
// -------- 3. Перевірка та додавання заняття --------
function validateLesson(lesson) {
    for (let i = 0; i < schedule.length; i++) {
        const existing = schedule[i];
        const sameTime = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        if (sameTime && existing.professorId === lesson.professorId) {
            return {
                type: "ProfessorConflict",
                lessonDetails: existing
            };
        }
        if (sameTime && existing.classroomNumber === lesson.classroomNumber) {
            return {
                type: "ClassroomConflict",
                lessonDetails: existing
            };
        }
    }
    return null;
}
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null) {
        console.warn("Конфлікт при додаванні заняття:", conflict.type);
        return false;
    }
    schedule.push(lesson);
    lessonIds.push(nextLessonId++);
    return true;
}
// -------- 4. Пошук та фільтрація --------
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const busy = [];
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        if (lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot) {
            busy.push(lesson.classroomNumber);
        }
    }
    const free = [];
    for (let j = 0; j < classrooms.length; j++) {
        const room = classrooms[j];
        if (busy.indexOf(room.number) === -1) {
            free.push(room.number);
        }
    }
    return free;
}
function getProfessorSchedule(professorId) {
    const result = [];
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        if (lesson.professorId === professorId) {
            result.push(lesson);
        }
    }
    return result;
}
// -------- 5. Аналіз розкладу --------
const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
const allSlots = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];
function getClassroomUtilization(classroomNumber) {
    const totalPossible = allDays.length * allSlots.length;
    if (totalPossible === 0) {
        return 0;
    }
    let used = 0;
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].classroomNumber === classroomNumber) {
            used++;
        }
    }
    const ratio = (used / totalPossible) * 100;
    return Math.round(ratio * 10) / 10;
}
function getMostPopularCourseType() {
    const counts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    for (let i = 0; i < schedule.length; i++) {
        const lesson = schedule[i];
        const course = courses.find((c) => c.id === lesson.courseId);
        if (!course)
            continue;
        counts[course.type] = counts[course.type] + 1;
    }
    let maxType = "Lecture";
    let maxCount = counts[maxType];
    const allTypes = ["Lecture", "Seminar", "Lab", "Practice"];
    for (let i = 0; i < allTypes.length; i++) {
        const t = allTypes[i];
        if (counts[t] > maxCount) {
            maxType = t;
            maxCount = counts[t];
        }
    }
    return maxType;
}
// -------- 6. Модифікація розкладу --------
function reassignClassroom(lessonId, newClassroomNumber) {
    const index = lessonIds.indexOf(lessonId);
    if (index === -1) {
        console.warn("Заняття з таким id не знайдено:", lessonId);
        return false;
    }
    const updated = Object.assign(Object.assign({}, schedule[index]), { classroomNumber: newClassroomNumber });
    const conflict = validateLesson(updated);
    if (conflict !== null) {
        console.warn("Неможливо змінити аудиторію через конфлікт:", conflict.type);
        return false;
    }
    schedule[index] = updated;
    return true;
}
function cancelLesson(lessonId) {
    const index = lessonIds.indexOf(lessonId);
    if (index === -1) {
        console.warn("Немає заняття з id =", lessonId);
        return;
    }
    schedule.splice(index, 1);
    lessonIds.splice(index, 1);
}
// -------- 7. Невеликий приклад --------
addClassroom({ number: "102", capacity: 25, hasProjector: false });
addClassroom({ number: "103", capacity: 40, hasProjector: true });
const professor1 = addProfessor({ name: "Olena Petrovna", department: "Math" });
const professor2 = addProfessor({ name: "Ihor Vasyliovych", department: "Physics" });
const course1 = addCourse({ name: "Algebra", type: "Lecture" });
const course2 = addCourse({ name: "Mechanics", type: "Lab" });
addLesson({
    courseId: course1.id,
    professorId: professor1.id,
    classroomNumber: "102",
    dayOfWeek: "Tuesday",
    timeSlot: "10:15-11:45"
});
addLesson({
    courseId: course2.id,
    professorId: professor2.id,
    classroomNumber: "103",
    dayOfWeek: "Wednesday",
    timeSlot: "12:15-13:45"
});
console.log("Available classrooms on Tuesday from 10:15-11:45:");
console.log(findAvailableClassrooms("10:15-11:45", "Tuesday"));
console.log(`Schedule for Professor ${professor1.name}:`);
console.log(getProfessorSchedule(professor1.id));
console.log("Classroom 102 utilization:");
console.log(getClassroomUtilization("102"), "%");
console.log("Most popular course type:");
console.log(getMostPopularCourseType());
