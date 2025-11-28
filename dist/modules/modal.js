function setModalState(open) {
    const modal = document.querySelector("#contactModal");
    const backdrop = document.querySelector("#backdrop");
    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }
    if (open) {
        modal.classList.add("modal-window--visible");
        backdrop.classList.add("backdrop--visible");
    }
    else {
        modal.classList.remove("modal-window--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}
export function initModalModule() {
    const openButtons = document.querySelectorAll("[data-open-modal]");
    const closeButton = document.querySelector("[data-close-modal]");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => setModalState(true));
    });
    if (closeButton) {
        closeButton.addEventListener("click", () => setModalState(false));
    }
    if (backdrop) {
        backdrop.addEventListener("click", () => setModalState(false));
    }
}
