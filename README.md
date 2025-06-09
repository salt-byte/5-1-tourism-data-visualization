# May Day Reverse Tourism Data Visualization

一个现代简约风格的多巴胺配色数据可视化网站，展示五一反向旅游趋势和生活方式数据。

## 🌟 项目特色

- **现代设计**: 采用多巴胺配色方案，年轻活力的视觉风格
- **响应式布局**: 完美适配桌面端和移动端设备
- **交互式图表**: 使用 ECharts 实现丰富的数据可视化
- **流畅动画**: CSS 动画和页面过渡效果
- **模块化架构**: 清晰的文件结构，易于维护和扩展

## 📁 项目结构

```
data visualize/
├── index.html              # 主页面
├── heat.html               # 热力图页面
├── routes.html             # 旅游路线页面
├── consumption.html        # 消费分析页面
├── buzzword.html           # 热词分析页面
├── fashion.html            # 时尚趋势页面
├── favicon.svg             # 网站图标
├── README.md               # 项目说明
├── styles/
│   ├── main.css           # 主样式文件
│   └── pages.css          # 页面样式文件
└── scripts/
    ├── main.js            # 主脚本文件
    ├── heat.js            # 热力图脚本
    ├── routes.js          # 路线图脚本
    ├── consumption.js     # 消费分析脚本
    ├── buzzword.js        # 热词分析脚本
    └── fashion.js         # 时尚趋势脚本
```

## 🚀 快速开始

### 方法一：直接打开
1. 双击 `index.html` 文件在浏览器中打开
2. 通过导航栏访问不同的数据可视化页面

### 方法二：本地服务器（推荐）
1. 在项目目录下启动本地服务器：
   ```bash
   # 使用 Python
   python3 -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   ```
2. 在浏览器中访问 `http://localhost:8000`

## 📊 页面功能

### 🏠 主页 (index.html)
- 网站介绍和导航
- 现代化的英雄区域设计
- 浮动装饰元素动画

### 🔥 热力图 (heat.html)
- 地理位置热力图可视化
- 时间和数据类型过滤器
- 关键洞察展示

### 🛣️ 旅游路线 (routes.html)
- 网络图展示热门路线
- 路线统计和分析
- 交互式路径探索

### 💰 消费分析 (consumption.html)
- 消费类别饼图
- 每日消费趋势
- 支付方式偏好

### 🔤 热词分析 (buzzword.html)
- 社交媒体词云图
- 标签趋势分析
- 情感分析展示

### 👗 时尚趋势 (fashion.html)
- 时尚风格分类
- 颜色和图案趋势
- 生活方式洞察

## 🎨 设计特色

### 配色方案
- **主色调**: 多巴胺配色（明亮、活力）
- **辅助色**: 柔和渐变和阴影
- **文字色**: 高对比度，确保可读性

### 字体
- **主字体**: Poppins (Google Fonts)
- **特点**: 现代、清晰、国际化

### 动画效果
- 页面加载淡入动画
- 元素悬停交互效果
- 平滑的页面过渡

## 🛠️ 技术栈

- **前端框架**: 原生 HTML5 + CSS3 + JavaScript
- **图表库**: ECharts 5.4.3
- **词云插件**: ECharts WordCloud 2.1.0
- **字体**: Google Fonts (Poppins)
- **图标**: SVG 矢量图标

## 📱 响应式设计

- **桌面端**: 1200px+ 完整布局
- **平板端**: 768px-1199px 适配布局
- **移动端**: <768px 折叠导航和垂直布局

## 🔧 自定义配置

### 修改配色
在 `styles/main.css` 中修改 CSS 变量：
```css
:root {
    --primary-color: #4ECDC4;
    --secondary-color: #45B7D1;
    --accent-color: #FF6B6B;
    /* 更多颜色变量... */
}
```

### 更新数据
在对应的 JavaScript 文件中修改示例数据：
- `scripts/heat.js` - 热力图数据
- `scripts/routes.js` - 路线数据
- `scripts/consumption.js` - 消费数据
- `scripts/buzzword.js` - 热词数据
- `scripts/fashion.js` - 时尚数据

## 🌐 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 许可证

本项目仅供学习和演示使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

---

**享受探索五一反向旅游的数据之旅！** 🎉