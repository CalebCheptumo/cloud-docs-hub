# Cloud Docs Hub

A lightweight, zero-dependency client-side documentation viewer built with semantic HTML5, modern CSS Cascade Layers, vanilla JavaScript, and automated AWS S3 deployment.

---

## Table of Contents
- [Overview & Motivation](#overview--motivation)
- [Key Features](#key-features)
- [Project Status & Roadmap](#-project-status--roadmap)
- [Project Layout](#project-layout)
- [Local Installation & Setup](#local-installation--setup)
- [Automated AWS Deployment](#automated-aws-deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview & Motivation

**CloudDocs Hub** A tiny docs site you can host on S3.
## Key Features

- **Zero Build Steps**: Built purely with native web standards—HTML5, CSS3, and vanilla JavaScript—making local testing and hosting straightforward.
- **Client-Side Hash Routing**: Navigates between documentation topics seamlessly using URL hash changes (`#index.md`, `#s3-setup.md`) without full page reloads.
- **Theme Switcher**: Supports light and dark modes with persistent local storage (`localStorage`) and system preference fallback (`prefers-color-scheme`).
- **Real-Time Search Filtering**: Dynamically filters document links in the sidebar as you type.
- **Automated S3 Deployment**: GitHub Actions workflow supporting passwordless AWS authentication via OIDC and automated S3 syncing.

---

## Project Status & Roadmap

### Completed
- **Semantic HTML Shell (`index.html`)**: Accessible webpage structure featuring header, search bar, navigation sidebar, breadcrumb trail, and markdown viewer article container.
- **CSS Cascade Layers (`assets/css/styles.css`)**: Built using `@layer reset, tokens, base, layout, components`, responsive breakpoints (`48rem`, `75rem`), dark mode design tokens, and focus rings.
- **Vanilla JS Core (`assets/js/main.js`)**: Handles light/dark theme toggling, URL hash routing (`#doc.md`), real-time search filtering, and async fetcher with timeout signal handling.
- **Automated CI/CD Workflow (`.github/workflows/deploy-s3.yml`)**: GitHub Actions pipeline configuring passwordless AWS OIDC authentication to sync static assets to S3.

### In Progress / Roadmap
- [ ] **Documentation Pages (`docs/`)**:
  - [ ] `index.md` (Getting Started guide)
  - [ ] `s3-setup.md` (AWS S3 Static Web Hosting guide)
  - [ ] `cloudfront-https.md` (AWS CloudFront CDN & HTTPS guide)
  - [ ] `cors-guide.md` (CORS Best Practice guide)
  - [ ] `cicd-pipeline.md` (GitHub Actions CI/CD guide)
- [ ] **Table of Contents Anchor Links**: Dynamic extraction of heading anchors from rendered Markdown content.

---

## Project Layout

```text
cloud-docs-hub/
├── index.html              # Main HTML web page shell
├── assets/
│   ├── css/
│   │   └── styles.css      # CSS Cascade Layers (@layer reset, tokens, base, layout, components)
│   └── js/
│       └── main.js         # Theme management, routing, and Markdown fetcher
├── .github/
│   └── workflows/
│       └── deploy-s3.yml   # AWS S3 deployment workflow
└── README.md               # Repository documentation
```
---

## Local Installation & Setup


1. **Clone the Repository**:
   ```bash
   git clone git@github.com:CalebCheptumo/cloud-docs-hub.git
   cd cloud-docs-hub
   ```

2. **Start a Local HTTP Server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000` in your web browser.

---

## Automated AWS Deployment

Deployment to AWS S3 is managed via GitHub Actions (`.github/workflows/deploy-s3.yml`) on every push to the `main` branch.

### Required Repository Secrets

Configure these secrets under **Settings > Secrets and variables > Actions**:

- `AWS_ROLE_ARN`: IAM Role ARN configured for GitHub Actions OIDC trust
- `AWS_REGION`: AWS Region (e.g., `us-east-1`)
- `AWS_S3_BUCKET`: Target AWS S3 Bucket Name

--- 

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

---

## License

Distributed under the MIT License.
