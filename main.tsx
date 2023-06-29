import { createRoot } from "react-dom/client";
import App from "./index.js";
import "./index.css";

// eslint-disable-next-line no-var

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
