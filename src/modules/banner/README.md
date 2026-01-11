# Banner 鼠标滚动事件处理器

## 触发条件

滚动事件仅在以下条件**全部满足**时才会触发：

1. **Banner 是全屏模式**：`data-full-screen="true"`
2. **Banner 高度超过视口 1/3**：`bannerHeight > viewportHeight / 3`

## 触发流程

```
用户滚动鼠标
    ↓
testWheelHandler (fullscreen-effect.ts:363)
    ↓
handleWheel (wheel-scroll-handler.ts:118)
    ↓
shouldTriggerScroll (wheel-scroll-handler.ts:36) - 检查条件
    ↓ (条件满足)
累积滚轮增量 → 防抖检查 → 阈值检查
    ↓ (满足所有条件)
scrollToContent() 或 scrollToTop() (wheel-scroll-handler.ts:85/94)
```

## 关键函数位置

### 1. 初始化函数
- **位置**: `src/modules/banner/fullscreen-effect.ts:141-147`
- **函数**: `initFullScreenBannerEffect()` 中的条件检查
- **作用**: 检查 Banner 是否全屏且高度超过视口 1/3，如果满足则初始化滚动处理器

### 2. 滚动处理器初始化
- **位置**: `src/modules/banner/wheel-scroll-handler.ts:222`
- **函数**: `initBannerWheelScrollHandler()`
- **作用**: 创建滚动事件处理器并绑定到 document 和 banner 元素

### 3. 条件检查函数
- **位置**: `src/modules/banner/wheel-scroll-handler.ts:36`
- **函数**: `shouldTriggerScroll()`
- **作用**: 每次滚动时检查 Banner 是否全屏且高度超过视口 1/3

### 4. 滚轮事件处理函数
- **位置**: `src/modules/banner/wheel-scroll-handler.ts:118`
- **函数**: `handleWheel()`
- **作用**: 处理滚轮事件，累积增量，检查防抖和阈值，触发跳转

### 5. 跳转函数
- **位置**: `src/modules/banner/wheel-scroll-handler.ts:85` 和 `94`
- **函数**: `scrollToContent()` 和 `scrollToTop()`
- **作用**: 执行实际的滚动跳转

## 配置参数

- **阈值 (threshold)**: 50（滚轮增量累积值）
- **防抖时间 (debounce)**: 300ms
- **高度阈值**: 视口高度的 1/3

## 调试信息

所有关键步骤都有 `console.log` 输出，包括：
- 条件检查结果
- 防抖状态
- 阈值检查
- 触发状态
- 跳转方向

