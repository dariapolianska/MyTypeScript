import type { User } from "../types/user.js";

async function loadUsers(): Promise<User[]> {
    const url: string = "https://jsonplaceholder.typicode.com/users?_limit=5";
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    const data: User[] = await response.json();
    return data;
}

function drawUsers(users: User[]): void {
    const container: HTMLDivElement | null =
        document.querySelector("#users-list");

    if (!container) {
        console.warn("Контейнер користувачів не знайдено.");
        return;
    }

    container.innerHTML = "";

    users.forEach((user: User): void => {
        const card: HTMLDivElement = document.createElement("div");
        card.className = "user-card";

        const nameEl: HTMLHeadingElement = document.createElement("h3");
        nameEl.textContent = user.name;

        const emailEl: HTMLParagraphElement = document.createElement("p");
        emailEl.textContent = `Email: ${user.email}`;

        container.appendChild(card);
        card.appendChild(nameEl);
        card.appendChild(emailEl);
    });
}

export async function initUsersModule(): Promise<void> {
    try {
        const users: User[] = await loadUsers();
        drawUsers(users);
    } catch (error) {
        console.error("Помилка завантаження користувачів:", error);
    }
}
