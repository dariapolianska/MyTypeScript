function applyScrollStyles() {
    const header = document.querySelector(".site-header");
    const toTopBtn = document.querySelector("#backToTop");
    const y = window.scrollY;
    if (header) {
        if (y > 20) {
            header.classList.add("site-header--compact");
        }
        else {
            header.classList.remove("site-header--compact");
        }
    }
    if (toTopBtn) {
        if (y > 250) {
            toTopBtn.classList.add("to-top-btn--visible");
        }
        else {
            toTopBtn.classList.remove("to-top-btn--visible");
        }
    }
}
function scrollTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
export function initScrollModule() {
    const toTopBtn = document.querySelector("#backToTop");
    window.addEventListener("scroll", applyScrollStyles);
    if (toTopBtn) {
        toTopBtn.addEventListener("click", scrollTop);
    }
}
