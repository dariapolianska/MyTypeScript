import { initModalModule } from "./modules/modal.js";
import { initScrollModule } from "./modules/scroll.js";
import { initUsersModule } from "./modules/users.js";
function bootstrap() {
    initModalModule();
    initScrollModule();
    void initUsersModule();
}
document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
});
