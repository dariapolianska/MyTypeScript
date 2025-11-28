const courseTitle: string = "Основи TypeScript";
const totalLessons: number = 12;
const isRemoteFormat: boolean = true;

function buildCourseSummary(
    title: string,
    lessons: number,
    remote: boolean
): string {
    const formatText: string = remote ? "онлайн" : "офлайн";
    return `Курс "${title}" складається з ${lessons} занять у форматі ${formatText}.`;
}

const summary: string = buildCourseSummary(
    courseTitle,
    totalLessons,
    isRemoteFormat
);

console.log(summary);
