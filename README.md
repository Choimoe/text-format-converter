# 自定义文本替换工具 (Text Format Converter)

一个强大、灵活的Web端批量文本查找与替换工具，支持自定义规则和预设，专为提升内容处理效率而生。

[在线体验 (Placeholder Link)]()

## 📖 项目简介

在日常的内容创作、代码迁移或数据清理工作中，我们经常需要进行大量重复的文本替换操作。例如，将特定格式的Markdown公式转换为WordPress插件支持的短代码，或批量修正文章中的特定词汇。手动操作不仅效率低下，还容易出错。

`自定义文本替换工具` 是一个纯前端的静态Web应用，它提供了一个直观的图形界面，让您能够：

- **动态创建** 复杂的查找替换规则。
- **保存并加载** 常用的规则集（预设）。
- **一键完成** 大段文本的批量转换。

本项目无需任何后端服务，所有操作均在您的浏览器中完成，确保了数据的私密性和使用的便捷性。

## ✨ 功能特性

- **动态规则管理**: 自由添加、删除和编辑转换规则，满足各种复杂场景。
- **双模式替换**:
  - **直接替换**: 基础的查找与替换功能。
  - **左右匹配**: 通过定界符（如 `$`...`$` 或 `{{`...`}}`）包裹内容进行替换，并支持引用捕获的内容。
- **高级匹配选项**:
  - **大小写敏感**: 精确控制匹配过程。
  - **全字匹配**: 避免错误替换单词的一部分。
  - **跨行匹配**: 轻松处理跨越多行的代码块或文本段落。
- **预设系统**: 将常用的规则组合保存为预设方案，一键加载，方便团队协作和个人使用。
- **纯静态与响应式**: 无需服务器，下载即用。界面在桌面和移动设备上均有良好体验。
- **清晰的模块化结构**: 项目代码（HTML/CSS/JS）完全分离，易于理解、维护和二次开发。

## 🚀 快速上手

在本地运行本项目非常简单：

1. **克隆仓库**

   ```
   git clone https://github.com/Choimoe/text-format-converter.git
   ```

2. **进入项目目录**

   ```
   cd text-format-converter
   ```

3. **在浏览器中打开** 直接使用浏览器打开 `index.html` 文件即可开始使用。

## 📁 目录结构

项目采用了清晰的前后端分离结构：

```
text-format-converter/
├── index.html          # ➡️ 应用主入口HTML文件
├── css/
│   └── style.css       # 🎨 全局样式表
└── js/
    ├── presets.js      # ⚙️ 预设规则配置文件
    └── script.js       # 🧠 核心交互与转换逻辑
```

## 🛠️ 使用指南

1. **加载预设**: 通过顶部的下拉菜单选择一个预设方案（例如，“Markup Markdown+KaTeX 插件”），相关的规则会自动加载到下方。
2. **管理规则**:
   - 点击 **`[添加新规则]`** 按钮来创建一个空的规则卡片。
   - 点击每张规则卡片右上角的 **`[× 删除]`** 按钮来移除该规则。
   - 修改任何规则后，预设下拉菜单会自动切换到“自定义规则”状态。
3. **配置规则**:
   - **规则类型**:
     - `直接替换`: 在“Find”输入框中填入要查找的文本。
     - `左右匹配`: 分别在“Left Delimiter”和“Right Delimiter”中填入开始和结束符号。
   - **替换内容**:
     - 在“Replace With”输入框中填入希望替换成的内容。
     - 当使用`左右匹配`时，您可以使用 **`$1`** 来引用被左右定界符包裹的原始内容。
   - **匹配选项**:
     - `Case Sensitive`: 区分大小写。
     - `Whole Word`: （仅限直接替换）匹配独立的单词。
     - `Match across lines`: （仅限左右匹配）允许定界符跨越多行进行匹配，非常适合处理代码块。
4. **执行转换**: 在左侧“原始内容”文本框中粘贴您的文本，点击 **`[立即转换]`** 按钮，结果将显示在右侧。

## 🔧 自定义与扩展

为项目添加您自己的预设规则非常简单。

1. **打开 `js/presets.js` 文件。**
2. 在 `presets` 对象中，仿照现有格式添加一个新的键值对。

**示例：添加一个用于HTML转义的预设**

```
const presets = {
    "markup-markdown-katex": {
        // ... 已有规则 ...
    },
    // 在这里添加您的新预设
    "html-escape": {
        name: "HTML特殊字符转义",
        rules: [
            {
                type: 'direct',
                find: '&',
                replacement: '&amp;',
                caseSensitive: true,
                wholeWord: false,
            },
            {
                type: 'direct',
                find: '<',
                replacement: '&lt;',
                caseSensitive: true,
                wholeWord: false,
            },
            {
                type: 'direct',
                find: '>',
                replacement: '&gt;',
                caseSensitive: true,
                wholeWord: false,
            }
        ]
    }
};
```

保存文件后，重新加载 `index.html`，新的预设就会出现在下拉菜单中。

## 🤝 如何贡献

欢迎您为本项目贡献代码或提出建议！请遵循以下步骤：

1. **Fork** 本仓库。
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 将您的分支推送到远程仓库 (`git push origin feature/AmazingFeature`)。
5. 创建一个 **Pull Request**。

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。