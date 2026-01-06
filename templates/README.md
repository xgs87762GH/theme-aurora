# 模板文件说明文档

本文档说明 `templates` 文件夹中所有 HTML 模板文件的用途。

## 📄 核心页面模板（必需）

### 基础页面

- **`index.html`** - 首页，显示文章列表，支持全屏横幅和特色文章展示
- **`post.html`** - 文章详情页，显示单篇文章内容，支持目录导航
- **`page.html`** - 单页，用于"关于"、"联系"等独立页面

### 分类与标签

- **`category.html`** - 单个分类页面，显示该分类下的所有文章
- **`categories.html`** - 分类列表页，显示所有分类
- **`tag.html`** - 单个标签页面，显示该标签下的所有文章
- **`tags.html`** - 标签列表页，显示所有标签，支持标签筛选功能

### 其他页面

- **`archives.html`** - 归档页，按年月分组显示所有文章（可选）
- **`author.html`** - 作者页，显示某个作者的所有文章（可选）
- **`moments.html`** - 瞬间页，类似社交媒体的动态展示（可选）
- **`error/error.html`** - 错误页面，显示 404、500 等错误（必需）

## 🎨 核心布局模块（modules/）

### 基础布局

- **`modules/layout.html`** - 主布局模板，所有页面的基础框架，包含返回顶部按钮
- **`modules/base-head.html`** - HTML 头部，包含 meta、CSS、JS 引用
- **`modules/header.html`** - 网站顶部导航栏，包含 Logo、菜单和移动端菜单
- **`modules/footer.html`** - 网站底部，包含版权信息、社交链接等

### 内容组件

- **`modules/post-card.html`** - 文章卡片组件，用于文章列表展示，支持多种样式
- **`modules/pagination.html`** - 分页组件，用于文章列表翻页
- **`modules/home-layout.html`** - 首页专用布局，包含三栏布局系统和顶部横幅
- **`modules/hero.html`** - 英雄区域，用于非首页的顶部横幅
- **`modules/sidebar.html`** - 侧边栏容器，用于加载小部件
- **`modules/configured-sidebar.html`** - 配置的侧边栏组件，用于加载用户配置的小部件

### 功能组件

- **`modules/featured-post-card.html`** - 特色文章卡片，用于首页顶部大图展示（可选）
- **`modules/footer-social.html`** - 页脚社交链接组件（可选）
- **`modules/tag-filter.html`** - 标签筛选组件，支持折叠展开功能，用于标签列表页

## 🎯 侧边栏小部件（modules/sidebar-widgets/）

这些小部件可以通过后台配置在侧边栏中启用或禁用：

- **`modules/sidebar-widgets/profile.html`** - 个人资料卡片（站点信息、统计数据）
- **`modules/sidebar-widgets/categories.html`** - 分类列表小部件
- **`modules/sidebar-widgets/tags.html`** - 标签云小部件
- **`modules/sidebar-widgets/popular-posts.html`** - 热门文章小部件
- **`modules/sidebar-widgets/latest-comments.html`** - 最新评论小部件
- **`modules/sidebar-widgets/announcement.html`** - 公告小部件，用于显示站点公告

> **注意**：`modules/widgets/` 目录是用于后台仪表盘的部件，侧边栏小部件应放在 `modules/sidebar-widgets/` 目录下。

## 🎨 布局系统

### 三栏布局系统

主题采用灵活的三栏布局系统，通过 `modules/home-layout.html` 中的 `three-column-layout-auto` 片段实现：

- **主内容区**：中间区域显示主要内容
- **左侧边栏**：可选的左侧边栏，用于显示小部件
- **右侧边栏**：可选的右侧边栏，用于显示目录、小部件等

布局会根据内容自动调整：

- 桌面端：三栏或两栏布局
- 平板端：两栏布局
- 移动端：单栏布局

### 响应式设计

所有模板都采用响应式设计，完美适配各种设备尺寸。

## 📝 使用说明

1. **必需文件**：不要删除标记为"必需"的文件，否则网站将无法正常运行
2. **可选文件**：标记为"可选"的文件可以根据需要删除，删除后相关功能将不可用
3. **小部件**：侧边栏小部件通过后台主题设置中的"侧边栏小部件"配置来启用/禁用
4. **布局系统**：三栏布局系统会自动检测侧边栏内容，如果没有内容则自动隐藏侧边栏

## ⚠️ 注意事项

- 删除模板文件前，请确保没有其他模板引用该文件
- 建议在删除前先备份文件
- 删除可选页面模板（如 `archives.html`、`moments.html`）不会影响核心功能
- 修改布局相关文件时，注意保持三栏布局系统的完整性
- `tag-filter.html` 组件依赖于 Alpine.js，确保已正确引入

## 🔧 自定义开发

### 添加新页面

1. 在 `templates/` 目录下创建新的 HTML 文件
2. 使用 `th:replace="~{modules/layout :: html(...)}"` 引用主布局
3. 或者使用 `th:replace="~{modules/home-layout :: three-column-layout-auto(...)}"` 使用三栏布局

### 添加新组件

1. 在 `modules/` 目录下创建新的组件文件
2. 使用 Thymeleaf 片段语法定义可复用的组件
3. 在其他模板中使用 `th:replace` 或 `th:include` 引用组件

### 添加新小部件

1. 在 `modules/sidebar-widgets/` 目录下创建新的小部件文件
2. 在 `settings.yaml` 中配置小部件的启用选项
3. 小部件会自动在侧边栏中显示
