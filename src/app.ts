// Тип користувача з JSONPlaceholder
type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
};

// ---------------- Модальне вікно ----------------

function toggleModalVisibility(show: boolean): void {
    const modal: HTMLDivElement | null = document.querySelector("#contactModal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }

    if (show) {
        modal.classList.add("modal-window--visible");
        backdrop.classList.add("backdrop--visible");
    } else {
        modal.classList.remove("modal-window--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}

function initModal(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-modal]");
    const closeButton: HTMLButtonElement | null =
        document.querySelector("[data-close-modal]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => toggleModalVisibility(true));
    });

    if (closeButton) {
        closeButton.addEventListener("click", (): void =>
            toggleModalVisibility(false)
        );
    }

    if (backdrop) {
        backdrop.addEventListener("click", (): void =>
            toggleModalVisibility(false)
        );
    }
}

// ---------------- Скрол і кнопка "наверх" ----------------

function updateScrollUI(): void {
    const header: HTMLElement | null = document.querySelector(".site-header");
    const toTopBtn: HTMLButtonElement | null =
        document.querySelector("#backToTop");
    const offset: number = window.scrollY;

    if (header) {
        if (offset > 20) {
            header.classList.add("site-header--compact");
        } else {
            header.classList.remove("site-header--compact");
        }
    }

    if (toTopBtn) {
        if (offset > 250) {
            toTopBtn.classList.add("to-top-btn--visible");
        } else {
            toTopBtn.classList.remove("to-top-btn--visible");
        }
    }
}

function initScrollButton(): void {
    const toTopBtn: HTMLButtonElement | null =
        document.querySelector("#backToTop");

    window.addEventListener("scroll", updateScrollUI);

    if (toTopBtn) {
        toTopBtn.addEventListener("click", (): void => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

// ---------------- Завантаження користувачів ----------------

async function fetchUsers(): Promise<User[]> {
    const endpoint: string =
        "https://jsonplaceholder.typicode.com/users?_limit=4";

    const response: Response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
    }

    const data: User[] = await response.json();
    return data;
}

function renderUsers(users: User[]): void {
    const container: HTMLDivElement | null =
        document.querySelector("#users-list");

    if (!container) {
        console.warn("Контейнер для користувачів не знайдено.");
        return;
    }

    container.innerHTML = "";

    users.forEach((user: User): void => {
        const card: HTMLDivElement = document.createElement("div");
        card.className = "user-card";

        const title: HTMLHeadingElement = document.createElement("h3");
        title.textContent = user.name;

        const email: HTMLParagraphElement = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const phone: HTMLParagraphElement = document.createElement("p");
        phone.textContent = `Телефон: ${user.phone}`;

        card.appendChild(title);
        card.appendChild(email);
        card.appendChild(phone);

        container.appendChild(card);
    });
}

async function initUsersBlock(): Promise<void> {
    try {
        const users: User[] = await fetchUsers();
        renderUsers(users);
    } catch (error) {
        console.error("Не вдалося завантажити користувачів:", error);
    }
}

// ----------------  Ініціалізація всієї сторінки ----------------

document.addEventListener("DOMContentLoaded", (): void => {
    initModal();
    initScrollButton();
    void initUsersBlock();
});
