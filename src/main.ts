import { initModalModule } from "./modules/modal.js";
import { initScrollModule } from "./modules/scroll.js";
import { initUsersModule } from "./modules/users.js";

function bootstrap(): void {
    initModalModule();
    initScrollModule();
    void initUsersModule();
}

document.addEventListener("DOMContentLoaded", (): void => {
    bootstrap();
});
