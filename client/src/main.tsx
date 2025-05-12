import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "StreamPe - Premium Movie Streaming";

// Add meta tags for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'StreamPe - Watch movies and TV shows online for free. Stream full HD content with no ads, no login required.';
document.head.appendChild(metaDescription);

// Open Graph tags
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = 'StreamPe - Premium Movie Streaming';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Watch movies and TV shows online for free. Stream full HD content with no ads, no login required.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

// Favicon
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>';
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
