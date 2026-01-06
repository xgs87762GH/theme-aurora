# Aurora Theme for Halo 2.0

一个现代、美观的 Halo 2.0 主题，采用极光（Aurora）设计理念，提供优雅的用户体验。

![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)
![Halo](https://img.shields.io/badge/Halo-%3E%3D2.20.0-green.svg)
![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)

## ✨ 特性

- 🎨 **现代化设计** - 简洁优雅的界面设计，支持深色模式
- 📱 **响应式布局** - 完美适配桌面、平板和移动设备
- 🎯 **三栏布局系统** - 灵活的内容布局，支持左右侧边栏
- 🌈 **全屏横幅** - 支持全屏顶部横幅，带有流畅的滚动动画效果
- 🎭 **丰富的组件** - 文章卡片、标签筛选、目录导航等
- 🎨 **Layui 主题色** - 集成 Layui 配色方案，提供统一的视觉体验
- ⚡ **性能优化** - 使用 Vite 构建，快速加载
- 🎪 **可配置性强** - 丰富的主题设置选项

## 🛠️ 技术栈

- [Vite](https://vitejs.dev/) - 快速的前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - 内容样式插件
- [Iconify](https://iconify.design/) - 统一的图标库
- [Alpine.js](https://alpinejs.dev/) - 轻量级 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript

## 📦 安装

### 方式一：从 Halo 后台安装

1. 登录 Halo 后台
2. 进入「外观」→「主题」
3. 点击「安装」→「从主题市场安装」
4. 搜索「Aurora」并安装

### 方式二：手动安装

1. 下载主题压缩包（从 [Releases](https://github.com/xgs87762GH/theme-aurora/releases) 下载）
2. 登录 Halo 后台
3. 进入「外观」→「主题」
4. 点击「安装」→「上传主题」
5. 选择下载的压缩包并上传

## 🚀 使用

安装完成后，在 Halo 后台的「外观」→「主题」中激活 Aurora 主题。

### 主题设置

主题提供了丰富的配置选项，包括：

- 全局设置：Logo、颜色方案切换等
- 首页设置：顶部横幅、文章列表样式等
- 文章设置：目录显示、文章样式等
- 页脚设置：版权信息、社交链接等

## 🛠️ 开发

如果你想参与开发或自定义主题，可以按照以下步骤：

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开始开发

```bash
# 克隆仓库
git clone https://github.com/xgs87762GH/theme-aurora.git
cd theme-aurora

# 安装依赖
pnpm install

# 启动开发模式（监听文件变化）
pnpm dev

# 构建主题
pnpm build

# 构建并打包主题
pnpm rebuild:full
```

### 项目结构

```
theme-aurora/
├── templates/          # Thymeleaf 模板文件
│   ├── modules/       # 可复用的模块组件
│   └── widgets/       # 侧边栏小部件
├── src/               # 源代码
│   ├── styles/        # CSS 样式文件
│   └── main.ts        # JavaScript 入口文件
├── i18n/              # 国际化文件
├── settings.yaml      # 主题设置配置
└── theme.yaml         # 主题元数据
```

更多开发文档请参考：[Halo 主题开发文档](https://docs.halo.run/developer-guide/theme/prepare)

## 📝 功能特性

### 布局系统

- **三栏布局**：支持左右侧边栏，自动适配内容
- **响应式设计**：移动端自动切换为单栏布局
- **粘性侧边栏**：目录和侧边栏组件支持粘性定位

### 页面模板

- 首页：支持全屏横幅、文章列表、特色文章
- 文章详情页：支持目录导航、相关文章
- 标签/分类页：支持标签筛选、分类展示
- 归档页：按时间分组展示文章
- 瞬间页：类似社交媒体的动态展示

### 组件

- 文章卡片：多种样式可选
- 标签筛选：支持折叠展开
- 目录导航：自动生成，支持粘性定位
- 返回顶部按钮：平滑滚动动画

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [GPL-3.0](LICENSE) 许可证。

## 🔗 相关链接

- [Halo 官网](https://halo.run)
- [Halo 文档](https://docs.halo.run)
- [问题反馈](https://github.com/xgs87762GH/theme-aurora/issues)
- [主题市场](https://halo.run/store/themes)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

Made with ❤️ by [Halo](https://github.com/halo-dev)
