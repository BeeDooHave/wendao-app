# 问道 · 修真自律 App (v0.2)

把枯燥的自律包装成一场修仙之旅。

完成现实中的学习、运动、冥想、长期目标 → 累积修为 → 突破境界 → 从炼气走到飞升。

> v0.2 是**纯自用版**：所有数据保存在你的设备 localStorage，不上传任何服务器、不需要登录。

---

## ✨ 当前功能

- **入门**：自动生成道号（也可自定义）
- **角色面板**：境界 + 修为条 + 连续天数 + 今日修炼分钟
- **修炼大厅**：自定义任意"功法"（任务），支持每日/学习/运动/冥想/长期目标五类
- **闭关计时**：番茄钟全屏沉浸，切出 App 自动降为 ×0.8 系数
- **境界突破**：达到修为门槛自动触发突破动画
- **典籍统计**：近 7 日修为柱状图 + 最近闭关记录
- **数据导入导出**：JSON 格式备份你的所有数据
- **PWA**：可"添加到主屏幕"当原生 App 用，完全离线可用

## 🏔 修真境界（共 9 阶 34 级）

炼气 → 筑基 → 金丹 → 元婴 → 化神 → 炼虚 → 合体 → 大乘 → 渡劫飞升

每阶分初/中/后/圆满四级。完整修真到飞升约需累计修为 25 万点。

## 📐 修为公式

```
修为 = 实际时长(分钟) × 难度系数 × 专注系数
```

- 难度：易 ×1.0 / 中 ×1.5 / 难 ×2.5 / 极难 ×4.0
- 专注：全程不切出 App ×1.2，中途切出 ×0.8

---

## 🚀 怎么用

### 方法 1：本地打开（最快）

直接双击 `index.html` 在浏览器里打开就能用。但 PWA 安装到主屏需要 https，所以推荐方法 2/3。

### 方法 2：用 Python 起个本地服务器

```bash
cd /path/to/wendao-app
python3 -m http.server 8000
```

然后浏览器打开 `http://localhost:8000`。

### 方法 3：部署到 GitHub Pages（最推荐，免费 + https + 手机随时打开）

见下方"GitHub 上传指南"。

### 📱 添加到 iPhone 主屏

1. 用 Safari 打开 App 网址（GitHub Pages 部署后的链接）
2. 点底部"分享"按钮 → 选"添加到主屏幕"
3. 命名为"问道" → 完成
4. 从此以后从主屏图标打开，全屏无浏览器栏，看起来就是原生 App

### 📱 添加到安卓主屏

1. 用 Chrome 打开 App 网址
2. 浏览器会自动提示"添加到主屏幕"
3. 或手动点右上角菜单 → 安装应用

---

## 📂 文件结构

```
wendao-app/
├── index.html        # 单页 HTML（所有 UI）
├── styles.css        # 全部样式
├── app.js            # 全部逻辑
├── manifest.json     # PWA 元信息
├── sw.js             # Service Worker（离线缓存）
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

总共 ~60KB，无任何外部依赖。

---

## 🛠 GitHub 上传指南

如果你想把这个 App 部署到 GitHub Pages（永久在线 + 免费 + https + 手机随时用），按下面步骤：

### 一次性准备

1. 注册 GitHub 账号（如果还没有）：https://github.com/signup
2. 安装 Git：
   - macOS：终端运行 `git --version`，会提示安装；或访问 https://git-scm.com
   - Windows：https://git-scm.com/download/win

### 创建仓库 + 上传

在 GitHub 网页：

1. 点右上角 `+` → `New repository`
2. Repository name：`wendao-app`（或你喜欢的名字）
3. 选 **Public**（这样才能用免费的 GitHub Pages）
4. 不要勾选 "Add a README"（我们已经有了）
5. 点 `Create repository`

然后在本地终端（macOS 是 Terminal，Windows 是 PowerShell）：

```bash
# 进入项目文件夹
cd /path/to/wendao-app

# 初始化 git
git init
git add .
git commit -m "初版：问道修真自律应用"

# 关联远程仓库（把 YOUR_USERNAME 换成你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/wendao-app.git
git branch -M main
git push -u origin main
```

第一次 push 会要求登录：用户名输 GitHub 用户名，密码处需要的是 **Personal Access Token**（不是 GitHub 密码）：
- 生成 token：https://github.com/settings/tokens → Generate new token (classic) → 勾选 `repo` 权限 → 生成
- 把生成的 token 复制下来当密码用

### 开启 GitHub Pages

1. 进入刚才创建的仓库页面
2. `Settings` → 左侧 `Pages`
3. Source 选 `Deploy from a branch`
4. Branch 选 `main`，文件夹选 `/ (root)`
5. 点 Save
6. 等 1–2 分钟，页面顶部会出现网址：`https://YOUR_USERNAME.github.io/wendao-app/`

打开这个网址，加到 iPhone 主屏，开始修炼。

### 以后更新代码

```bash
cd /path/to/wendao-app
git add .
git commit -m "更新：xxx"
git push
```

GitHub Pages 会自动重新部署，约 1 分钟后生效。

---

## 🗺 接下来可能加的功能（按优先级）

- [ ] 任务"长按拖动排序"
- [ ] 任务完成的音效（铜铃声）
- [ ] 闭关时的背景白噪音（雨声/古琴/木鱼）
- [ ] 灵根测试（5 题，决定不同任务加成）
- [ ] 渡厄符（补签）机制
- [ ] "道友寄语"剧情系统（断签时的关怀文案）
- [ ] 突破时生成可分享的"突破文书"卡片
- [ ] 数据云同步（可选，比如 GitHub Gist / iCloud）

要做哪个，告诉我，继续干。

---

## 🧘 设计哲学

**这个 App 不会有的东西**：
- ❌ 登录注册
- ❌ 广告
- ❌ 体力 / 等待时间付费
- ❌ 开宝箱 / 抽卡
- ❌ 排行榜竞争（修行是自己的事）
- ❌ 数据上传服务器

**这个 App 永远会有的东西**：
- ✓ 断签从不掉境界（最差停在原地）
- ✓ 完整数据导出，随时迁出
- ✓ 古意文案，不喊"加油"
- ✓ 修真世界观下的温柔陪伴

---

修真不是逃避现实，而是把现实活成一场修行。
