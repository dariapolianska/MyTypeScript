// -------- 1. Типи --------

export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type TimeSlot =
    | "8:30-10:00"
    | "10:15-11:45"
    | "12:15-13:45"
    | "14:00-15:30"
    | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

export type Professor = {
    id: number;
    name: string;
    department: string;
};

export type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

export type Course = {
    id: number;
    name: string;
    type: CourseType;
};

export type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

export type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// Внутрішній масив і паралельний масив id
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];
const lessonIds: number[] = []; // індекси відповідають елементам schedule

let nextProfessorId: number = 1;
let nextCourseId: number = 1;
let nextLessonId: number = 1;

// -------- 2. Додавання даних --------

export function addProfessor(prof: Omit<Professor, "id">): Professor {
    const newProfessor: Professor = {
        ...prof,
        id: nextProfessorId++
    };
    professors.push(newProfessor);
    return newProfessor;
}

export function addCourse(course: Omit<Course, "id">): Course {
    const newCourse: Course = {
        ...course,
        id: nextCourseId++
    };
    courses.push(newCourse);
    return newCourse;
}

export function addClassroom(room: Classroom): void {
    const exists: boolean = classrooms.some(
        (c: Classroom): boolean => c.number === room.number
    );
    if (!exists) {
        classrooms.push(room);
    }
}

// -------- 3. Перевірка та додавання заняття --------

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (let i: number = 0; i < schedule.length; i++) {
        const existing: Lesson = schedule[i];

        const sameTime: boolean =
            existing.dayOfWeek === lesson.dayOfWeek &&
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

export function addLesson(lesson: Lesson): boolean {
    const conflict: ScheduleConflict | null = validateLesson(lesson);

    if (conflict !== null) {
        console.warn("Конфлікт при додаванні заняття:", conflict.type);
        return false;
    }

    schedule.push(lesson);
    lessonIds.push(nextLessonId++);
    return true;
}

// -------- 4. Пошук та фільтрація --------

export function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
): string[] {
    const busy: string[] = [];

    for (let i: number = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        if (lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot) {
            busy.push(lesson.classroomNumber);
        }
    }

    const free: string[] = [];

    for (let j: number = 0; j < classrooms.length; j++) {
        const room: Classroom = classrooms[j];
        if (busy.indexOf(room.number) === -1) {
            free.push(room.number);
        }
    }

    return free;
}

export function getProfessorSchedule(professorId: number): Lesson[] {
    const result: Lesson[] = [];

    for (let i: number = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        if (lesson.professorId === professorId) {
            result.push(lesson);
        }
    }

    return result;
}

// -------- 5. Аналіз розкладу --------

const allDays: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const allSlots: TimeSlot[] = [
    "8:30-10:00",
    "10:15-11:45",
    "12:15-13:45",
    "14:00-15:30",
    "15:45-17:15"
];

export function getClassroomUtilization(classroomNumber: string): number {
    const totalPossible: number = allDays.length * allSlots.length;
    if (totalPossible === 0) {
        return 0;
    }

    let used: number = 0;
    for (let i: number = 0; i < schedule.length; i++) {
        if (schedule[i].classroomNumber === classroomNumber) {
            used++;
        }
    }

    const ratio: number = (used / totalPossible) * 100;
    return Math.round(ratio * 10) / 10;
}

export function getMostPopularCourseType(): CourseType {
    const counts: { [key in CourseType]: number } = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };

    for (let i: number = 0; i < schedule.length; i++) {
        const lesson: Lesson = schedule[i];
        const course: Course | undefined = courses.find(
            (c: Course): boolean => c.id === lesson.courseId
        );
        if (!course) continue;
        counts[course.type] = counts[course.type] + 1;
    }

    let maxType: CourseType = "Lecture";
    let maxCount: number = counts[maxType];

    const allTypes: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
    for (let i: number = 0; i < allTypes.length; i++) {
        const t: CourseType = allTypes[i];
        if (counts[t] > maxCount) {
            maxType = t;
            maxCount = counts[t];
        }
    }

    return maxType;
}

// -------- 6. Модифікація розкладу --------

export function reassignClassroom(
    lessonId: number,
    newClassroomNumber: string
): boolean {
    const index: number = lessonIds.indexOf(lessonId);
    if (index === -1) {
        console.warn("Заняття з таким id не знайдено:", lessonId);
        return false;
    }

    const updated: Lesson = {
        ...schedule[index],
        classroomNumber: newClassroomNumber
    };

    const conflict: ScheduleConflict | null = validateLesson(updated);
    if (conflict !== null) {
        console.warn("Неможливо змінити аудиторію через конфлікт:", conflict.type);
        return false;
    }

    schedule[index] = updated;
    return true;
}

export function cancelLesson(lessonId: number): void {
    const index: number = lessonIds.indexOf(lessonId);
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