/* =================================================================
 * 《问道》修真自律 App · v0.2 (自用版)
 * ----------------------------------------------------------------
 * 全部数据保存在 localStorage，不上传任何服务器。
 * ================================================================= */

// ============== 修真世界观常量 ==============
const REALMS = [
  // [境界名, 累计修为下限]
  ["炼气初期", 0],     ["炼气中期", 75],   ["炼气后期", 150],   ["炼气圆满", 225],
  ["筑基初期", 300],   ["筑基中期", 525],  ["筑基后期", 750],   ["筑基圆满", 975],
  ["金丹初期", 1200],  ["金丹中期", 1800], ["金丹后期", 2400],  ["金丹圆满", 3000],
  ["元婴初期", 3600],  ["元婴中期", 4950], ["元婴后期", 6300],  ["元婴圆满", 7650],
  ["化神初期", 9000],  ["化神中期", 11750],["化神后期", 14500], ["化神圆满", 17250],
  ["炼虚初期", 20000], ["炼虚中期", 26250],["炼虚后期", 32500], ["炼虚圆满", 38750],
  ["合体初期", 45000], ["合体中期", 56250],["合体后期", 67500], ["合体圆满", 78750],
  ["大乘初期", 90000], ["大乘中期", 112500],["大乘后期",135000],["大乘圆满",157500],
  ["渡劫期",   180000],["飞升在即", 250000],
];

// 道号生成池
const DAO_NAMES_1 = ["玄","清","云","紫","青","白","素","沧","赤","空","幽","渺","元","真","太","无"];
const DAO_NAMES_2 = ["微","机","虚","渊","霄","羽","尘","川","岚","松","泉","雪","月","风","岳","澜"];
const DAO_NAMES_3 = ["子","真人","散人","道人","居士","上人","先生","真君"];

// 任务图标（内置 SVG，避免不同设备的 emoji 风格漂移）
const TASK_ICONS = {
  daily: "sunrise", study: "book", sport: "body", meditate: "lotus", goal: "target", other: "spark"
};
const CAT_NAMES = {
  daily: "每日打卡", study: "学习", sport: "运动", meditate: "冥想", goal: "长期目标", other: "其他"
};

// 禅意文案
const QUOTES = [
  "心若不动，万物皆静",
  "守一不移，乃为修行",
  "静水流深，沧笙踏歌",
  "山不言自高，水不言自深",
  "致虚极，守静笃",
  "万法归一，一归于无",
  "道在日常，不在远方",
  "持之以恒，方见真我",
];

// 起步提示语（按状态）
const REMINDERS = {
  newbie: "初入仙门，先从一柱香开始吧。",
  back: "暂别数日，可愿重拾道心？",
  near: "修为将满，可往后山闭关，准备突破之机。",
  daily: "今日尚未修炼，莫负光阴。",
  good: "道心已稳，持之以恒，必有所成。",
};

const PASSIVE_CULTIVATION_PER_HOUR = 2;
const PASSIVE_CULTIVATION_CAP_HOURS = 24;

// ============== 数据层 ==============
const STORAGE_KEY = "wendao.state.v1";
const DEMO_SNAPSHOT_KEY = "wendao.demo.snapshot.v1";

const DEFAULT_STATE = {
  name: "玄微子",
  createdAt: null,           // 入门时间 ISO
  cultivation: 0,            // 累计修为
  realmIdx: 0,               // 当前境界索引
  streak: 0,                 // 连续修炼天数
  lastDay: null,             // 上次完成任务的日期 YYYY-MM-DD
  maxStreak: 0,              // 历史最长连续
  passiveUpdatedAt: null,    // 静修累积计算时间戳
  pendingBreakthrough: null, // 自动静修跨境后的待展示演出
  tasks: [],                 // [{id,name,desc,cat,duration,difficulty}]
  logs: [],                  // [{id,taskId,taskName,date,minutes,gain,focused}]
};

let S = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...data };
  } catch (e) {
    console.error("Load failed:", e);
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

function resetState() {
  if (!confirm("确定要重置全部数据，重新入门吗？\n此操作不可恢复。")) return;
  localStorage.removeItem(STORAGE_KEY);
  S = null;
  location.reload();
}

// ============== 工具函数 ==============
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function daysBetween(a, b) {
  // a, b: YYYY-MM-DD
  const A = new Date(a), B = new Date(b);
  return Math.round((B - A) / 86400000);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollDaoName() {
  return rand(DAO_NAMES_1) + rand(DAO_NAMES_2) + rand(DAO_NAMES_3);
}

function getRealm(cult) {
  let idx = 0;
  for (let i = 0; i < REALMS.length; i++) {
    if (cult >= REALMS[i][1]) idx = i;
  }
  return idx;
}

function nextRealmThreshold(idx) {
  if (idx + 1 < REALMS.length) return REALMS[idx + 1][1];
  return REALMS[REALMS.length - 1][1];
}

function realmProgress(cult, idx) {
  const lo = REALMS[idx][1];
  const hi = idx + 1 < REALMS.length ? REALMS[idx + 1][1] : lo + 1000;
  return Math.min(100, ((cult - lo) / (hi - lo)) * 100);
}

const REALM_MAJOR_CLASSES = ["realm-major-qi", "realm-major-foundation", "realm-major-golden", "realm-major-nascent", "realm-major-deity", "realm-major-void", "realm-major-union", "realm-major-mahayana", "realm-major-tribulation"];
const REALM_STAGE_CLASSES = ["realm-stage-early", "realm-stage-middle", "realm-stage-late", "realm-stage-perfect"];

function setRealmVisualState(realmIdx) {
  const majorIdx = realmIdx >= 32 ? 8 : Math.min(7, Math.floor(realmIdx / 4));
  const stageIdx = realmIdx < 32 ? realmIdx % 4 : 3;
  document.body.classList.remove(...REALM_MAJOR_CLASSES, ...REALM_STAGE_CLASSES);
  document.body.classList.add(REALM_MAJOR_CLASSES[majorIdx], REALM_STAGE_CLASSES[stageIdx]);
}

function formatCultivation(value) {
  return value < 100 ? value.toFixed(1) : Math.round(value).toLocaleString();
}

function focusedGain(task) {
  return Math.round(task.duration * task.difficulty * 1.2);
}

function accruePassiveCultivation() {
  if (!S || !S.createdAt || medState || document.body.classList.contains("in-meditation")) return;
  const now = Date.now();
  if (!S.passiveUpdatedAt) {
    S.passiveUpdatedAt = now;
    saveState();
    return;
  }
  const elapsedHours = Math.min(
    Math.max(0, now - S.passiveUpdatedAt) / 3600000,
    PASSIVE_CULTIVATION_CAP_HOURS
  );
  if (!elapsedHours) return;

  const oldRealm = S.realmIdx;
  S.cultivation += elapsedHours * PASSIVE_CULTIVATION_PER_HOUR;
  S.passiveUpdatedAt = now;
  const newRealm = getRealm(S.cultivation);
  if (newRealm > oldRealm) {
    S.realmIdx = newRealm;
    S.pendingBreakthrough = { oldRealm, newRealm };
  }
  saveState();
}

// ============== 路由（视图切换） ==============
const VIEWS = ["onboarding","home","tasks","stats","me"];
let currentView = "home";

function showView(name) {
  VIEWS.forEach(v => {
    const el = document.querySelector(`[data-view="${v}"]`);
    if (el) el.hidden = v !== name;
  });
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.go === name);
  });
  document.getElementById("tabbar").hidden = (name === "onboarding");
  currentView = name;
  window.scrollTo(0, 0);
  if (name === "home") renderHome();
  if (name === "tasks") renderTasks();
  if (name === "stats") renderStats();
  if (name === "me") renderMe();
}

// ============== 入门流程 ==============
function initOnboarding() {
  const nameEl = document.getElementById("onb-name");
  const inputEl = document.getElementById("onb-name-input");
  let rolled = rollDaoName();
  nameEl.textContent = rolled;

  document.getElementById("btn-reroll").onclick = () => {
    rolled = rollDaoName();
    nameEl.textContent = rolled;
    inputEl.value = "";
  };

  document.getElementById("btn-enter").onclick = () => {
    const custom = inputEl.value.trim();
    const finalName = custom || rolled;
    S = JSON.parse(JSON.stringify(DEFAULT_STATE));
    S.name = finalName;
    S.createdAt = new Date().toISOString();
    S.passiveUpdatedAt = Date.now();
    // 给一些示例任务
    S.tasks = [
      { id: uid(), name: "晨起吐纳", desc: "起床 + 喝水 + 拉伸", cat: "daily", duration: 10, difficulty: 1.0 },
      { id: uid(), name: "研读古籍", desc: "专注阅读/学习", cat: "study", duration: 25, difficulty: 1.5 },
      { id: uid(), name: "淬体炼骨", desc: "运动/健身", cat: "sport", duration: 30, difficulty: 1.5 },
    ];
    saveState();
    showView("home");
  };
}

// ============== 主界面 ==============
function renderHome(options = {}) {
  if (!S) return;
  if (!options.skipPassive) accruePassiveCultivation();
  setRealmVisualState(S.realmIdx);
  const realmName = REALMS[S.realmIdx][0];
  document.getElementById("home-realm").textContent = realmName;

  const createdDay = S.createdAt ? dateStr(new Date(S.createdAt)) : null;
  const days = createdDay ? Math.max(1, daysBetween(createdDay, todayStr()) + 1) : 1;

  document.getElementById("home-cult").textContent = formatCultivation(S.cultivation);
  const nextTh = nextRealmThreshold(S.realmIdx);
  const remain = Math.max(0, nextTh - S.cultivation);
  const nextRealm = REALMS[Math.min(S.realmIdx + 1, REALMS.length - 1)][0];
  document.getElementById("home-next-realm").textContent = nextRealm;
  document.getElementById("home-threshold").textContent = Math.round(nextTh).toLocaleString();
  document.getElementById("home-remain").textContent = Math.ceil(remain).toLocaleString();
  document.getElementById("home-speed").textContent = PASSIVE_CULTIVATION_PER_HOUR.toFixed(2);

  const progress = realmProgress(S.cultivation, S.realmIdx);
  document.getElementById("home-fill").style.width = progress + "%";

  const todayLogs = S.logs.filter(l => l.date === todayStr());
  const todayMins = todayLogs.reduce((sum, l) => sum + l.minutes, 0);
  const doneTaskCount = S.tasks.filter(t => todayLogs.some(l => l.taskId === t.id && l.complete)).length;
  document.getElementById("home-passive-top").textContent = PASSIVE_CULTIVATION_PER_HOUR.toFixed(2);
  document.getElementById("home-done-tasks").textContent = doneTaskCount;
  document.getElementById("home-task-count").textContent = S.tasks.length;
  document.getElementById("home-top-remain").textContent = Math.ceil(remain).toLocaleString();

  const unfinishedTasks = S.tasks.filter(t => !todayLogs.some(l => l.taskId === t.id && l.complete));
  const potentialGain = unfinishedTasks.reduce((sum, task) => sum + focusedGain(task), 0);
  const forecast = document.getElementById("home-forecast");
  forecast.classList.remove("ready");
  if (S.realmIdx >= REALMS.length - 1) {
    forecast.textContent = "已至此界巅峰，静候飞升天机";
  } else if (potentialGain >= remain) {
    forecast.textContent = `今日余下功课 +${potentialGain} 修为 · 可突破 ${nextRealm}`;
    forecast.classList.add("ready");
  } else {
    forecast.textContent = `今日余下功课 +${potentialGain} 修为 · 尚差 ${Math.ceil(remain - potentialGain)} 破境`;
  }

  // 提醒文案
  const reminderText = pickReminder(todayMins, remain, days);
  document.getElementById("home-reminder-text").textContent = reminderText;

  // 今日功课（最多 3 个）
  const list = document.getElementById("home-tasks");
  list.innerHTML = "";
  document.getElementById("home-empty").hidden = S.tasks.length > 0;
  S.tasks.slice(0, 3).forEach(t => {
    const doneToday = todayLogs.some(l => l.taskId === t.id);
    const card = document.createElement("div");
    card.className = "task-card" + (doneToday ? " done" : "");
    card.innerHTML = `
      <div class="task-icon">${svgIcon(TASK_ICONS[t.cat] || "spark")}</div>
      <div class="task-info">
        <div class="task-name">${escapeHTML(t.name)}${doneToday ? " ✓" : ""}</div>
        <div class="task-meta">${CAT_NAMES[t.cat]} · ${t.duration} 分钟</div>
      </div>
      <div class="task-reward">+${estimateGain(t)}</div>
    `;
    card.onclick = () => startMeditate(t);
    list.appendChild(card);
  });

  if (S.pendingBreakthrough && !medState) {
    const pending = S.pendingBreakthrough;
    S.pendingBreakthrough = null;
    saveState();
    setTimeout(() => showBreakthrough(REALMS[pending.oldRealm][0], REALMS[pending.newRealm][0]), 0);
  }
}

function pickReminder(todayMins, remain, days) {
  if (S.logs.length === 0) return REMINDERS.newbie;
  const gap = S.lastDay ? daysBetween(S.lastDay, todayStr()) : 0;
  if (gap >= 3) return REMINDERS.back;
  if (remain < 30) return REMINDERS.near;
  if (todayMins === 0) return REMINDERS.daily;
  return REMINDERS.good;
}

function estimateGain(task) {
  // 以保持专注的闭关收益预估，和首页破境预测一致。
  return focusedGain(task);
}

function svgIcon(name, className = "task-symbol") {
  return `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

// ============== 推演模式 ==============
let demoBreakthroughTimer = null;

function openDemoConsole() {
  if (!S) return;
  if (!localStorage.getItem(DEMO_SNAPSHOT_KEY)) {
    localStorage.setItem(DEMO_SNAPSHOT_KEY, JSON.stringify(S));
  }
  document.body.classList.add("demo-mode");
  document.getElementById("demo-console").hidden = false;
  document.getElementById("btn-demo-next").disabled = false;
}

function closeDemoConsole() {
  document.getElementById("demo-console").hidden = true;
}

function simulateNextTask() {
  if (!S || medState) return;
  const today = todayStr();
  const todayLogs = S.logs.filter(l => l.date === today);
  const task = S.tasks.find(t => !todayLogs.some(l => l.taskId === t.id && l.complete));
  if (!task) {
    toast("今日功课均已推演完成，可还原后重试");
    return;
  }

  const oldRealm = S.realmIdx;
  const gain = focusedGain(task);
  S.logs.push({
    id: uid(),
    taskId: task.id,
    taskName: task.name,
    date: today,
    minutes: task.duration,
    gain,
    focused: true,
    complete: true,
    simulated: true,
  });
  S.cultivation += gain;
  S.passiveUpdatedAt = Date.now();
  if (S.lastDay !== today) {
    S.streak = S.lastDay && daysBetween(S.lastDay, today) === 1 ? S.streak + 1 : 1;
    S.lastDay = today;
    S.maxStreak = Math.max(S.maxStreak, S.streak);
  }
  const newRealm = getRealm(S.cultivation);
  saveState();
  renderHome({ skipPassive: true });
  flyGain(gain);
  toast(`推演：${task.name} 完成 · 修为 +${gain}`);

  if (newRealm > oldRealm) {
    const nextButton = document.getElementById("btn-demo-next");
    nextButton.disabled = true;
    if (demoBreakthroughTimer) clearTimeout(demoBreakthroughTimer);
    demoBreakthroughTimer = setTimeout(() => {
      S.realmIdx = newRealm;
      saveState();
      renderHome({ skipPassive: true });
      closeDemoConsole();
      showBreakthrough(REALMS[oldRealm][0], REALMS[newRealm][0]);
      nextButton.disabled = false;
      demoBreakthroughTimer = null;
    }, 850);
  }
}

function restoreDemoSnapshot() {
  const raw = localStorage.getItem(DEMO_SNAPSHOT_KEY);
  if (!raw) {
    toast("当前没有可还原的推演记录");
    return;
  }
  if (demoBreakthroughTimer) {
    clearTimeout(demoBreakthroughTimer);
    demoBreakthroughTimer = null;
  }
  S = { ...DEFAULT_STATE, ...JSON.parse(raw) };
  localStorage.removeItem(DEMO_SNAPSHOT_KEY);
  document.body.classList.remove("demo-mode");
  document.getElementById("overlay-breakthrough").hidden = true;
  closeDemoConsole();
  saveState();
  showView("home");
  toast("已还原推演前的修为");
}

function initDemoMode() {
  document.getElementById("btn-demo-open").onclick = openDemoConsole;
  document.getElementById("btn-demo-close").onclick = closeDemoConsole;
  document.getElementById("btn-demo-next").onclick = simulateNextTask;
  document.getElementById("btn-demo-restore").onclick = restoreDemoSnapshot;
  if (localStorage.getItem(DEMO_SNAPSHOT_KEY)) document.body.classList.add("demo-mode");
}

// ============== 修炼大厅 ==============
function renderTasks() {
  if (!S) return;
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  document.getElementById("task-empty").hidden = S.tasks.length > 0;

  const todayLogs = S.logs.filter(l => l.date === todayStr());

  S.tasks.forEach(t => {
    const doneToday = todayLogs.filter(l => l.taskId === t.id).length;
    const card = document.createElement("div");
    card.className = "hall-card";
    const diff = diffLabel(t.difficulty);
    card.innerHTML = `
      <div class="hall-card-header">
        <div class="hall-card-title"><span class="hall-symbol">${svgIcon(TASK_ICONS[t.cat] || "spark")}</span>${escapeHTML(t.name)}</div>
        <span class="difficulty ${diff.cls}">${diff.txt}</span>
      </div>
      <div class="hall-card-body">${escapeHTML(t.desc || "—")} · ${CAT_NAMES[t.cat]} · 默认 ${t.duration} 分钟${doneToday ? " · 今日已修炼 " + doneToday + " 次" : ""}</div>
      <div class="hall-card-footer">
        <span class="reward-line">预计 +${estimateGain(t)} 修为</span>
        <button class="edit-btn" data-edit="${t.id}">编辑</button>
        <button class="small-btn" data-start="${t.id}">开始</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll("[data-start]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const t = S.tasks.find(x => x.id === btn.dataset.start);
      if (t) startMeditate(t);
    };
  });
  list.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const t = S.tasks.find(x => x.id === btn.dataset.edit);
      if (t) openForm(t);
    };
  });
}

function diffLabel(d) {
  if (d <= 1.0) return { txt: "易 ×1.0", cls: "easy" };
  if (d <= 1.5) return { txt: "中 ×1.5", cls: "" };
  if (d <= 2.5) return { txt: "难 ×2.5", cls: "hard" };
  return { txt: "极难 ×4.0", cls: "god" };
}

// ============== 任务表单 ==============
let editingTask = null;

function openForm(task) {
  editingTask = task;
  const overlay = document.getElementById("overlay-form");
  document.getElementById("form-title").textContent = task ? "编 辑 功 法" : "新 建 功 法";
  document.getElementById("f-name").value = task ? task.name : "";
  document.getElementById("f-desc").value = task ? (task.desc || "") : "";
  setActiveTab("f-cat-tabs", task ? task.cat : "daily");
  setActiveTab("f-dur-tabs", task ? String(task.duration) : "25");
  setActiveTab("f-diff-tabs", task ? String(task.difficulty) : "1.5");
  document.getElementById("f-delete").hidden = !task;
  overlay.hidden = false;
}

function setActiveTab(containerId, value) {
  const container = document.getElementById(containerId);
  container.querySelectorAll(".form-tab").forEach(t => {
    t.classList.toggle("active", t.dataset.v === value);
  });
}

function getActiveTab(containerId) {
  const el = document.querySelector(`#${containerId} .form-tab.active`);
  return el ? el.dataset.v : null;
}

function bindFormTabs(containerId) {
  document.querySelectorAll(`#${containerId} .form-tab`).forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(`#${containerId} .form-tab`).forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    };
  });
}

function initForm() {
  bindFormTabs("f-cat-tabs");
  bindFormTabs("f-dur-tabs");
  bindFormTabs("f-diff-tabs");

  document.getElementById("f-cancel").onclick = () => {
    document.getElementById("overlay-form").hidden = true;
  };
  document.getElementById("f-save").onclick = () => {
    const name = document.getElementById("f-name").value.trim();
    const desc = document.getElementById("f-desc").value.trim();
    if (!name) { toast("请填写功法名"); return; }
    const cat = getActiveTab("f-cat-tabs");
    const duration = parseInt(getActiveTab("f-dur-tabs"), 10);
    const difficulty = parseFloat(getActiveTab("f-diff-tabs"));
    if (editingTask) {
      Object.assign(editingTask, { name, desc, cat, duration, difficulty });
    } else {
      S.tasks.push({ id: uid(), name, desc, cat, duration, difficulty });
    }
    saveState();
    document.getElementById("overlay-form").hidden = true;
    if (currentView === "home") renderHome();
    else renderTasks();
    toast(editingTask ? "已更新" : "已创建");
  };
  document.getElementById("f-delete").onclick = () => {
    if (!editingTask) return;
    if (!confirm(`确定删除"${editingTask.name}"？历史记录会保留。`)) return;
    S.tasks = S.tasks.filter(t => t.id !== editingTask.id);
    saveState();
    document.getElementById("overlay-form").hidden = true;
    renderTasks();
    toast("已删除");
  };

  document.getElementById("btn-add-task").onclick = () => openForm(null);
}

// ============== 闭关计时 ==============
let medState = null;
let medTimer = null;
const MEDITATION_SCENE_CLASSES = ["scene-study", "scene-sport"];

function setMeditationScene(task) {
  document.body.classList.remove(...MEDITATION_SCENE_CLASSES);
  if (task.cat === "study") document.body.classList.add("scene-study");
  if (task.cat === "sport") document.body.classList.add("scene-sport");
}

function startMeditate(task) {
  const overlay = document.getElementById("overlay-meditate");
  showView("home");
  S.passiveUpdatedAt = Date.now();
  saveState();
  setMeditationScene(task);
  document.getElementById("med-task").textContent = task.name + " · " + task.duration + " 分钟";
  document.getElementById("med-time").textContent = formatTime(task.duration * 60);
  document.getElementById("med-quote").textContent = `"${rand(QUOTES)}"`;
  document.getElementById("med-toggle").innerHTML = svgIcon("pause", "ui-icon");

  medState = {
    task,
    totalSec: task.duration * 60,
    leftSec: task.duration * 60,
    paused: false,
    focused: true,
    startedAt: Date.now(),
  };
  updateMedUI();
  document.body.classList.add("in-meditation");
  document.body.classList.remove("meditation-distracted", "meditation-paused", "meditation-result");
  overlay.hidden = false;
  document.getElementById("tabbar").style.display = "none";

  startMedTick();
}

function startMedTick() {
  if (medTimer) clearInterval(medTimer);
  medTimer = setInterval(() => {
    if (!medState || medState.paused) return;
    medState.leftSec--;
    updateMedUI();
    if (medState.leftSec <= 0) {
      finishMeditate(true);
    }
  }, 1000);
}

function updateMedUI() {
  document.getElementById("med-time").textContent = formatTime(medState.leftSec);
  const progress = 1 - medState.leftSec / medState.totalSec;
  const dashOffset = 678.58 * progress;
  document.getElementById("med-ring").setAttribute("stroke-dashoffset", dashOffset);
  const activeSpeed = Math.round(medState.task.difficulty * (medState.focused ? 1.2 : 0.8) * 60);
  document.getElementById("med-mult").innerHTML = medState.focused
    ? `${svgIcon("spark", "inline-icon")}心境澄明 · ${activeSpeed} 修为/小时`
    : `心神微散 · ${activeSpeed} 修为/小时`;
  document.body.classList.toggle("meditation-distracted", !medState.focused);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function finishMeditate(complete) {
  if (medTimer) { clearInterval(medTimer); medTimer = null; }
  const task = medState.task;
  const totalMins = task.duration;
  const actualSec = medState.totalSec - medState.leftSec;
  const actualMins = Math.max(1, Math.round(actualSec / 60));

  // 修为计算
  const focusMult = medState.focused ? 1.2 : 0.8;
  const partial = complete ? 1.0 : actualMins / totalMins;
  const baseGain = actualMins * task.difficulty * focusMult;
  const gain = Math.round(baseGain);

  // 仅完整完成或至少坐满 5 分钟才算"有效闭关"
  const validSession = complete || actualMins >= 5;

  if (validSession) {
    // 写入日志
    const today = todayStr();
    S.logs.push({
      id: uid(),
      taskId: task.id,
      taskName: task.name,
      date: today,
      minutes: actualMins,
      gain,
      focused: medState.focused,
      complete,
    });
    // 累加修为
    const oldRealm = S.realmIdx;
    S.cultivation += gain;
    const newRealm = getRealm(S.cultivation);
    // 更新连续天数
    if (S.lastDay !== today) {
      if (S.lastDay && daysBetween(S.lastDay, today) === 1) {
        S.streak++;
      } else if (!S.lastDay) {
        S.streak = 1;
      } else {
        S.streak = 1;
      }
      S.lastDay = today;
      if (S.streak > S.maxStreak) S.maxStreak = S.streak;
    }
    // 检测突破
    if (newRealm > oldRealm) {
      S.realmIdx = newRealm;
      saveState();
      showResult(task, actualMins, gain, () => {
        showBreakthrough(REALMS[oldRealm][0], REALMS[newRealm][0]);
      });
      hideOverlay("overlay-meditate");
      medState = null;
      return;
    }
    saveState();
    showResult(task, actualMins, gain);
  } else {
    toast("未满 5 分钟，本次不计入修为");
    exitMeditationScene();
  }
  hideOverlay("overlay-meditate");
  medState = null;
}

function showResult(task, mins, gain, onOk) {
  document.body.classList.add("meditation-result");
  document.getElementById("result-title").textContent = mins >= task.duration ? "闭关圆满" : "出关";
  document.getElementById("result-task").textContent = task.name;
  document.getElementById("result-mins").textContent = mins + " 分钟";
  document.getElementById("result-gain").textContent = "+" + gain;
  document.getElementById("result-formula").textContent =
    `${mins} 分 × 难度 ${task.difficulty} × 专注 ${medState && medState.focused ? "1.2" : "0.8"} ≈ ${gain}`;
  document.getElementById("overlay-result").hidden = false;
  document.getElementById("result-ok").onclick = () => {
    document.getElementById("overlay-result").hidden = true;
    exitMeditationScene();
    if (onOk) onOk();
    else {
      showView("home");
      flyGain(gain);
    }
  };
}

function exitMeditationScene() {
  document.body.classList.remove(
    "in-meditation",
    "meditation-distracted",
    "meditation-paused",
    "meditation-result",
    ...MEDITATION_SCENE_CLASSES
  );
  S.passiveUpdatedAt = Date.now();
  saveState();
  document.getElementById("tabbar").style.display = "";
}

function flyGain(gain) {
  const el = document.createElement("div");
  el.className = "float-gain";
  el.textContent = "+" + gain;
  el.style.left = "50%";
  el.style.top = "40%";
  el.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

function showBreakthrough(oldName, newName) {
  document.getElementById("break-old").textContent = oldName;
  document.getElementById("break-new").textContent = newName;
  document.getElementById("break-desc").textContent =
    `灵气贯通周天，${S.name} 一举破入 ${newName} 之境`;
  document.getElementById("overlay-breakthrough").hidden = false;
  document.getElementById("break-ok").onclick = () => {
    document.getElementById("overlay-breakthrough").hidden = true;
    showView("home");
  };
}

function hideOverlay(id) {
  document.getElementById(id).hidden = true;
}

function initMeditate() {
  document.getElementById("btn-home-breathe").onclick = () => {
    if (!S || S.tasks.length === 0) {
      showView("tasks");
      return;
    }
    startMeditate(S.tasks[0]);
  };

  document.getElementById("med-toggle").onclick = () => {
    if (!medState) return;
    medState.paused = !medState.paused;
    document.body.classList.toggle("meditation-paused", medState.paused);
    document.getElementById("med-toggle").innerHTML = svgIcon(medState.paused ? "play" : "pause", "ui-icon");
  };
  document.getElementById("med-add5").onclick = () => {
    if (!medState) return;
    medState.leftSec += 5 * 60;
    medState.totalSec += 5 * 60;
    updateMedUI();
    toast("已加 5 分钟");
  };
  document.getElementById("med-stop").onclick = () => {
    if (!medState) return;
    if (confirm("确定提前出关？\n若已坐满 5 分钟，本次修为会按比例计入。")) {
      finishMeditate(false);
    }
  };

  // 检测切出 App（视为分心）
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && medState && !medState.paused) {
      medState.focused = false;
      updateMedUI();
    }
  });
}

// ============== 统计 ==============
function renderStats() {
  if (!S) return;
  document.getElementById("s-total-cult").textContent = Math.round(S.cultivation);
  const totalMins = S.logs.reduce((s, l) => s + l.minutes, 0);
  document.getElementById("s-total-mins").textContent = totalMins;
  document.getElementById("s-total-sess").textContent = S.logs.length;
  document.getElementById("s-max-streak").textContent = S.maxStreak;

  // 近 7 日图表
  const chart = document.getElementById("chart-7d");
  chart.innerHTML = "";
  const today = new Date();
  const bars = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    const dayGain = S.logs.filter(l => l.date === ds).reduce((s, l) => s + l.gain, 0);
    bars.push({ ds, gain: dayGain, label: ["日","一","二","三","四","五","六"][d.getDay()] });
  }
  const max = Math.max(1, ...bars.map(b => b.gain));
  bars.forEach(b => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    const h = Math.max(2, (b.gain / max) * 100);
    bar.innerHTML = `
      <div class="chart-bar-val">${b.gain || ""}</div>
      <div class="chart-bar-fill" style="height:${h}%"></div>
      <div class="chart-bar-label">${b.label}</div>
    `;
    chart.appendChild(bar);
  });

  // 近期日志（最近 10 条）
  const logList = document.getElementById("log-list");
  logList.innerHTML = "";
  const recent = [...S.logs].reverse().slice(0, 10);
  if (recent.length === 0) {
    logList.innerHTML = '<div class="empty-hint">尚无修炼记录</div>';
  } else {
    recent.forEach(l => {
      const item = document.createElement("div");
      item.className = "log-item";
      item.innerHTML = `
        <div class="log-item-info">
          <div class="log-item-name">${escapeHTML(l.taskName)}</div>
          <div class="log-item-time">${l.date} · ${l.minutes} 分钟${l.focused ? "" : " · 心魔扰心"}</div>
        </div>
        <div class="log-item-gain">+${l.gain}</div>
      `;
      logList.appendChild(item);
    });
  }
}

// ============== 我 ==============
function renderMe() {
  if (!S) return;
  document.getElementById("me-name").textContent = S.name;
  document.getElementById("me-realm").textContent = REALMS[S.realmIdx][0];
  document.getElementById("me-since").textContent = S.createdAt ? dateStr(new Date(S.createdAt)) : "—";
  document.getElementById("me-cult").textContent = Math.round(S.cultivation);
}

function initMe() {
  document.getElementById("btn-export").onclick = () => {
    const data = JSON.stringify(S, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `问道-${S.name}-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("已导出");
  };
  document.getElementById("btn-import").onclick = () => {
    document.getElementById("import-file").click();
  };
  document.getElementById("import-file").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.name || data.cultivation === undefined) throw new Error("格式错误");
        if (!confirm(`确认导入"${data.name}"的数据？\n当前数据将被覆盖。`)) return;
        S = { ...DEFAULT_STATE, ...data };
        saveState();
        toast("已导入");
        location.reload();
      } catch (err) {
        alert("导入失败：" + err.message);
      }
    };
    reader.readAsText(file);
  };
  document.getElementById("btn-reset").onclick = resetState;
}

// ============== 通用工具 ==============
function escapeHTML(s) {
  if (s === undefined || s === null) return "";
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
}

// ============== 启动 ==============
function init() {
  // 底部 Tab
  document.querySelectorAll("[data-go]").forEach(el => {
    el.onclick = () => showView(el.dataset.go);
  });

  initOnboarding();
  initForm();
  initMeditate();
  initDemoMode();
  initMe();

  if (!S) {
    showView("onboarding");
  } else {
    showView("home");
  }

  setInterval(() => {
    if (!S || medState || document.body.classList.contains("in-meditation")) return;
    accruePassiveCultivation();
    if (currentView === "home") renderHome();
  }, 60000);
}

// PWA: 注册 service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW failed:", err));
  });
}

document.addEventListener("DOMContentLoaded", init);
