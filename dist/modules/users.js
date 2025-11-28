var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://jsonplaceholder.typicode.com/users?_limit=5";
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const data = yield response.json();
        return data;
    });
}
function drawUsers(users) {
    const container = document.querySelector("#users-list");
    if (!container) {
        console.warn("Контейнер користувачів не знайдено.");
        return;
    }
    container.innerHTML = "";
    users.forEach((user) => {
        const card = document.createElement("div");
        card.className = "user-card";
        const nameEl = document.createElement("h3");
        nameEl.textContent = user.name;
        const emailEl = document.createElement("p");
        emailEl.textContent = `Email: ${user.email}`;
        container.appendChild(card);
        card.appendChild(nameEl);
        card.appendChild(emailEl);
    });
}
export function initUsersModule() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield loadUsers();
            drawUsers(users);
        }
        catch (error) {
            console.error("Помилка завантаження користувачів:", error);
        }
    });
}
