document.addEventListener("DOMContentLoaded", () => {
  // DOM Element Selections
  const themeToggle = document.querySelector("#theme-toggle");
  const searchInput = document.querySelector("#doc-search");
  const docLinks = document.querySelectorAll("#doc-links .nav-link");
  const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
  const markdownViewer = document.querySelector("#markdown-viewer");

  // Default fallback document
  const DEFAULT_DOC = "index.md";

  /* ==========================================================================
     1. Theme Management (Light / Dark Mode)
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const currentTheme = savedTheme ?? (prefersDark ? "dark" : "light");
    applyTheme(currentTheme);
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle?.setAttribute("aria-pressed", "true");
      if (themeToggle) themeToggle.textContent = "Light mode";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle?.setAttribute("aria-pressed", "false");
      if (themeToggle) themeToggle.textContent = "Dark mode";
    }
    localStorage.setItem("theme", theme);
  }

  themeToggle?.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });

  /* ==========================================================================
     2. Asynchronous Markdown Fetcher & Rendering Engine
     ========================================================================== */
  async function loadDocument(docName) {
    if (!markdownViewer) return;

    // Show loading state with accessibility status
    markdownViewer.innerHTML = `<p>Loading documentation…</p>`;

    try {
      // Add 5-second timeout signal to prevent hanging requests
      const response = await fetch(`docs/${docName}`, {
        signal: AbortSignal.timeout(5000),
      });

      // Explicitly check response.ok (fetch doesn't reject on 404/500)
      if (!response.ok) {
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}`,
        );
      }

      const markdownText = await response.text();

      // Render parsed Markdown HTML using marked.js
      if (typeof marked !== "undefined") {
        markdownViewer.innerHTML = marked.parse(markdownText);
      } else {
        const pre = document.createElement("pre");
        pre.textContent = markdownText;
        markdownViewer.replaceChildren(pre);
      }

      // Update Navigation State & Breadcrumb Trail
      updateActiveNavLink(docName);
    } catch (error) {
      console.error("Failed to load document:", error);

      // Safe Error State Rendering using textContent to prevent XSS
      const errorContainer = document.createElement("div");
      errorContainer.className = "error-state";

      const h1 = document.createElement("h1");
      h1.textContent = "Document Not Found";

      const p = document.createElement("p");
      p.textContent = `Unable to load docs/${docName}. ${
        error.name === "TimeoutError"
          ? "Request timed out."
          : "Please check the document URL or network connection."
      }`;

      errorContainer.append(h1, p);
      markdownViewer.replaceChildren(errorContainer);
    }
  }

  /* ==========================================================================
     3. Active Link & Breadcrumb Updates
     ========================================================================== */
  function updateActiveNavLink(docName) {
    docLinks.forEach((link) => {
      const linkDoc = link.getAttribute("data-doc");
      if (linkDoc === docName) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");

        // Use textContent for safe text insertion
        if (breadcrumbCurrent) {
          breadcrumbCurrent.textContent = link.textContent?.trim() ?? docName;
        }
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  /* ==========================================================================
     4. Hash Router
     ========================================================================== */
  function handleRoute() {
    // Extract document name from URL hash (e.g. #s3-setup.md -> s3-setup.md)
    const hash = window.location.hash.replace("#", "").trim();
    const docToLoad = hash !== "" ? hash : DEFAULT_DOC;
    loadDocument(docToLoad);
  }

  window.addEventListener("hashchange", handleRoute);

  /* ==========================================================================
     5. Real-Time Search Filter
     ========================================================================== */
  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    docLinks.forEach((link) => {
      const linkText = link.textContent?.toLowerCase() ?? "";
      const listItem = link.closest("li");
      if (listItem) {
        listItem.style.display = linkText.includes(searchTerm) ? "" : "none";
      }
    });
  });

  // Initialize Theme and Route
  initTheme();
  handleRoute();
});
