// ---------- Enum-и ----------

enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ---------- Інтерфейси ----------

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

// як и в первом варианте, чтобы не конфликтовать с enum Grade:
interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// ---------- Клас ----------

class UniversityManagementSystem {
    // Используем Map вместо массивов для разнообразия реализации
    private students: Map<number, Student> = new Map();
    private courses: Map<number, Course> = new Map();
    // ключ: courseId, значение: множество studentId
    private registrations: Map<number, Set<number>> = new Map();
    private grades: GradeRecord[] = [];

    private studentCounter: number = 1;
    private courseCounter: number = 1;

    // ---- Внутренние хелперы ----

    private getStudent(studentId: number): Student | undefined {
        return this.students.get(studentId);
    }

    private getCourse(courseId: number): Course | undefined {
        return this.courses.get(courseId);
    }

    private ensureCourseSet(courseId: number): Set<number> {
        let set: Set<number> | undefined = this.registrations.get(courseId);
        if (!set) {
            set = new Set<number>();
            this.registrations.set(courseId, set);
        }
        return set;
    }

    private isRegistered(studentId: number, courseId: number): boolean {
        const set: Set<number> | undefined = this.registrations.get(courseId);
        if (!set) return false;
        return set.has(studentId);
    }

    // ---- Публічні методи ----

    public enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = {
            ...student,
            id: this.studentCounter++
        };
        this.students.set(newStudent.id, newStudent);
        return newStudent;
    }

    public addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = {
            ...course,
            id: this.courseCounter++
        };
        this.courses.set(newCourse.id, newCourse);
        return newCourse;
    }

    public registerForCourse(studentId: number, courseId: number): void {
        const student: Student | undefined = this.getStudent(studentId);
        const course: Course | undefined = this.getCourse(courseId);

        if (!student) {
            console.error("Студент не знайдений:", studentId);
            return;
        }

        if (!course) {
            console.error("Курс не знайдений:", courseId);
            return;
        }

        if (student.status !== StudentStatus.Active) {
            console.error(
                `Студент зі статусом ${student.status} не може реєструватися на курс.`
            );
            return;
        }

        if (student.faculty !== course.faculty) {
            console.error(
                "Факультет студента не відповідає факультету курсу:",
                student.faculty,
                course.faculty
            );
            return;
        }

        const set: Set<number> = this.ensureCourseSet(courseId);
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

    public setGrade(
        studentId: number,
        courseId: number,
        grade: Grade
    ): void {
        const student: Student | undefined = this.getStudent(studentId);
        const course: Course | undefined = this.getCourse(courseId);

        if (!student || !course) {
            console.error("Невірний studentId або courseId при виставленні оцінки.");
            return;
        }

        if (!this.isRegistered(studentId, courseId)) {
            console.error("Студент не зареєстрований на курс, оцінку виставити не можна.");
            return;
        }

        const record: GradeRecord = {
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: course.semester
        };

        // Якщо є попередній запис — оновлюємо
        const idx: number = this.grades.findIndex(
            (g: GradeRecord): boolean =>
                g.studentId === studentId &&
                g.courseId === courseId &&
                g.semester === course.semester
        );

        if (idx >= 0) {
            this.grades[idx] = record;
        } else {
            this.grades.push(record);
        }
    }

    public updateStudentStatus(
        studentId: number,
        newStatus: StudentStatus
    ): void {
        const student: Student | undefined = this.getStudent(studentId);
        if (!student) {
            console.error("Студент не знайдений:", studentId);
            return;
        }

        const current: StudentStatus = student.status;

        if (
            (current === StudentStatus.Graduated ||
                current === StudentStatus.Expelled) &&
            newStatus === StudentStatus.Active
        ) {
            console.error(
                "Не можна повернути студента зі статусу Graduated/Expelled в Active."
            );
            return;
        }

        student.status = newStatus;
        this.students.set(student.id, student);
    }

    public getStudentsByFaculty(faculty: Faculty): Student[] {
        const result: Student[] = [];

        for (const student of this.students.values()) {
            if (student.faculty === faculty) {
                result.push(student);
            }
        }

        return result;
    }

    public getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(
            (g: GradeRecord): boolean => g.studentId === studentId
        );
    }

    public getAvailableCourses(
        faculty: Faculty,
        semester: Semester
    ): Course[] {
        const result: Course[] = [];

        for (const course of this.courses.values()) {
            if (course.faculty !== faculty || course.semester !== semester) {
                continue;
            }
            const registeredSet: Set<number> | undefined =
                this.registrations.get(course.id);
            const count: number = registeredSet ? registeredSet.size : 0;
            if (count < course.maxStudents) {
                result.push(course);
            }
        }

        return result;
    }

    public calculateAverageGrade(studentId: number): number {
        const records: GradeRecord[] = this.getStudentGrades(studentId);
        if (records.length === 0) {
            return 0;
        }

        let sum: number = 0;
        for (const record of records) {
            sum += record.grade;
        }

        const avg: number = sum / records.length;
        return Math.round(avg * 100) / 100;
    }

    public getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
        const students: Student[] = this.getStudentsByFaculty(faculty);
        const honors: Student[] = [];

        for (const st of students) {
            const avg: number = this.calculateAverageGrade(st.id);
            if (avg >= 4.5) {
                honors.push(st);
            }
        }

        return honors;
    }
}

// ---------- Приклад використання (можно менять/комментировать) ----------

const ums2: UniversityManagementSystem = new UniversityManagementSystem();

const csCourse: Course = ums2.addCourse({
    name: "Основи програмування",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 3
});

const lawCourse: Course = ums2.addCourse({
    name: "Теорія держави і права",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.Second,
    faculty: Faculty.Law,
    maxStudents: 2
});

const stA: Student = ums2.enrollStudent({
    fullName: "Сергій Сидоренко",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2024-09-01"),
    groupNumber: "CS-12"
});

const stB: Student = ums2.enrollStudent({
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
console.log(
    "Відмінники CS:",
    ums2.getHonorsStudentsByFaculty(Faculty.Computer_Science)
);
console.log(
    "Доступні курси CS, First:",
    ums2.getAvailableCourses(Faculty.Computer_Science, Semester.First)
);
