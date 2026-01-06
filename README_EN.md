# Aurora Theme for Halo 2.0

A modern and beautiful theme for Halo 2.0, featuring an Aurora design concept that provides an elegant user experience.

![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)
![Halo](https://img.shields.io/badge/Halo-%3E%3D2.20.0-green.svg)
![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)

## ✨ Features

- 🎨 **Modern Design** - Clean and elegant interface design with dark mode support
- 📱 **Responsive Layout** - Perfect adaptation for desktop, tablet, and mobile devices
- 🎯 **Three-Column Layout System** - Flexible content layout with left and right sidebars
- 🌈 **Full-Screen Banner** - Support for full-screen top banner with smooth scroll animation effects
- 🎭 **Rich Components** - Post cards, tag filters, table of contents navigation, and more
- 🎨 **Layui Theme Colors** - Integrated Layui color scheme for a unified visual experience
- ⚡ **Performance Optimized** - Built with Vite for fast loading
- 🎪 **Highly Configurable** - Rich theme settings options

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) - Fast frontend build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Typography plugin
- [Iconify](https://iconify.design/) - Unified icon library
- [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

## 📦 Installation

### Method 1: Install from Halo Admin Panel

1. Log in to Halo admin panel
2. Go to "Appearance" → "Themes"
3. Click "Install" → "Install from Theme Store"
4. Search for "Aurora" and install

### Method 2: Manual Installation

1. Download the theme package (from [Releases](https://github.com/xgs87762GH/theme-aurora/releases))
2. Log in to Halo admin panel
3. Go to "Appearance" → "Themes"
4. Click "Install" → "Upload Theme"
5. Select and upload the downloaded package

## 🚀 Usage

After installation, activate the Aurora theme in "Appearance" → "Themes" in the Halo admin panel.

### Theme Settings

The theme provides rich configuration options, including:

- Global Settings: Logo, color scheme toggle, etc.
- Homepage Settings: Top banner, post list styles, etc.
- Post Settings: Table of contents display, post styles, etc.
- Footer Settings: Copyright information, social links, etc.

## 🛠️ Development

If you want to participate in development or customize the theme, follow these steps:

### Requirements

- Node.js >= 18
- pnpm >= 8

### Getting Started

```bash
# Clone the repository
git clone https://github.com/xgs87762GH/theme-aurora.git
cd theme-aurora

# Install dependencies
pnpm install

# Start development mode (watch for file changes)
pnpm dev

# Build the theme
pnpm build

# Build and package the theme
pnpm rebuild:full
```

### Project Structure

```
theme-aurora/
├── templates/          # Thymeleaf template files
│   ├── modules/       # Reusable module components
│   └── widgets/       # Sidebar widgets
├── src/               # Source code
│   ├── styles/        # CSS style files
│   └── main.ts        # JavaScript entry file
├── i18n/              # Internationalization files
├── settings.yaml      # Theme settings configuration
└── theme.yaml         # Theme metadata
```

For more development documentation, please refer to: [Halo Theme Development Documentation](https://docs.halo.run/developer-guide/theme/prepare)

## 📝 Features

### Layout System

- **Three-Column Layout**: Supports left and right sidebars with automatic content adaptation
- **Responsive Design**: Automatically switches to single-column layout on mobile devices
- **Sticky Sidebar**: Table of contents and sidebar components support sticky positioning

### Page Templates

- Homepage: Supports full-screen banner, post list, featured posts
- Post Detail Page: Supports table of contents navigation, related posts
- Tag/Category Pages: Supports tag filtering, category display
- Archive Page: Groups posts by date
- Moments Page: Social media-like dynamic display

### Components

- Post Cards: Multiple styles available
- Tag Filter: Supports collapse and expand
- Table of Contents: Auto-generated with sticky positioning
- Scroll to Top Button: Smooth scroll animation

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [GPL-3.0](LICENSE) License.

## 🔗 Related Links

- [Halo Official Website](https://halo.run)
- [Halo Documentation](https://docs.halo.run)
- [Issue Tracker](https://github.com/xgs87762GH/theme-aurora/issues)
- [Theme Store](https://halo.run/store/themes)

## 🙏 Acknowledgments

Thanks to all developers who have contributed to this project!

---

Made with ❤️ by [Halo](https://github.com/halo-dev)

