"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---------------- Модальне вікно ----------------
function toggleModalVisibility(show) {
    const modal = document.querySelector("#contactModal");
    const backdrop = document.querySelector("#backdrop");
    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }
    if (show) {
        modal.classList.add("modal-window--visible");
        backdrop.classList.add("backdrop--visible");
    }
    else {
        modal.classList.remove("modal-window--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}
function initModal() {
    const openButtons = document.querySelectorAll("[data-open-modal]");
    const closeButton = document.querySelector("[data-close-modal]");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => toggleModalVisibility(true));
    });
    if (closeButton) {
        closeButton.addEventListener("click", () => toggleModalVisibility(false));
    }
    if (backdrop) {
        backdrop.addEventListener("click", () => toggleModalVisibility(false));
    }
}
// ---------------- Скрол і кнопка "наверх" ----------------
function updateScrollUI() {
    const header = document.querySelector(".site-header");
    const toTopBtn = document.querySelector("#backToTop");
    const offset = window.scrollY;
    if (header) {
        if (offset > 20) {
            header.classList.add("site-header--compact");
        }
        else {
            header.classList.remove("site-header--compact");
        }
    }
    if (toTopBtn) {
        if (offset > 250) {
            toTopBtn.classList.add("to-top-btn--visible");
        }
        else {
            toTopBtn.classList.remove("to-top-btn--visible");
        }
    }
}
function initScrollButton() {
    const toTopBtn = document.querySelector("#backToTop");
    window.addEventListener("scroll", updateScrollUI);
    if (toTopBtn) {
        toTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}
// ---------------- Завантаження користувачів ----------------
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = "https://jsonplaceholder.typicode.com/users?_limit=4";
        const response = yield fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    });
}
function renderUsers(users) {
    const container = document.querySelector("#users-list");
    if (!container) {
        console.warn("Контейнер для користувачів не знайдено.");
        return;
    }
    container.innerHTML = "";
    users.forEach((user) => {
        const card = document.createElement("div");
        card.className = "user-card";
        const title = document.createElement("h3");
        title.textContent = user.name;
        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;
        const phone = document.createElement("p");
        phone.textContent = `Телефон: ${user.phone}`;
        card.appendChild(title);
        card.appendChild(email);
        card.appendChild(phone);
        container.appendChild(card);
    });
}
function initUsersBlock() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield fetchUsers();
            renderUsers(users);
        }
        catch (error) {
            console.error("Не вдалося завантажити користувачів:", error);
        }
    });
}
// ----------------  Ініціалізація всієї сторінки ----------------
document.addEventListener("DOMContentLoaded", () => {
    initModal();
    initScrollButton();
    void initUsersBlock();
});
