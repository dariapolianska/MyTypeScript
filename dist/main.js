"use strict";
const courseTitle = "Основи TypeScript";
const totalLessons = 12;
const isRemoteFormat = true;
function buildCourseSummary(title, lessons, remote) {
    const formatText = remote ? "онлайн" : "офлайн";
    return `Курс "${title}" складається з ${lessons} занять у форматі ${formatText}.`;
}
const summary = buildCourseSummary(courseTitle, totalLessons, isRemoteFormat);
console.log(summary);
