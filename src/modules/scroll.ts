function applyScrollStyles(): void {
    const header: HTMLElement | null = document.querySelector(".site-header");
    const toTopBtn: HTMLButtonElement | null =
        document.querySelector("#backToTop");
    const y: number = window.scrollY;

    if (header) {
        if (y > 20) {
            header.classList.add("site-header--compact");
        } else {
            header.classList.remove("site-header--compact");
        }
    }

    if (toTopBtn) {
        if (y > 250) {
            toTopBtn.classList.add("to-top-btn--visible");
        } else {
            toTopBtn.classList.remove("to-top-btn--visible");
        }
    }
}

function scrollTop(): void {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export function initScrollModule(): void {
    const toTopBtn: HTMLButtonElement | null =
        document.querySelector("#backToTop");

    window.addEventListener("scroll", applyScrollStyles);

    if (toTopBtn) {
        toTopBtn.addEventListener("click", scrollTop);
    }
}
