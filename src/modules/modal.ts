function setModalState(open: boolean): void {
    const modal: HTMLDivElement | null = document.querySelector("#contactModal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }

    if (open) {
        modal.classList.add("modal-window--visible");
        backdrop.classList.add("backdrop--visible");
    } else {
        modal.classList.remove("modal-window--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}

export function initModalModule(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-modal]");
    const closeButton: HTMLButtonElement | null =
        document.querySelector("[data-close-modal]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => setModalState(true));
    });

    if (closeButton) {
        closeButton.addEventListener("click", (): void => setModalState(false));
    }

    if (backdrop) {
        backdrop.addEventListener("click", (): void => setModalState(false));
    }
}
