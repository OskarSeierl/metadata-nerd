# Metadata Nerd

**Metadata Nerd** 🤓 is a sleek, powerful metadata editor designed for bulk modifications, deep data inspection, and structured file organization. Built with Electron, React, TypeScript, and Tailwind CSS, it easily handles massive image libraries with butter-smooth virtualized scrolling and a secure local media bridge.

## ✨ Features
- **Bulk Operations:** Apply EXIF metadata edits or pattern-based renaming to thousands of files instantly.
- **Deep EXIF Inspection:** Uncover and edit the hidden data within your image files.
- **High-Performance UI:** Virtualized grid and table layouts that handle 10,000+ files without breaking a sweat.
- **Cross-Platform:** Optimized builds for Windows (`.exe`) and Linux (`.AppImage`).

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer recommended)
- npm
- [Git](https://git-scm.com/)

### Setup & Local Development

1. **Clone the repository**
```bash
git clone https://github.com/OskarSeierl/metadata-nerd.git
cd metadata-nerd
 ```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```
*This will boot up both the Vite (React) frontend and the Electron backend simultaneously.*

## 📦 Building for Production
This project uses [Electron Builder](https://www.electron.build/) for packaging and distribution.

To compile the application on a Windows machine, run:
```bash
npm run dist:win
```

## 🚢 Creating a Release
Use the `npm version [major | minor | patch]` command to bump the version number, then push the changes and create a new release on GitHub.
A corresponding tag is automatically created, which can be pushed by using `git push --follow-tags origin main`.

## 🤝 Contributing
Contributions, issues, and feature requests are highly encouraged! Your help is welcome!
1. Fork the Project 
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature` 
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'` 
4. Push to the Branch: `git push origin feature/AmazingFeature` 
5. Open a Pull Request
