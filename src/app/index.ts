import "@/shared/ui/block/registerBlocks";
import "@fontsource/inter";
import { App } from "./App";
import { registerAppComponents } from "./providers/registerAppComponents";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/shared/styles/global.scss";

registerAppComponents();

try {
  new App();
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  const app = document.getElementById("app");

  if (app) {
    app.innerHTML = `<p class="app-error">App error: ${msg}</p>`;
  }

  console.error("[GilgaChat]", msg);
}
