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

// 任务图标（内置 SVG，避免不同设备的 emoji 风格漂移）
const TASK_ICONS = {
  daily: "sunrise", study: "book", sport: "body", meditate: "lotus", goal: "target", other: "spark"
};
const CAT_NAMES = {
  daily: "每日守约", study: "学习", sport: "运动", meditate: "冥想", goal: "长期目标", other: "其他"
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

const SOUNDSCAPE_NAMES = {
  rain: "雨声",
  guqin: "古琴",
  muyu: "木鱼",
  none: "寂静",
};
const AUDIO_ASSETS = {
  bell: "assets/audio/completion-bell.ogg",
  rain: "assets/audio/rain.ogg",
  guqin: "assets/audio/guqin.ogg",
  muyu: "assets/audio/muyu.ogg",
};
const SPIRIT_ROOTS = {
  wood: { name: "青木灵根", stems: ["甲", "乙"] },
  fire: { name: "赤火灵根", stems: ["丙", "丁"] },
  earth: { name: "厚土灵根", stems: ["戊", "己"] },
  metal: { name: "庚金灵根", stems: ["庚", "辛"] },
  water: { name: "玄水灵根", stems: ["壬", "癸"] },
};
const DAO_PATHS = {
  sword: {
    name: "剑修",
    templates: [
      ["晨光试剑", "晨间最重要的一件事", "daily", "checkin", 10, 1, true],
      ["观剑悟意", "专注学习或工作", "study", "timer", 25, 1.5, false],
      ["踏罡行气", "散步或运动", "sport", "timer", 30, 1.5, false],
    ],
  },
  body: {
    name: "体修",
    templates: [
      ["淬体晨课", "喝水、拉伸与整理", "daily", "checkin", 10, 1, true],
      ["锻骨行功", "运动或训练", "sport", "timer", 30, 1.5, false],
      ["定息归元", "放松与恢复", "meditate", "timer", 10, 1, false],
    ],
  },
  alchemy: {
    name: "丹修",
    templates: [
      ["温炉养气", "照料睡眠与饮水", "daily", "checkin", 10, 1, true],
      ["辨药炼识", "学习或阅读", "study", "timer", 25, 1.5, false],
      ["静候丹成", "冥想或复盘", "meditate", "timer", 10, 1, false],
    ],
  },
  talisman: {
    name: "符修",
    templates: [
      ["净案展符", "收拾桌面并开始", "daily", "checkin", 10, 1, true],
      ["临摹玄篆", "学习或创作", "study", "timer", 25, 1.5, false],
      ["录诀成章", "写作或整理笔记", "goal", "timer", 25, 1.5, false],
    ],
  },
  array: {
    name: "阵修",
    templates: [
      ["定盘开阵", "列出今日安排", "daily", "checkin", 10, 1, true],
      ["推衍阵图", "深度工作或学习", "study", "timer", 25, 1.5, false],
      ["巡阵补阙", "整理与回顾", "goal", "checkin", 10, 1, false],
    ],
  },
};
const WORLD_SETTING = {
  realm: "沧溟界",
  era: "雨历三百一十七年",
  sect: "问道山门",
  mountain: "听雨山",
  calamity: "无灯长夜",
  premise: "三百年前，天幕裂隙降下无尽夜雨。雨不伤身，却会带走人未曾守住的愿念。世间灯火逐一暗去，修士称此劫为「无灯长夜」。",
  creed: "问道山门不求弟子斩尽风雨，只教人以每日一事护住心灯。一个仍会归来的人，便足以令长夜后退一寸。",
  mainThread: "未熄之灯",
};
const ROOT_LORE = {
  wood: { omen: "石阶缝隙生出细青苔，枯枝在雨中含芽。", relic: "生息枝" },
  fire: { omen: "灯盏里的火心忽然转赤，雨丝靠近便化成轻烟。", relic: "照夜火" },
  earth: { omen: "山门石基发出温沉回响，脚下泥土不再松散。", relic: "镇雨石" },
  metal: { omen: "檐下旧铃无风自鸣，声线清得像划开夜色。", relic: "听锋铃" },
  water: { omen: "廊下积水映出一道月痕，雨声由乱转静。", relic: "归澜盏" },
};
const PATH_LORE = {
  sword: { hall: "照雪剑坪", guide: "闻照霜", portrait: "sword", title: "执剑教习", vow: "以决断破迟疑，以一剑护一念。" },
  body: { hall: "百阶石场", guide: "石不言", portrait: "body", title: "淬体教习", vow: "先立其身，再护心灯。" },
  alchemy: { hall: "温炉药庐", guide: "苏青禾", portrait: "alchemy", title: "守炉药师", vow: "知进亦知养，余火亦可成丹。" },
  talisman: { hall: "藏经灯阁", guide: "沈青简", portrait: "talisman", title: "录符执事", vow: "一笔一划皆是与遗忘相争。" },
  array: { hall: "观星阵台", guide: "洛衡", portrait: "array", title: "推演师", vow: "先定方位，乱局自会现出道路。" },
};
const SIDE_CHARACTERS = [
  { name: "闻钟", role: "守灯人", note: "她守在山门长廊，为每位归山弟子留一盏不问迟早的灯。" },
  { name: "余烬翁", role: "扫阶老人", note: "据说经历过第一场长夜雨，总在养息日替人温一壶水。" },
  { name: "阿砚", role: "无籍小童", note: "会把弟子完成的功课抄在残卷背面，坚信文字可挡雨。" },
];

const PASSIVE_CULTIVATION_PER_HOUR = 2;
const PASSIVE_CULTIVATION_CAP_HOURS = 24;
const INTENTION_MINUTES = 1;
const RETURN_GAP_DAYS = 3;
const STORY_SCENE_KEYS = ["first-practice", "second-day", "steadfast"];
const WORLD_ENV_CLASSES = ["world-lamp-lit", "world-rain-soft", "world-study-mark", "world-body-mark", "world-resting", "world-away"];
const WORLD_ROOT_CLASSES = ["world-root-wood", "world-root-fire", "world-root-earth", "world-root-metal", "world-root-water"];

// ============== 数据层 ==============
const STORAGE_KEY = "wendao.state.v1";
const LEGACY_DEMO_SNAPSHOT_KEY = "wendao.demo.snapshot.v1";

const DEFAULT_STATE = {
  name: "无名来者",
  createdAt: null,           // 入门时间 ISO
  cultivation: 0,            // 累计修为
  realmIdx: 0,               // 当前境界索引
  streak: 0,                 // 连续修炼天数
  lastDay: null,             // 上次完成任务的日期 YYYY-MM-DD
  maxStreak: 0,              // 历史最长连续
  passiveUpdatedAt: null,    // 静修累积计算时间戳
  pendingBreakthrough: null, // 自动静修跨境后的待展示演出
  soundscape: "rain",        // 闭关声景
  ambienceVolume: 35,        // 声景音量百分比
  effectVolume: 60,          // 完成铃声音量百分比
  identity: null,            // {source,rootKey,pathKey,pillars,dayMaster}
  restDays: {},              // {YYYY-MM-DD:true}
  storySeen: [],             // 已观看的关键剧情演出键
  initiationSeen: false,     // 已观看受法后首次入室演出
  returnPromptDay: null,     // 当日已处理的归山引导
  tasks: [],                 // [{id,name,desc,cat,duration,difficulty,measureType,targetValue,targetUnit,primary,repeatDays}]
  logs: [],                  // [{id,taskId,taskName,date,minutes,gain,focused,complete,achievement}]
};

let S = loadState();
let demoState = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...data,
      restDays: data.restDays || {},
      storySeen: Array.isArray(data.storySeen) ? data.storySeen : [],
      initiationSeen: Object.prototype.hasOwnProperty.call(data, "initiationSeen") ? data.initiationSeen : true,
    };
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

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function displayedState() {
  return demoState || S;
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

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"];
const MEASURE_NAMES = {
  timer: "计时",
  count: "数量",
  checkin: "守约",
};

function measureTypeFor(task) {
  return task.measureType || "timer";
}

function standardMinutesFor(task) {
  return Number(task.duration) || 0;
}

function targetLabel(task) {
  const measureType = measureTypeFor(task);
  if (measureType === "count") {
    return `${task.targetValue || 1} ${task.targetUnit || "次"} · 折算 ${standardMinutesFor(task)} 分钟`;
  }
  if (measureType === "checkin") {
    return `践行守约 · 折算 ${standardMinutesFor(task)} 分钟`;
  }
  return `${standardMinutesFor(task)} 分钟`;
}

function estimatedGain(task) {
  const focusMult = measureTypeFor(task) === "timer" ? 1.2 : 1;
  return Math.round(standardMinutesFor(task) * task.difficulty * focusMult);
}

function previouslyClaimedActivityGain(state, task) {
  if (measureTypeFor(task) === "timer") return 0;
  return state.logs
    .filter(log => log.date === todayStr() && log.taskId === task.id && log.measureType === measureTypeFor(task))
    .reduce((sum, log) => sum + log.gain, 0);
}

function remainingEstimatedGain(state, task) {
  return Math.max(0, estimatedGain(task) - previouslyClaimedActivityGain(state, task));
}

function calculateReward(task, outcome = {}) {
  const measureType = measureTypeFor(task);
  const standardMins = standardMinutesFor(task);
  if (measureType === "timer") {
    const mins = Math.max(1, Number(outcome.minutes) || standardMins);
    const focusMult = outcome.focused === false ? .8 : 1.2;
    return {
      valid: Boolean(outcome.complete) || Boolean(outcome.intentionComplete) || mins >= 5,
      complete: Boolean(outcome.complete),
      gain: Math.round(mins * task.difficulty * focusMult),
      minutes: mins,
      focused: outcome.focused !== false,
      achievement: `${mins} 分钟`,
      formula: `${mins} 分 × 难度 ${task.difficulty} × 专注 ${focusMult.toFixed(1)}`,
    };
  }
  if (measureType === "count") {
    const target = Math.max(.1, Number(task.targetValue) || 1);
    const amount = Math.max(0, Number(outcome.amount) || 0);
    const ratio = amount / target;
    const completionMult = ratio >= 1.2 ? 1.15 : Math.min(1, ratio);
    const unit = task.targetUnit || "次";
    return {
      valid: ratio >= .5,
      complete: ratio >= 1,
      gain: Math.round(standardMins * task.difficulty * completionMult),
      minutes: Math.round(standardMins * Math.min(1, ratio)),
      focused: null,
      achievement: `${amount} ${unit} / ${target} ${unit}`,
      formula: `${standardMins} 折算分 × 难度 ${task.difficulty} × 完成 ${completionMult.toFixed(2)}`,
    };
  }
  return {
    valid: true,
    complete: true,
    gain: Math.round(standardMins * task.difficulty),
    minutes: standardMins,
    focused: null,
    achievement: "今日守约完成",
    formula: `${standardMins} 折算分 × 难度 ${task.difficulty}`,
  };
}

function incrementalActivityReward(task, reward) {
  const claimed = previouslyClaimedActivityGain(S, task);
  if (!claimed) return reward;
  if (reward.gain <= claimed) return null;
  return {
    ...reward,
    gain: reward.gain - claimed,
    formula: `${reward.formula} - 已领取 ${claimed}`,
  };
}

function repeatDaysFor(task) {
  return Array.isArray(task.repeatDays) && task.repeatDays.length
    ? task.repeatDays
    : EVERY_DAY;
}

function orderedTasks(state) {
  return [...state.tasks].sort((a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)));
}

function isRestDay(state, date = todayStr()) {
  return Boolean(state.restDays && state.restDays[date]);
}

function restTaskForToday() {
  return {
    id: `rest-${todayStr()}`,
    name: "养息调元",
    desc: "喝水、整理床铺或缓行五分钟",
    cat: "daily",
    measureType: "checkin",
    duration: 5,
    difficulty: 1,
    restful: true,
    repeatDays: [...EVERY_DAY],
  };
}

function tasksScheduledForToday(state) {
  if (isRestDay(state)) return [restTaskForToday()];
  const today = new Date().getDay();
  return orderedTasks(state).filter(task => repeatDaysFor(task).includes(today));
}

function scheduleLabel(task) {
  const days = repeatDaysFor(task);
  if (days.length === EVERY_DAY.length) return "每日";
  if (days.length === 5 && [1, 2, 3, 4, 5].every(day => days.includes(day))) return "工作日";
  return days.map(day => `周${WEEKDAY_NAMES[day]}`).join("、");
}

function recommendedTasks(pathKey) {
  const path = DAO_PATHS[pathKey] || DAO_PATHS.sword;
  return path.templates.map(([name, desc, cat, measureType, duration, difficulty, primary], index) => ({
    id: uid(),
    name,
    desc,
    cat,
    measureType,
    duration,
    difficulty,
    primary,
    repeatDays: index === 1 ? [1, 2, 3, 4, 5] : [...EVERY_DAY],
  }));
}

function rootForDayMaster(dayMaster) {
  return Object.keys(SPIRIT_ROOTS).find(key => SPIRIT_ROOTS[key].stems.includes(dayMaster)) || null;
}

// ============== 真实录音声景 ==============
let ambienceAudio = null;
let ambienceTimer = null;
let bellAudio = null;
let previewStopTimer = null;

function stopSoundscape() {
  if (ambienceTimer) {
    clearInterval(ambienceTimer);
    ambienceTimer = null;
  }
  if (ambienceAudio) {
    ambienceAudio.pause();
    ambienceAudio.currentTime = 0;
    ambienceAudio = null;
  }
  if (previewStopTimer) {
    clearTimeout(previewStopTimer);
    previewStopTimer = null;
  }
}

function playTrack(src, volume, loop = false) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  audio.play().catch(() => {});
  return audio;
}

function startSoundscape(mode) {
  stopSoundscape();
  if (mode === "none") return;
  if (mode === "rain") {
    ambienceAudio = playTrack(AUDIO_ASSETS.rain, S.ambienceVolume / 100, true);
  } else if (mode === "guqin") {
    ambienceAudio = playTrack(AUDIO_ASSETS.guqin, S.ambienceVolume / 100, true);
  } else if (mode === "muyu") {
    ambienceAudio = playTrack(AUDIO_ASSETS.muyu, S.ambienceVolume / 100);
    ambienceTimer = setInterval(() => {
      if (ambienceAudio) {
        ambienceAudio.currentTime = 0;
        ambienceAudio.play().catch(() => {});
      }
    }, 2800);
  }
}

function playCompletionBell() {
  if (bellAudio) bellAudio.pause();
  bellAudio = playTrack(AUDIO_ASSETS.bell, S.effectVolume / 100);
}

function previewSoundscape(mode) {
  startSoundscape(mode);
  previewStopTimer = setTimeout(stopSoundscape, mode === "muyu" ? 2200 : 4500);
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
  if (demoState && name !== "home") exitDemoMode();
  if (name !== "me" && !medState) stopSoundscape();
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
  const inputEl = document.getElementById("onb-name-input");
  const prologueStep = document.getElementById("btn-prologue-next");
  const nameStep = document.getElementById("onb-step-name");
  const identityStep = document.getElementById("onb-step-identity");
  const teachingStep = document.getElementById("onb-step-teaching");
  const onboardingView = document.querySelector(".view-onboarding");
  const prologueEra = document.getElementById("prologue-era");
  const prologueCopy = document.getElementById("prologue-copy");
  const prologueQuestion = document.getElementById("prologue-question");
  const prologuePrompt = document.getElementById("prologue-prompt");
  const keeperDialogue = document.getElementById("keeper-dialogue");
  const keeperLine = document.getElementById("keeper-line");
  const keeperLedger = document.getElementById("keeper-ledger");
  const keeperNext = document.getElementById("btn-keeper-next");
  const guideDialogue = document.getElementById("guide-dialogue");
  const guideLine = document.getElementById("onb-mentor-dialogue");
  const guideTeaching = document.getElementById("guide-teaching");
  const guideNext = document.getElementById("btn-guide-next");
  const keeperLines = [
    "……你走了很久。",
    "不必解释来处。能走到这里，便是你仍没放下。",
    "我叫闻钟。守着这里的灯，也守着来者留下的名字。",
    "雨会冲淡许多事。名字未必抵得住这场雨，却能让你记得，今夜为何上山。",
  ];
  const prologueScenes = [
    {
      era: "雨 历 三 百 一 十 七 年",
      copy: "三百年前，天幕无声裂开。<br>自那一夜起，雨再未停过。"
    },
    {
      copy: "这雨不寒，不痛，也不毁城池。<br>它只一点一点，洗淡人心头那些松了手的念想。"
    },
    {
      copy: "有人忘了写到一半的书。<br>有人放下曾立誓握紧的剑。<br>有人在镜中，再也认不出自己曾想成为的人。"
    },
    {
      copy: "你也曾以为，再搁一日并无大碍。<br>直到今夜，你忽然发现：那件你不肯放手的事，连名字都快记不清了。"
    },
    {
      copy: "于是你离开檐下最后一盏灯，独自踏入长雨。<br>泥水没过鞋面，山道没有回声；你只记得，有人说听雨山上仍留着一处灯火。"
    },
    {
      copy: "你不知自己还能否重拾那一念。<br>可在天亮以前，你终于走到了石阶尽头。"
    },
    {
      era: "听 雨 山 · 问 道 山 门",
      copy: "夜雨深处，一盏灯为来者亮起。<br>门内有人静候，仿佛早已听见你的脚步。",
      gate: true
    }
  ];
  let prologueIndex = 0;
  let keeperLineIndex = 0;
  let guideLineIndex = 0;
  let guideLines = [];
  const draft = { source: "heart", rootKey: null, pathKey: null, pillars: null, dayMaster: null, preserveExisting: false };

  function beginKeeperEncounter() {
    keeperLineIndex = 0;
    nameStep.classList.remove("reveal-running");
    void nameStep.offsetWidth;
    nameStep.classList.add("reveal-running");
    keeperDialogue.hidden = false;
    keeperLedger.hidden = true;
    keeperNext.disabled = true;
    window.setTimeout(() => {
      if (nameStep.classList.contains("reveal-running")) keeperNext.disabled = false;
    }, 2700);
    keeperLine.textContent = keeperLines[keeperLineIndex];
    keeperLine.classList.add("arriving");
    onboardingView.classList.add("meeting-keeper");
  }

  function renderKeeperLine() {
    keeperLine.classList.remove("arriving");
    void keeperLine.offsetWidth;
    keeperLine.textContent = keeperLines[keeperLineIndex];
    keeperLine.classList.add("arriving");
  }

  function renderGuideLine() {
    guideLine.classList.remove("arriving");
    void guideLine.offsetWidth;
    guideLine.textContent = guideLines[guideLineIndex];
    guideLine.classList.add("arriving");
  }

  function beginGuideEncounter() {
    const lore = PATH_LORE[draft.pathKey];
    const root = SPIRIT_ROOTS[draft.rootKey].name;
    guideLines = [
      `${draft.name}。`,
      `${root}映照你的来处；道途，才是一日一日的选择。`,
      lore.vow,
      "今日先授你三法。等你明白想守住什么，再来寻我。",
    ];
    guideLineIndex = 0;
    guideDialogue.hidden = false;
    guideTeaching.hidden = true;
    guideNext.disabled = true;
    teachingStep.classList.remove("guide-reveal-running", "teaching-open");
    void teachingStep.offsetWidth;
    teachingStep.classList.add("guide-reveal-running");
    onboardingView.classList.remove("choosing-identity");
    onboardingView.classList.add("meeting-guide");
    renderGuideLine();
    window.setTimeout(() => {
      if (teachingStep.classList.contains("guide-reveal-running")) guideNext.disabled = false;
    }, 2200);
  }

  function renderPrologueScene() {
    const scene = prologueScenes[prologueIndex];
    prologueEra.textContent = scene.era || "";
    prologueEra.hidden = !scene.era;
    prologueCopy.innerHTML = scene.copy;
    prologueCopy.classList.remove("changing");
    void prologueCopy.offsetWidth;
    prologueCopy.classList.add("changing");
    prologueQuestion.hidden = !scene.gate;
    prologuePrompt.textContent = scene.gate ? "叩 响 山 门" : "轻 触 继 续";
    onboardingView.classList.toggle("prologue-playing", !scene.gate);
    onboardingView.classList.toggle("prologue-gate", Boolean(scene.gate));
  }
  renderPrologueScene();
  prologueStep.onclick = () => {
    if (prologueIndex < prologueScenes.length - 1) {
      prologueIndex += 1;
      renderPrologueScene();
      return;
    }
    prologueStep.hidden = true;
    nameStep.hidden = false;
    onboardingView.classList.remove("prologue-playing", "prologue-gate");
    beginKeeperEncounter();
  };
  keeperNext.onclick = () => {
    if (keeperLineIndex < keeperLines.length - 1) {
      keeperLineIndex += 1;
      renderKeeperLine();
      return;
    }
    keeperDialogue.hidden = true;
    keeperLedger.hidden = false;
    nameStep.classList.remove("reveal-running");
    onboardingView.classList.add("keeper-ledger-open");
  };
  document.getElementById("btn-enter").onclick = () => {
    const recordedName = inputEl.value.trim();
    if (!recordedName) {
      toast("请留下姓名或称呼，或选择暂不留名");
      return;
    }
    draft.name = recordedName;
    nameStep.hidden = true;
    identityStep.hidden = false;
    nameStep.classList.remove("reveal-running");
    onboardingView.classList.remove("meeting-keeper", "keeper-ledger-open");
    onboardingView.classList.add("choosing-identity");
  };
  document.getElementById("btn-anonymous").onclick = () => {
    draft.name = "无名来者";
    inputEl.value = "";
    nameStep.hidden = true;
    identityStep.hidden = false;
    nameStep.classList.remove("reveal-running");
    onboardingView.classList.remove("meeting-keeper", "keeper-ledger-open");
    onboardingView.classList.add("choosing-identity");
  };
  document.getElementById("btn-identity-upgrade").onclick = () => {
    draft.name = S.name;
    draft.preserveExisting = true;
    prologueStep.hidden = true;
    nameStep.hidden = true;
    identityStep.hidden = false;
    onboardingView.classList.remove("prologue-playing", "prologue-gate", "meeting-keeper", "keeper-ledger-open");
    onboardingView.classList.add("choosing-identity");
    showView("onboarding");
  };
  document.getElementById("btn-identity-back").onclick = () => {
    identityStep.hidden = true;
    onboardingView.classList.remove("choosing-identity");
    if (draft.preserveExisting) {
      draft.preserveExisting = false;
      showView("me");
    } else {
      nameStep.hidden = false;
      onboardingView.classList.add("meeting-keeper", "keeper-ledger-open");
    }
  };
  document.getElementById("btn-teaching-back").onclick = () => {
    teachingStep.hidden = true;
    teachingStep.classList.remove("guide-reveal-running", "teaching-open");
    identityStep.hidden = false;
    onboardingView.classList.remove("meeting-guide");
    onboardingView.classList.add("choosing-identity");
  };
  guideNext.onclick = () => {
    if (guideLineIndex < guideLines.length - 1) {
      guideLineIndex += 1;
      renderGuideLine();
      return;
    }
    guideDialogue.hidden = true;
    guideTeaching.hidden = false;
    teachingStep.classList.remove("guide-reveal-running");
    teachingStep.classList.add("teaching-open");
  };

  document.querySelectorAll("[data-identity-source]").forEach(button => {
    button.onclick = () => {
      draft.source = button.dataset.identitySource;
      document.querySelectorAll("[data-identity-source]").forEach(candidate => {
        candidate.classList.toggle("active", candidate === button);
      });
      document.getElementById("heart-root-picker").hidden = draft.source !== "heart";
      document.getElementById("birth-root-picker").hidden = draft.source !== "birth";
      draft.rootKey = draft.source === "heart" ? null : draft.rootKey;
      if (draft.source === "heart") {
        draft.pillars = null;
        draft.dayMaster = null;
      }
      renderOnboardingChoice(draft);
    };
  });
  document.querySelectorAll("[data-root]").forEach(button => {
    button.onclick = () => {
      draft.rootKey = button.dataset.root;
      renderOnboardingChoice(draft);
    };
  });
  document.querySelectorAll("[data-path]").forEach(button => {
    button.onclick = () => {
      draft.pathKey = button.dataset.path;
      renderOnboardingChoice(draft);
    };
  });
  document.getElementById("btn-divine-root").onclick = () => {
    const raw = document.getElementById("onb-birth").value;
    if (!raw) {
      toast("请先选择出生日期与时刻");
      return;
    }
    if (typeof Solar === "undefined") {
      toast("历法模块未能载入");
      return;
    }
    const birth = new Date(raw);
    const eightChar = Solar.fromYmdHms(
      birth.getFullYear(),
      birth.getMonth() + 1,
      birth.getDate(),
      birth.getHours(),
      birth.getMinutes(),
      0
    ).getLunar().getEightChar();
    const pillars = [eightChar.getYear(), eightChar.getMonth(), eightChar.getDay(), eightChar.getTime()];
    const dayMaster = pillars[2].charAt(0);
    draft.rootKey = rootForDayMaster(dayMaster);
    draft.pillars = pillars;
    draft.dayMaster = `${dayMaster}${SPIRIT_ROOTS[draft.rootKey].name.charAt(1)}`;
    renderOnboardingChoice(draft);
  };
  document.getElementById("btn-start-cultivation").onclick = () => {
    if (!draft.rootKey) {
      toast(draft.source === "heart" ? "请先认领一道灵根" : "请先在测灵台排出四柱");
      return;
    }
    if (!draft.pathKey) {
      toast("请选择主修道途");
      return;
    }
    renderTeachingScene(draft);
    identityStep.hidden = true;
    teachingStep.hidden = false;
    beginGuideEncounter();
  };
  document.getElementById("btn-receive-techniques").onclick = () => {
    const identity = {
      source: draft.source,
      rootKey: draft.rootKey,
      pathKey: draft.pathKey,
      pillars: draft.pillars,
      dayMaster: draft.dayMaster,
    };
    const isNewInitiation = !(draft.preserveExisting && S);
    if (!isNewInitiation) {
      S.identity = identity;
      if (S.tasks.length === 0) S.tasks = recommendedTasks(draft.pathKey);
    } else {
      S = JSON.parse(JSON.stringify(DEFAULT_STATE));
      S.name = draft.name;
      S.createdAt = new Date().toISOString();
      S.passiveUpdatedAt = Date.now();
      S.identity = identity;
      S.tasks = recommendedTasks(draft.pathKey);
      S.initiationSeen = false;
    }
    saveState();
    if (isNewInitiation) {
      beginInitiationHandoff(draft.pathKey, () => {
        teachingStep.classList.remove("guide-reveal-running", "teaching-open");
        onboardingView.classList.remove("meeting-guide");
        showView("home");
      });
    } else {
      teachingStep.classList.remove("guide-reveal-running", "teaching-open");
      onboardingView.classList.remove("meeting-guide");
      showView("home");
    }
  };
}

function renderOnboardingChoice(draft) {
  document.querySelectorAll("[data-root]").forEach(button => {
    button.classList.toggle("active", button.dataset.root === draft.rootKey);
  });
  document.querySelectorAll("[data-path]").forEach(button => {
    button.classList.toggle("active", button.dataset.path === draft.pathKey);
  });
  const birthResult = document.getElementById("birth-result");
  if (draft.source === "birth" && draft.pillars) {
    birthResult.hidden = false;
    birthResult.innerHTML = `命盘：${draft.pillars.join(" · ")}<br>日主：${escapeHTML(draft.dayMaster)} · 灵根：${SPIRIT_ROOTS[draft.rootKey].name}`;
  } else {
    birthResult.hidden = true;
  }
  const preview = document.getElementById("template-preview");
  if (!draft.rootKey || !draft.pathKey) {
    preview.textContent = "灵根与道途既明，山门将授三卷初法。";
    return;
  }
  const path = DAO_PATHS[draft.pathKey];
  preview.innerHTML = `<b>${SPIRIT_ROOTS[draft.rootKey].name} · ${path.name}</b><span>推荐功法：${path.templates.map(template => template[0]).join("、")}</span>`;
}

function renderTeachingScene(draft) {
  const path = DAO_PATHS[draft.pathKey];
  const lore = PATH_LORE[draft.pathKey];
  const teachingStep = document.getElementById("onb-step-teaching");
  teachingStep.dataset.guide = lore.portrait;
  document.getElementById("onb-guide-art").setAttribute("aria-label", lore.guide);
  document.getElementById("onb-mentor-name").textContent = lore.guide;
  document.getElementById("onb-mentor-role").textContent = `${lore.hall} · ${lore.title}`;
  document.getElementById("onb-teaching-list").innerHTML = path.templates.map(template => `
    <div class="teaching-item">
      <b>${escapeHTML(template[0])}</b>
      <span>${MEASURE_NAMES[template[3]]} · ${escapeHTML(template[1])}</span>
    </div>
  `).join("");
  document.getElementById("btn-receive-techniques").textContent = draft.preserveExisting && S && S.tasks.length
    ? "记 下 师 言"
    : "领 受 功 法";
}

// ============== 主界面 ==============
function renderHome(options = {}) {
  if (!S) return;
  if (!options.skipPassive && !demoState) accruePassiveCultivation();
  const state = displayedState();
  setRealmVisualState(state.realmIdx);
  applyWorldEnvironment(state);
  renderDemoRealmStage();
  const realmName = REALMS[state.realmIdx][0];
  document.getElementById("home-realm").textContent = realmName;

  const createdDay = state.createdAt ? dateStr(new Date(state.createdAt)) : null;
  const days = createdDay ? Math.max(1, daysBetween(createdDay, todayStr()) + 1) : 1;

  document.getElementById("home-cult").textContent = formatCultivation(state.cultivation);
  const nextTh = nextRealmThreshold(state.realmIdx);
  const remain = Math.max(0, nextTh - state.cultivation);
  const nextRealm = REALMS[Math.min(state.realmIdx + 1, REALMS.length - 1)][0];
  document.getElementById("home-next-realm").textContent = nextRealm;
  document.getElementById("home-threshold").textContent = Math.round(nextTh).toLocaleString();
  document.getElementById("home-remain").textContent = Math.ceil(remain).toLocaleString();
  document.getElementById("home-speed").textContent = PASSIVE_CULTIVATION_PER_HOUR.toFixed(2);

  const progress = realmProgress(state.cultivation, state.realmIdx);
  document.getElementById("home-fill").style.width = progress + "%";

  const todayLogs = state.logs.filter(l => l.date === todayStr());
  const todayMins = todayLogs.reduce((sum, l) => sum + l.minutes, 0);
  const todayTasks = tasksScheduledForToday(state);
  const doneTaskCount = todayTasks.filter(t => todayLogs.some(l => l.taskId === t.id && l.complete)).length;
  document.getElementById("home-passive-top").textContent = PASSIVE_CULTIVATION_PER_HOUR.toFixed(2);
  document.getElementById("home-done-tasks").textContent = doneTaskCount;
  document.getElementById("home-task-count").textContent = todayTasks.length;
  document.getElementById("home-top-remain").textContent = Math.ceil(remain).toLocaleString();

  const unfinishedTasks = todayTasks.filter(t => !todayLogs.some(l => l.taskId === t.id && l.complete));
  const potentialGain = unfinishedTasks.reduce((sum, task) => sum + remainingEstimatedGain(state, task), 0);
  const forecast = document.getElementById("home-forecast");
  forecast.classList.remove("ready");
  if (todayTasks.length === 0) {
    forecast.textContent = "今日未排功课，可前往修炼大厅安排修行";
  } else if (state.realmIdx >= REALMS.length - 1) {
    forecast.textContent = "已至此界巅峰，静候飞升天机";
  } else if (potentialGain >= remain) {
    forecast.textContent = `今日余下功课 +${potentialGain} 修为 · 可突破 ${nextRealm}`;
    forecast.classList.add("ready");
  } else {
    forecast.textContent = `今日余下功课 +${potentialGain} 修为 · 尚差 ${Math.ceil(remain - potentialGain)} 破境`;
  }

  // 提醒文案
  const reminderText = pickReminder(state, todayMins, remain, days);
  document.getElementById("home-reminder-text").textContent = reminderText;
  renderPracticeMode(state);
  renderStoryGlimpse(state);

  // 今日功课（最多 3 个）
  const list = document.getElementById("home-tasks");
  list.innerHTML = "";
  const empty = document.getElementById("home-empty");
  empty.hidden = todayTasks.length > 0;
  if (!empty.hidden && state.tasks.length > 0) {
    empty.textContent = "今日未安排功课，可在修炼大厅调整重复日。";
  } else if (!empty.hidden) {
    empty.innerHTML = '尚未设功法，<span class="link" data-go="tasks">前往修炼大厅创建第一道功法</span>';
    empty.querySelector("[data-go]").onclick = () => showView("tasks");
  }
  todayTasks.slice(0, 3).forEach(t => {
    const doneToday = todayLogs.some(l => l.taskId === t.id);
    const card = document.createElement("div");
    card.className = "task-card" + (doneToday ? " done" : "");
    card.innerHTML = `
      <div class="task-icon">${svgIcon(TASK_ICONS[t.cat] || "spark")}</div>
      <div class="task-info">
        <div class="task-name">${t.primary ? '<span class="primary-chip">主修</span>' : ""}${escapeHTML(t.name)}${doneToday ? " ✓" : ""}</div>
        <div class="task-meta"><span class="measure-chip">${MEASURE_NAMES[measureTypeFor(t)]}</span>${targetLabel(t)} · ${scheduleLabel(t)}</div>
      </div>
      <div class="task-reward">+${remainingEstimatedGain(state, t)}</div>
    `;
    card.onclick = () => {
      if (demoState) exitDemoMode();
      const realTask = S.tasks.find(task => task.id === t.id) || t;
      beginTask(realTask);
    };
    list.appendChild(card);
  });

  if (!demoState && S.pendingBreakthrough && !medState) {
    const pending = S.pendingBreakthrough;
    S.pendingBreakthrough = null;
    saveState();
    setTimeout(() => showBreakthrough(REALMS[pending.oldRealm][0], REALMS[pending.newRealm][0]), 0);
  } else if (!demoState && !medState) {
    maybeShowStoryScene(state);
  }
}

function applyWorldEnvironment(state) {
  document.body.classList.remove(...WORLD_ENV_CLASSES, ...WORLD_ROOT_CLASSES);
  if (!state) return;
  if (state.identity && state.identity.rootKey) {
    document.body.classList.add(`world-root-${state.identity.rootKey}`);
  }
  const progress = storyProgress(state);
  const gap = state.lastDay ? daysBetween(state.lastDay, todayStr()) : 0;
  if (progress.completed.length > 0) document.body.classList.add("world-lamp-lit");
  if (progress.activeDays.length >= 2) document.body.classList.add("world-rain-soft");
  if ((progress.categoryCount.study || 0) >= 2) document.body.classList.add("world-study-mark");
  if ((progress.categoryCount.sport || 0) >= 2) document.body.classList.add("world-body-mark");
  if (isRestDay(state)) document.body.classList.add("world-resting");
  if (gap >= RETURN_GAP_DAYS) document.body.classList.add("world-away");
}

function renderPracticeMode(state) {
  const rest = isRestDay(state);
  document.getElementById("practice-mode-name").textContent = rest ? "养 息 日" : "常 行 日";
  document.getElementById("practice-mode-note").textContent = rest
    ? "修行有进有守。今日只需完成一门轻功课。"
    : `计时功法可先修${INTENTION_MINUTES}分钟；低谷时亦可转入养息。`;
  const button = document.getElementById("btn-rest-day");
  button.textContent = rest ? "恢 复 常 行" : "今 日 养 息";
  button.classList.toggle("active", rest);
}

function storyProgress(state) {
  const completed = state.logs.filter(log =>
    log.complete !== false && log.practiceType !== "rest" && log.practiceType !== "intention"
  );
  const activeDays = [...new Set(completed.map(log => log.date))].sort();
  const categoryCount = completed.reduce((counts, log) => {
    const task = state.tasks.find(candidate => candidate.id === log.taskId);
    if (task) counts[task.cat] = (counts[task.cat] || 0) + 1;
    return counts;
  }, {});
  const hasReturn = activeDays.some((date, index) =>
    index > 0 && daysBetween(activeDays[index - 1], date) >= 3
  );
  return { completed, activeDays, categoryCount, hasReturn };
}

function mainStoryState(state) {
  if (!state.identity) return {
    chapter: "卷首 · 雨中的山门",
    place: "听雨山 · 门外石阶",
    objective: "在问心台认领灵根与道途，点亮你的第一盏灯。",
  };
  const progress = storyProgress(state);
  if (state.realmIdx >= 4) return {
    chapter: "第二卷 · 山灯有影",
    place: "听雨山 · 封雨古井",
    objective: "筑基之后，寻找古井深处仍在呼吸的长夜裂痕。",
  };
  if (progress.activeDays.length >= 4) return {
    chapter: "第一卷 · 未熄之灯",
    place: "听雨山 · 照微灯廊",
    objective: "你已能守住灯火。继续修行，等待山门开启筑基问灯。",
  };
  if (progress.completed.length) return {
    chapter: "第一卷 · 未熄之灯",
    place: "听雨山 · 引气坪",
    objective: "让心灯在不同日子再次燃起，查明长夜雨为何畏惧坚持。",
  };
  return {
    chapter: "序章 · 初叩山门",
    place: "听雨山 · 问心坪",
    objective: "完成第一门现实功课，以行动回应山门的灯火。",
  };
}

function storyChapters(state) {
  if (!state.identity) return [];
  const root = SPIRIT_ROOTS[state.identity.rootKey].name;
  const rootLore = ROOT_LORE[state.identity.rootKey];
  const path = DAO_PATHS[state.identity.pathKey].name;
  const pathLore = PATH_LORE[state.identity.pathKey];
  const progress = storyProgress(state);
  const chapters = [{
    key: "prologue",
    label: "世界",
    title: "长夜落雨",
    place: "沧溟界",
    text: `${WORLD_SETTING.era}，${WORLD_SETTING.calamity}仍未终结。${WORLD_SETTING.sect}在${WORLD_SETTING.mountain}守着世间最后一列不灭灯火。`,
  }, {
    key: "initiation",
    label: "入门",
    title: "山门录名",
    place: "问心坪",
    text: `${state.name} 认领${root}，择${path}而行。守灯人闻钟将你的名字写入灯册。`,
  }, {
    key: "path-call",
    label: "道途",
    title: `${pathLore.hall}来帖`,
    place: pathLore.hall,
    text: `${pathLore.title}${pathLore.guide}留下一句入门约言：「${pathLore.vow}」`,
  }];
  const firstComplete = progress.completed[0];
  if (firstComplete) chapters.push({
    key: "first-practice",
    label: "主线",
    title: "灵根引气",
    date: firstComplete.date,
    place: "照微灯廊",
    text: `你亲手完成了「${firstComplete.taskName}」。静室铜灯的火芯由候火稳稳立起，暖光第一次越过案沿。${rootLore.omen}闻钟轻声道：“这一息，是你自己引来的。”${rootLore.relic}随之传来第一声回响。`,
  });
  const intention = state.logs.find(log => log.practiceType === "intention");
  if (intention) chapters.push({
    key: "intention",
    label: "支线",
    title: "一念既起",
    date: intention.date,
    place: "听雨檐下",
    text: `你在「${intention.taskName}」前先守住一息。阿砚将这一分钟写入残页：未盛大的火，也能照见归路。`,
  });
  const rest = state.logs.find(log => log.practiceType === "rest");
  if (rest) chapters.push({
    key: "rest",
    label: "支线",
    title: "温炉不灭",
    date: rest.date,
    place: "温炉药庐",
    text: "养息日里，余烬翁递来温水：灯不必时时烈燃，只要不将自己耗尽。山门为你记下了这一次守势。",
  });
  if (progress.activeDays.length >= 2) {
    const secondDayComplete = progress.completed.find(log => log.date === progress.activeDays[1]);
    chapters.push({
    key: "second-day",
    label: "主线",
    title: "雨痕退寸",
    place: "照微灯廊",
    text: `你在另一个日子又完成了「${secondDayComplete ? secondDayComplete.taskName : "一门功课"}」。窗棂上的湿线从下方刻痕退至上方，案沿露出一指干木，灯照也向外铺开。${pathLore.guide}说：长夜雨畏惧的不是术法，是你再次选择持守。`,
    });
  }
  if (progress.activeDays.length >= 4) chapters.push({
    key: "steadfast",
    label: "主线",
    title: "未熄之灯",
    place: "封雨古井",
    text: `${pathLore.guide}邀你同往封雨古井。井壁有五道熄灭灯龛，其中一道因你的修行亮起微光；主线「${WORLD_SETTING.mainThread}」由此展开。`,
  });
  if ((progress.categoryCount.study || 0) >= 3) chapters.push({
    key: "study",
    label: "机缘",
    title: "藏经阁残页",
    place: "藏经灯阁",
    text: "沈青简从旧卷中取出一页被雨蚀过的图谱：上面记着一盏失踪山灯的位置，须以持续的研读将墨迹重新照出。",
  });
  if ((progress.categoryCount.sport || 0) >= 3) chapters.push({
    key: "sport",
    label: "机缘",
    title: "百阶留印",
    place: "百阶石场",
    text: "石不言看见你的脚步在湿阶留下温痕，交给你一枚镇雨石。他说，能负重上山的人，也能把熄灭的灯背回来。",
  });
  if ((progress.categoryCount.meditate || 0) >= 3) chapters.push({
    key: "meditate",
    label: "机缘",
    title: "雨声之下",
    place: "静水斋",
    text: "静坐第三回，你终于听见雨声之下还有一道极轻的钟鸣。那声音来自山下，被夜雨遮住的旧村。",
  });
  if ((progress.categoryCount.goal || 0) >= 3) chapters.push({
    key: "goal",
    label: "机缘",
    title: "未完阵图",
    place: "观星阵台",
    text: "洛衡以你持续推进的痕迹补全阵图一角：五盏山灯并非散落，而是在围住某个仍未醒来的存在。",
  });
  if (progress.hasReturn) chapters.push({
    key: "return",
    label: "归山",
    title: "旧灯尚燃",
    place: "山门长廊",
    text: "你曾离山数日，又再次完成了一门功课。闻钟没有问你为何迟来，只把那盏一直留着的灯移到你手边。",
  });
  if (state.realmIdx >= 4) chapters.push({
    key: "foundation",
    label: "主线",
    title: "古井问灯",
    place: "封雨古井",
    text: `踏入筑基之境后，你能看清井底浮着的字：长夜并非天灾，而是众生放弃的愿念汇成之雨。${pathLore.guide}要你选择下一盏要寻回的山灯。`,
  });
  return chapters;
}

function renderStoryGlimpse(state) {
  const glimpse = document.getElementById("story-glimpse");
  const chapters = storyChapters(state);
  const latest = chapters[chapters.length - 1];
  glimpse.hidden = !latest;
  if (latest) {
    glimpse.innerHTML = `<b>${escapeHTML(latest.label || "机缘")} · ${escapeHTML(latest.title)}</b><small>${escapeHTML(latest.place || WORLD_SETTING.mountain)}</small><span>${escapeHTML(latest.text)}</span>`;
  }
}

let activeStorySceneKey = null;

function setCharacterPortrait(elementId, portrait, characterName) {
  const element = document.getElementById(elementId);
  element.dataset.character = portrait;
  element.setAttribute("aria-label", characterName);
}

function maybeShowStoryScene(state) {
  if (!state.identity || !Array.isArray(S.storySeen)) return;
  if (!document.getElementById("overlay-story-scene").hidden) return;
  const chapter = storyChapters(state).find(entry =>
    STORY_SCENE_KEYS.includes(entry.key) && !S.storySeen.includes(entry.key)
  );
  if (!chapter) return;
  const pathLore = PATH_LORE[state.identity.pathKey];
  const actor = chapter.key === "first-practice" ? "闻钟" : pathLore.guide;
  const portrait = chapter.key === "first-practice" ? "wenzhong" : pathLore.portrait;
  const overlay = document.getElementById("overlay-story-scene");
  activeStorySceneKey = chapter.key;
  setCharacterPortrait("scene-portrait", portrait, actor);
  overlay.dataset.scene = chapter.key;
  overlay.dataset.root = state.identity.rootKey;
  document.getElementById("scene-meta").textContent = `${chapter.label} · ${chapter.place}`;
  document.getElementById("scene-title").textContent = chapter.key === "first-practice" ? "首 次 引 气" : chapter.title;
  document.getElementById("scene-text").textContent = chapter.text;
  document.body.classList.add("in-story-scene");
  overlay.hidden = false;
}

function initStoryScenes() {
  document.getElementById("scene-ok").onclick = () => {
    if (activeStorySceneKey && !S.storySeen.includes(activeStorySceneKey)) {
      S.storySeen.push(activeStorySceneKey);
      saveState();
    }
    activeStorySceneKey = null;
    const overlay = document.getElementById("overlay-story-scene");
    overlay.hidden = true;
    delete overlay.dataset.scene;
    delete overlay.dataset.root;
    document.body.classList.remove("in-story-scene");
    if (currentView === "home") renderHome({ skipPassive: true });
  };
}

let initiationRouteTimer = null;

function prepareInitiationOverlay(pathKey) {
  const overlay = document.getElementById("overlay-initiation");
  overlay.dataset.guide = pathKey || "talisman";
  overlay.classList.remove("handoff-from-guide", "received", "show-sanctum", "released");
  overlay.hidden = false;
  document.body.classList.remove("initiation-released");
  document.body.classList.add("in-initiation");
  return overlay;
}

function beginInitiationHandoff(pathKey, revealHome) {
  const overlay = prepareInitiationOverlay(pathKey);
  overlay.classList.add("handoff-from-guide");
  window.clearTimeout(initiationRouteTimer);
  initiationRouteTimer = window.setTimeout(() => {
    revealHome();
    overlay.classList.remove("handoff-from-guide");
    overlay.classList.add("received");
  }, 980);
}

function maybeShowInitiationWelcome() {
  if (!S || !S.identity || S.initiationSeen !== false) return false;
  const overlay = prepareInitiationOverlay(S.identity.pathKey);
  overlay.classList.add("received");
  return true;
}

function initInitiationWelcome() {
  const overlay = document.getElementById("overlay-initiation");
  document.getElementById("btn-initiation-follow").onclick = () => {
    overlay.classList.add("show-sanctum");
  };
  document.getElementById("btn-initiation-enter").onclick = () => {
    if (!S) return;
    S.initiationSeen = true;
    saveState();
    overlay.classList.add("released");
    document.body.classList.add("initiation-released");
    document.body.classList.remove("in-initiation");
    window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove("received", "show-sanctum", "released");
    }, 480);
    window.setTimeout(() => document.body.classList.remove("initiation-released"), 1250);
  };
}

function pickReminder(state, todayMins, remain, days) {
  if (state.logs.length === 0) return REMINDERS.newbie;
  const gap = state.lastDay ? daysBetween(state.lastDay, todayStr()) : 0;
  if (gap >= 3) return REMINDERS.back;
  if (remain < 30) return REMINDERS.near;
  if (todayMins === 0) return REMINDERS.daily;
  return REMINDERS.good;
}

function estimateGain(task) {
  return estimatedGain(task);
}

function svgIcon(name, className = "task-symbol") {
  return `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
}

function initSpiritOrbits() {
  document.querySelectorAll(".spirit-orb").forEach((orb, idx) => {
    const radius = 42 + Math.random() * 35;
    const duration = 5.4 + Math.random() * 5.2;
    const delay = -(Math.random() * duration);
    orb.style.setProperty("--orbit-radius", `${radius.toFixed(1)}px`);
    orb.style.setProperty("--orbit-duration", `${duration.toFixed(2)}s`);
    orb.style.setProperty("--orbit-delay", `${delay.toFixed(2)}s`);
    orb.style.setProperty("--orbit-direction", Math.random() < .5 ? "normal" : "reverse");
    orb.style.setProperty("--orb-scale", String((.84 + idx * .07 + Math.random() * .16).toFixed(2)));
  });
}

// ============== 推演模式 ==============
let demoBreakthroughTimer = null;

function renderDemoRealmStage() {
  const state = displayedState();
  document.querySelectorAll("[data-demo-realm-stage]").forEach((button) => {
    button.classList.toggle("active", state && state.realmIdx === Number(button.dataset.demoRealmStage));
  });
}

function openDemoConsole() {
  if (!S) return;
  if (!demoState) demoState = cloneState(S);
  document.body.classList.add("demo-mode");
  document.getElementById("demo-console").hidden = false;
  document.getElementById("btn-demo-next").disabled = false;
  renderHome({ skipPassive: true });
  renderDemoRealmStage();
}

function closeDemoConsole() {
  document.getElementById("demo-console").hidden = true;
}

function simulateNextTask() {
  if (!demoState || medState) return;
  const state = demoState;
  const today = todayStr();
  const todayLogs = state.logs.filter(l => l.date === today);
  const task = tasksScheduledForToday(state).find(t => !todayLogs.some(l => l.taskId === t.id && l.complete));
  if (!task) {
    toast("今日功课均已推演完成，可退出后重新推演");
    return;
  }

  const oldRealm = state.realmIdx;
  const gain = estimatedGain(task);
  state.logs.push({
    id: uid(),
    taskId: task.id,
    taskName: task.name,
    date: today,
    minutes: standardMinutesFor(task),
    gain,
    focused: measureTypeFor(task) === "timer" ? true : null,
    complete: true,
    achievement: targetLabel(task),
    simulated: true,
  });
  state.cultivation += gain;
  state.passiveUpdatedAt = Date.now();
  if (state.lastDay !== today) {
    state.streak = state.lastDay && daysBetween(state.lastDay, today) === 1 ? state.streak + 1 : 1;
    state.lastDay = today;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
  }
  const newRealm = getRealm(state.cultivation);
  renderHome({ skipPassive: true });
  playCompletionBell();
  flyGain(gain);
  toast(`推演：${task.name} 完成 · 修为 +${gain}`);

  if (newRealm > oldRealm) {
    const nextButton = document.getElementById("btn-demo-next");
    nextButton.disabled = true;
    if (demoBreakthroughTimer) clearTimeout(demoBreakthroughTimer);
    demoBreakthroughTimer = setTimeout(() => {
      state.realmIdx = newRealm;
      renderHome({ skipPassive: true });
      closeDemoConsole();
      showBreakthrough(REALMS[oldRealm][0], REALMS[newRealm][0], state.name);
      nextButton.disabled = false;
      demoBreakthroughTimer = null;
    }, 850);
  }
}

function previewRealmStage(realmIdx) {
  if (!S || medState || realmIdx < 0 || realmIdx > 7) return;
  if (!demoState) demoState = cloneState(S);
  if (demoBreakthroughTimer) {
    clearTimeout(demoBreakthroughTimer);
    demoBreakthroughTimer = null;
  }
  document.getElementById("overlay-breakthrough").hidden = true;
  document.body.classList.add("demo-mode");
  demoState.realmIdx = realmIdx;
  demoState.cultivation = REALMS[realmIdx][1];
  demoState.passiveUpdatedAt = Date.now();
  renderHome({ skipPassive: true });
  closeDemoConsole();
  toast(`推演：切换至 ${REALMS[realmIdx][0]}`);
}

function exitDemoMode(announce = false) {
  if (!demoState) return;
  if (demoBreakthroughTimer) {
    clearTimeout(demoBreakthroughTimer);
    demoBreakthroughTimer = null;
  }
  demoState = null;
  document.body.classList.remove("demo-mode");
  document.getElementById("overlay-breakthrough").hidden = true;
  closeDemoConsole();
  if (currentView === "home") renderHome({ skipPassive: true });
  if (announce) toast("已退出推演，实修数据未改变");
}

function initDemoMode() {
  document.getElementById("btn-demo-open").onclick = openDemoConsole;
  document.getElementById("btn-demo-close").onclick = closeDemoConsole;
  document.getElementById("btn-demo-next").onclick = simulateNextTask;
  document.getElementById("btn-demo-restore").onclick = () => exitDemoMode(true);
  document.querySelectorAll("[data-demo-realm-stage]").forEach((button) => {
    button.onclick = () => previewRealmStage(Number(button.dataset.demoRealmStage));
  });
  const legacySnapshot = localStorage.getItem(LEGACY_DEMO_SNAPSHOT_KEY);
  if (legacySnapshot) {
    try {
      S = { ...DEFAULT_STATE, ...JSON.parse(legacySnapshot) };
      saveState();
    } catch (error) {
      console.warn("Legacy demo restore failed:", error);
    }
    localStorage.removeItem(LEGACY_DEMO_SNAPSHOT_KEY);
  }
}

// ============== 修炼大厅 ==============
function renderTasks() {
  if (!S) return;
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  document.getElementById("task-empty").hidden = S.tasks.length > 0;

  const todayLogs = S.logs.filter(l => l.date === todayStr());
  const scheduledIds = new Set(tasksScheduledForToday(S).map(task => task.id));

  orderedTasks(S).forEach((t, index) => {
    const doneToday = todayLogs.filter(l => l.taskId === t.id).length;
    const card = document.createElement("div");
    card.className = "hall-card" + (scheduledIds.has(t.id) ? "" : " resting");
    card.dataset.taskId = t.id;
    const diff = diffLabel(t.difficulty);
    card.innerHTML = `
      <div class="hall-card-header">
        <button type="button" class="drag-handle" data-drag="${t.id}" aria-label="拖动排列 ${escapeHTML(t.name)}" ${t.primary ? "disabled" : ""}>⋮⋮</button>
        <div class="hall-card-title"><span class="hall-symbol">${svgIcon(TASK_ICONS[t.cat] || "spark")}</span>${escapeHTML(t.name)}${t.primary ? '<span class="primary-chip">主修</span>' : ""}</div>
        <span class="difficulty ${diff.cls}">${diff.txt}</span>
      </div>
      <div class="hall-card-body">${escapeHTML(t.desc || "—")} · ${CAT_NAMES[t.cat]} · ${MEASURE_NAMES[measureTypeFor(t)]} · ${targetLabel(t)} · ${scheduleLabel(t)}${scheduledIds.has(t.id) ? " · 今日安排" : " · 今日休息"}${doneToday ? " · 已修炼 " + doneToday + " 次" : ""}</div>
      <div class="hall-card-footer">
        <span class="reward-line">预计 +${remainingEstimatedGain(S, t)} 修为</span>
        <button class="order-btn" data-move-up="${t.id}" aria-label="上移" ${index === 0 || t.primary ? "disabled" : ""}>↑</button>
        <button class="order-btn" data-move-down="${t.id}" aria-label="下移" ${index === S.tasks.length - 1 || t.primary ? "disabled" : ""}>↓</button>
        <button class="edit-btn" data-edit="${t.id}">编辑</button>
        ${measureTypeFor(t) === "timer" ? `<button class="intention-btn" data-intention="${t.id}">起念</button>` : ""}
        <button class="small-btn" data-start="${t.id}">${measureTypeFor(t) === "timer" ? "开始" : "完成"}</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll("[data-start]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const t = S.tasks.find(x => x.id === btn.dataset.start);
      if (t) beginTask(t);
    };
  });
  list.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const t = S.tasks.find(x => x.id === btn.dataset.edit);
      if (t) openForm(t);
    };
  });
  list.querySelectorAll("[data-intention]").forEach(button => {
    button.onclick = event => {
      event.stopPropagation();
      const task = S.tasks.find(candidate => candidate.id === button.dataset.intention);
      if (task) beginTask(task, { intention: true });
    };
  });
  list.querySelectorAll("[data-move-up]").forEach(button => {
    button.onclick = () => moveTask(button.dataset.moveUp, -1);
  });
  list.querySelectorAll("[data-move-down]").forEach(button => {
    button.onclick = () => moveTask(button.dataset.moveDown, 1);
  });
  bindTaskDrag(list);
}

function diffLabel(d) {
  if (d <= 1.0) return { txt: "易 ×1.0", cls: "easy" };
  if (d <= 1.5) return { txt: "中 ×1.5", cls: "" };
  if (d <= 2.5) return { txt: "难 ×2.5", cls: "hard" };
  return { txt: "极难 ×4.0", cls: "god" };
}

function moveTask(taskId, delta) {
  const visible = orderedTasks(S);
  const from = visible.findIndex(task => task.id === taskId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= visible.length || visible[to].primary) return;
  [visible[from], visible[to]] = [visible[to], visible[from]];
  S.tasks = visible;
  saveState();
  renderTasks();
}

function saveDraggedTaskOrder(list) {
  const ids = [...list.querySelectorAll(".hall-card")].map(card => card.dataset.taskId);
  const byId = new Map(S.tasks.map(task => [task.id, task]));
  S.tasks = ids.map(id => byId.get(id)).filter(Boolean);
  saveState();
  renderTasks();
  toast("功课次序已调整");
}

function bindTaskDrag(list) {
  list.querySelectorAll("[data-drag]:not(:disabled)").forEach(handle => {
    let card = null;
    let changed = false;
    handle.onpointerdown = event => {
      event.preventDefault();
      card = handle.closest(".hall-card");
      changed = false;
      card.classList.add("dragging");
      handle.setPointerCapture(event.pointerId);
    };
    handle.onpointermove = event => {
      if (!card) return;
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".hall-card");
      if (!target || target === card || target.querySelector("[data-drag]")?.disabled) return;
      const bounds = target.getBoundingClientRect();
      list.insertBefore(card, event.clientY < bounds.top + bounds.height / 2 ? target : target.nextSibling);
      changed = true;
    };
    const drop = event => {
      if (!card) return;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      card.classList.remove("dragging");
      card = null;
      if (changed) saveDraggedTaskOrder(list);
    };
    handle.onpointerup = drop;
    handle.onpointercancel = drop;
  });
}

// ============== 任务表单 ==============
let editingTask = null;
let mentorDraftTask = null;

function openForm(task) {
  editingTask = task;
  const overlay = document.getElementById("overlay-form");
  document.getElementById("form-title").textContent = task ? "编 辑 功 法" : "新 建 功 法";
  document.getElementById("f-name").value = task ? task.name : "";
  document.getElementById("f-desc").value = task ? (task.desc || "") : "";
  setActiveTab("f-cat-tabs", task ? task.cat : "daily");
  setActiveTab("f-measure-tabs", measureTypeFor(task || {}));
  setActiveTab("f-dur-tabs", task ? String(task.duration) : "25");
  setActiveTab("f-diff-tabs", task ? String(task.difficulty) : "1.5");
  document.getElementById("f-target-value").value = task && task.targetValue ? task.targetValue : "";
  document.getElementById("f-target-unit").value = task && task.targetUnit ? task.targetUnit : "";
  renderMeasureFields();
  const repeatDays = repeatDaysFor(task || {});
  document.querySelectorAll("#f-repeat-tabs .form-tab").forEach(button => {
    button.classList.toggle("active", repeatDays.includes(Number(button.dataset.v)));
  });
  document.getElementById("f-primary").checked = Boolean(task && task.primary);
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

function renderMeasureFields() {
  const measureType = getActiveTab("f-measure-tabs") || "timer";
  const quantityConfig = document.getElementById("f-quantity-config");
  quantityConfig.hidden = measureType !== "count";
  document.getElementById("f-duration-label").textContent = measureType === "timer"
    ? "默认时长（分钟）"
    : "折算投入（分钟）";
  const note = document.getElementById("f-measure-note");
  if (measureType === "timer") {
    note.textContent = "计时功法按真实闭关时长与专注程度结算。";
  } else if (measureType === "count") {
    note.textContent = "数量达到一半开始计修为；达成目标得满额，超过目标 20% 可得 1.15 倍。";
  } else {
    note.textContent = "守约只用于早睡、整理等明确完成/未完成的约定；确认践行后结算。";
  }
}

function simpleChineseNumber(value) {
  if (/^\d+(?:\.\d+)?$/.test(value)) return Number(value);
  const numbers = { "零": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 };
  if (value === "十") return 10;
  if (value.includes("十")) {
    const [tens, ones] = value.split("十");
    return (tens ? numbers[tens] : 1) * 10 + (ones ? numbers[ones] : 0);
  }
  return numbers[value] || null;
}

function techniqueFromNeed(need) {
  const pathKey = S && S.identity ? S.identity.pathKey : "sword";
  const normalized = need.toLowerCase();
  const contains = (...words) => words.some(word => normalized.includes(word));
  let cat = "goal";
  let measureType = "timer";
  let duration = 25;
  let targetValue = null;
  let targetUnit = null;
  if (contains("跑", "运动", "健身", "走路", "散步", "拉伸", "瑜伽")) cat = "sport";
  else if (contains("冥想", "静坐", "呼吸", "正念")) cat = "meditate";
  else if (contains("读", "学", "背", "写", "论文", "英语", "复习", "课程")) cat = "study";
  else if (contains("早睡", "喝水", "整理", "收拾", "不刷", "戒", "服药")) cat = "daily";
  const countMatch = need.match(/(\d+(?:\.\d+)?|[一二两三四五六七八九十]{1,3})\s*(页|个|次|公里|km|千米|词|字|组|杯)/i);
  const minutesMatch = need.match(/(\d+)\s*分/);
  if (countMatch) {
    measureType = "count";
    targetValue = simpleChineseNumber(countMatch[1]);
    targetUnit = countMatch[2];
    duration = targetValue >= 30 ? 25 : 10;
  } else if (cat === "daily" && !minutesMatch) {
    measureType = "checkin";
    duration = 10;
  } else if (minutesMatch) {
    duration = Math.min(60, Math.max(10, Number(minutesMatch[1])));
  }
  const names = {
    sword: { study: "观剑悟意", sport: "踏罡磨锋", meditate: "敛锋听息", daily: "拭剑守约", goal: "一剑开途" },
    body: { study: "凝神炼骨", sport: "百阶淬身", meditate: "沉息固元", daily: "晨钟立身", goal: "负岳行功" },
    alchemy: { study: "辨药炼识", sport: "运火行脉", meditate: "温炉定息", daily: "护火守约", goal: "九转温丹" },
    talisman: { study: "临摹玄篆", sport: "踏符行风", meditate: "静墨澄心", daily: "净案守符", goal: "落笔成章" },
    array: { study: "推衍阵图", sport: "巡阵行步", meditate: "定枢观息", daily: "布阵守时", goal: "周天布势" },
  };
  const difficulty = duration >= 45 ? 2.5 : duration >= 20 ? 1.5 : 1;
  return {
    id: uid(),
    name: names[pathKey][cat],
    desc: need,
    cat,
    measureType,
    duration,
    difficulty,
    targetValue,
    targetUnit,
    primary: false,
    repeatDays: [...EVERY_DAY],
    conferredBy: PATH_LORE[pathKey].guide,
  };
}

function openMentorConsult() {
  if (!S.identity) {
    showView("me");
    toast("先补定灵根与道途，方可拜见引路人");
    return;
  }
  const lore = PATH_LORE[S.identity.pathKey];
  mentorDraftTask = null;
  setCharacterPortrait("mentor-avatar", lore.portrait, lore.guide);
  document.getElementById("mentor-title").textContent = `向 ${lore.guide} 求 法`;
  document.getElementById("mentor-subtitle").textContent = `${lore.hall} · ${lore.title}`;
  document.getElementById("mentor-prompt").textContent = `「${lore.vow} 说吧，你现实中想守住哪一件事？」`;
  document.getElementById("mentor-need").value = "";
  document.getElementById("mentor-offering").hidden = true;
  document.getElementById("mentor-accept").hidden = true;
  document.getElementById("overlay-mentor").hidden = false;
}

function initMentorConsult() {
  document.getElementById("btn-ask-guide").onclick = openMentorConsult;
  document.getElementById("mentor-cancel").onclick = () => {
    mentorDraftTask = null;
    document.getElementById("overlay-mentor").hidden = true;
  };
  document.getElementById("btn-consult-mentor").onclick = () => {
    const need = document.getElementById("mentor-need").value.trim();
    if (!need) {
      toast("请先告诉引路人你想守住的事情");
      return;
    }
    mentorDraftTask = techniqueFromNeed(need);
    const lore = PATH_LORE[S.identity.pathKey];
    document.getElementById("mentor-offering").innerHTML = `
      <small>${escapeHTML(lore.guide)} 授法</small>
      <b>《${escapeHTML(mentorDraftTask.name)}》</b>
      <p>${escapeHTML(need)}</p>
      <span>${MEASURE_NAMES[mentorDraftTask.measureType]} · ${targetLabel(mentorDraftTask)} · ${diffLabel(mentorDraftTask.difficulty).txt} · 预计 +${estimatedGain(mentorDraftTask)} 修为</span>
    `;
    document.getElementById("mentor-offering").hidden = false;
    document.getElementById("mentor-accept").hidden = false;
  };
  document.getElementById("mentor-accept").onclick = () => {
    if (!mentorDraftTask) return;
    S.tasks.push(mentorDraftTask);
    const techniqueName = mentorDraftTask.name;
    const guide = mentorDraftTask.conferredBy;
    saveState();
    document.getElementById("overlay-mentor").hidden = true;
    renderTasks();
    toast(`${guide} 已授予《${techniqueName}》`);
    mentorDraftTask = null;
  };
}

function initForm() {
  bindFormTabs("f-cat-tabs");
  bindFormTabs("f-dur-tabs");
  bindFormTabs("f-diff-tabs");
  document.querySelectorAll("#f-measure-tabs .form-tab").forEach(button => {
    button.onclick = () => {
      setActiveTab("f-measure-tabs", button.dataset.v);
      renderMeasureFields();
    };
  });
  document.querySelectorAll("#f-repeat-tabs .form-tab").forEach(button => {
    button.onclick = () => button.classList.toggle("active");
  });

  document.getElementById("f-cancel").onclick = () => {
    document.getElementById("overlay-form").hidden = true;
  };
  document.getElementById("f-save").onclick = () => {
    const name = document.getElementById("f-name").value.trim();
    const desc = document.getElementById("f-desc").value.trim();
    if (!name) { toast("请填写功法名"); return; }
    const cat = getActiveTab("f-cat-tabs");
    const measureType = getActiveTab("f-measure-tabs") || "timer";
    const duration = parseInt(getActiveTab("f-dur-tabs"), 10);
    const difficulty = parseFloat(getActiveTab("f-diff-tabs"));
    const targetValue = measureType === "count" ? Number(document.getElementById("f-target-value").value) : null;
    const targetUnit = measureType === "count" ? (document.getElementById("f-target-unit").value.trim() || "次") : null;
    if (measureType === "count" && (!targetValue || targetValue <= 0)) { toast("请填写目标数量"); return; }
    const repeatDays = [...document.querySelectorAll("#f-repeat-tabs .form-tab.active")]
      .map(button => Number(button.dataset.v));
    if (repeatDays.length === 0) { toast("至少选择一个修炼日"); return; }
    const primary = document.getElementById("f-primary").checked;
    if (primary) S.tasks.forEach(task => { task.primary = false; });
    if (editingTask) {
      Object.assign(editingTask, { name, desc, cat, measureType, duration, difficulty, targetValue, targetUnit, repeatDays, primary });
    } else {
      S.tasks.push({ id: uid(), name, desc, cat, measureType, duration, difficulty, targetValue, targetUnit, repeatDays, primary });
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
let activityTask = null;
const MEDITATION_SCENE_CLASSES = ["scene-study", "scene-sport", "meditation-ending"];

function setMeditationScene(task) {
  document.body.classList.remove(...MEDITATION_SCENE_CLASSES);
  if (task.cat === "study") document.body.classList.add("scene-study");
  if (task.cat === "sport") document.body.classList.add("scene-sport");
}

function beginTask(task, options = {}) {
  if (measureTypeFor(task) === "timer") {
    if (options.intention && S.logs.some(log =>
      log.date === todayStr() && log.taskId === task.id && log.practiceType === "intention"
    )) {
      toast("此功法今日已完成一次起念");
      return;
    }
    startMeditate(task, options);
  }
  else openActivityCompletion(task);
}

function openActivityCompletion(task) {
  activityTask = task;
  const isCount = measureTypeFor(task) === "count";
  document.getElementById("activity-title").textContent = isCount ? "录 入 成 果" : "践 行 守 约";
  document.getElementById("activity-target").textContent = `${task.name} · ${targetLabel(task)} · 预计 +${estimatedGain(task)} 修为`;
  document.getElementById("activity-count-entry").hidden = !isCount;
  document.getElementById("activity-check-confirm").hidden = isCount;
  document.getElementById("activity-amount").value = "";
  document.getElementById("activity-unit").textContent = task.targetUnit || "次";
  document.getElementById("overlay-activity").hidden = false;
}

function grantTaskReward(task, reward) {
  if (!reward.valid) {
    toast("未达目标一半，本次不计入修为");
    return false;
  }
  playCompletionBell();
  const today = todayStr();
  S.logs.push({
    id: uid(),
    taskId: task.id,
    taskName: task.name,
    date: today,
    minutes: reward.minutes,
    gain: reward.gain,
    focused: reward.focused,
    complete: reward.complete,
    measureType: measureTypeFor(task),
    achievement: reward.achievement,
    practiceType: reward.practiceType || (task.restful ? "rest" : "regular"),
  });
  const oldRealm = S.realmIdx;
  const oldCultivation = S.cultivation;
  S.cultivation += reward.gain;
  const newRealm = getRealm(S.cultivation);
  if (S.lastDay !== today) {
    S.streak = S.lastDay && daysBetween(S.lastDay, today) === 1 ? S.streak + 1 : 1;
    S.lastDay = today;
    S.maxStreak = Math.max(S.maxStreak, S.streak);
  }
  const breakthrough = newRealm > oldRealm;
  if (breakthrough) S.realmIdx = newRealm;
  saveState();
  showResult(task, reward, {
    oldCultivation,
    oldRealm,
    newRealm,
    onOk: breakthrough ? () => showBreakthrough(REALMS[oldRealm][0], REALMS[newRealm][0]) : null,
  });
  return true;
}

function startMeditate(task, options = {}) {
  const duration = options.intention ? INTENTION_MINUTES : task.duration;
  const overlay = document.getElementById("overlay-meditate");
  showView("home");
  S.passiveUpdatedAt = Date.now();
  saveState();
  setMeditationScene(task);
  document.getElementById("med-task").textContent = task.name + (options.intention ? " · 起念一息" : " · " + task.duration + " 分钟");
  document.getElementById("med-time").textContent = formatTime(duration * 60);
  document.getElementById("med-quote").textContent = `"${rand(QUOTES)}"`;
  document.getElementById("med-toggle").innerHTML = svgIcon("pause", "ui-icon");

  medState = {
    task,
    intention: Boolean(options.intention),
    totalSec: duration * 60,
    leftSec: duration * 60,
    endAt: Date.now() + duration * 60000,
    remainingMs: duration * 60000,
    paused: false,
    focused: true,
    finishing: false,
    startedAt: Date.now(),
  };
  updateMedUI();
  document.body.classList.add("in-meditation");
  document.body.classList.remove("meditation-distracted", "meditation-paused", "meditation-result");
  overlay.hidden = false;
  document.getElementById("tabbar").style.display = "none";
  renderSoundscapeSelection();
  startSoundscape(S.soundscape);

  startMedTick();
}

function startMedTick() {
  if (medTimer) clearInterval(medTimer);
  medTimer = setInterval(() => {
    if (!medState || medState.paused) return;
    syncMeditationClock();
    updateMedUI();
    if (medState.leftSec <= 0) {
      finishMeditate(true);
    }
  }, 250);
}

function syncMeditationClock() {
  if (!medState || medState.paused) return;
  medState.remainingMs = Math.max(0, medState.endAt - Date.now());
  medState.leftSec = Math.ceil(medState.remainingMs / 1000);
}

function updateMedUI() {
  document.getElementById("med-time").textContent = formatTime(Math.max(0, medState.leftSec));
  const progress = 1 - medState.leftSec / medState.totalSec;
  const dashOffset = 678.58 * progress;
  document.getElementById("med-ring").setAttribute("stroke-dashoffset", dashOffset);
  const activeSpeed = Math.round(medState.task.difficulty * (medState.focused ? 1.2 : 0.8) * 60);
  document.getElementById("med-mult").innerHTML = medState.focused
    ? `${svgIcon("spark", "inline-icon")}心境澄明 · ${activeSpeed} 修为/小时`
    : `心神微散 · ${activeSpeed} 修为/小时`;
  document.body.classList.toggle("meditation-distracted", !medState.focused);
  document.body.classList.toggle("meditation-ending", !medState.paused && medState.leftSec <= 60);
  const status = document.getElementById("med-status");
  if (medState.paused) {
    status.textContent = "入定已暂停 · 恢复后将继续计时";
  } else if (medState.leftSec <= 60) {
    status.textContent = "一息将满 · 守住最后片刻";
  } else if (!medState.focused) {
    status.textContent = "心神曾散 · 计时仍按真实时间推进";
  } else {
    status.textContent = "计时已启 · 离开页面后仍按实际时间收束";
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function finishMeditate(complete) {
  if (!medState || medState.finishing) return;
  syncMeditationClock();
  medState.finishing = true;
  if (medTimer) { clearInterval(medTimer); medTimer = null; }
  stopSoundscape();
  const task = medState.task;
  const actualSec = medState.totalSec - medState.leftSec;
  const actualMins = Math.max(1, Math.round(actualSec / 60));
  const reward = calculateReward(task, {
    minutes: actualMins,
    complete: complete && !medState.intention,
    intentionComplete: complete && medState.intention,
    focused: medState.focused,
  });
  if (medState.intention) {
    reward.practiceType = "intention";
    reward.achievement = `起念 · ${reward.achievement}`;
  }
  if (reward.valid) {
    grantTaskReward(task, reward);
  } else {
    toast(medState.intention ? "一息未满，本次不计入修为" : "未满 5 分钟，本次不计入修为");
    exitMeditationScene();
  }
  hideOverlay("overlay-meditate");
  medState = null;
}

function showResult(task, reward, options = {}) {
  const { oldCultivation = S.cultivation - reward.gain, oldRealm = S.realmIdx, newRealm = S.realmIdx, onOk = null } = options;
  const crossedRealm = newRealm > oldRealm;
  document.body.classList.add("meditation-result");
  document.getElementById("result-title").textContent = reward.practiceType === "intention"
    ? "一 念 既 起"
    : (reward.complete ? "功课圆满" : "小有所得");
  document.getElementById("result-task").textContent = task.name;
  document.getElementById("result-mins").textContent = reward.achievement;
  document.getElementById("result-gain").textContent = "+" + reward.gain;
  document.getElementById("result-formula").textContent = `${reward.formula} ≈ ${reward.gain}`;
  const progressRealm = crossedRealm ? oldRealm : S.realmIdx;
  const threshold = nextRealmThreshold(progressRealm);
  const progress = crossedRealm ? 100 : realmProgress(S.cultivation, S.realmIdx);
  document.getElementById("result-progress-realm").textContent = crossedRealm
    ? `${REALMS[oldRealm][0]} → ${REALMS[newRealm][0]}`
    : REALMS[S.realmIdx][0];
  document.getElementById("result-progress-value").textContent = crossedRealm
    ? "可破境"
    : `${formatCultivation(S.cultivation)} / ${threshold.toLocaleString()}`;
  const progressFill = document.getElementById("result-progress-fill");
  progressFill.style.width = `${realmProgress(oldCultivation, oldRealm)}%`;
  requestAnimationFrame(() => {
    progressFill.style.width = `${progress}%`;
  });
  const nextHint = document.getElementById("result-next-hint");
  nextHint.classList.toggle("break-ready", crossedRealm);
  nextHint.textContent = crossedRealm
    ? "灵气盈满，收敛气息后立即破境"
    : `距离 ${REALMS[Math.min(S.realmIdx + 1, REALMS.length - 1)][0]} 尚需 ${Math.ceil(Math.max(0, threshold - S.cultivation))} 修为`;
  const nextTask = crossedRealm ? null : tasksScheduledForToday(S).find(candidate =>
    !S.logs.some(log => log.date === todayStr() && log.taskId === candidate.id && log.complete)
  );
  const nextButton = document.getElementById("result-next");
  nextButton.hidden = !nextTask;
  document.getElementById("overlay-result").hidden = false;
  document.getElementById("result-ok").onclick = () => {
    document.getElementById("overlay-result").hidden = true;
    exitMeditationScene();
    if (onOk) onOk();
    else revealHomeGain(reward.gain);
  };
  nextButton.onclick = () => {
    if (!nextTask) return;
    document.getElementById("overlay-result").hidden = true;
    exitMeditationScene();
    revealHomeGain(reward.gain);
    beginTask(nextTask);
  };
}

function exitMeditationScene() {
  stopSoundscape();
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

function revealHomeGain(gain) {
  showView("home");
  const panel = document.querySelector(".cultivation-panel");
  panel.classList.remove("reward-arrived");
  requestAnimationFrame(() => panel.classList.add("reward-arrived"));
  setTimeout(() => panel.classList.remove("reward-arrived"), 900);
  flyGain(gain);
}

function showBreakthrough(oldName, newName, cultivatorName = S.name) {
  document.getElementById("break-old").textContent = oldName;
  document.getElementById("break-new").textContent = newName;
  document.getElementById("break-desc").textContent =
    `灵气贯通周天，${cultivatorName} 一举破入 ${newName} 之境`;
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
    if (demoState) exitDemoMode();
    const scheduled = S ? tasksScheduledForToday(S) : [];
    const completedToday = new Set(S ? S.logs
      .filter(log => log.date === todayStr() && log.complete)
      .map(log => log.taskId) : []);
    const task = scheduled.find(candidate => !completedToday.has(candidate.id)) || scheduled[0];
    if (!task) {
      showView("tasks");
      if (S && S.tasks.length) toast("今日没有排定功课");
      return;
    }
    beginTask(task);
  };

  document.getElementById("med-toggle").onclick = () => {
    if (!medState) return;
    if (medState.paused) {
      medState.paused = false;
      medState.endAt = Date.now() + medState.remainingMs;
    } else {
      syncMeditationClock();
      medState.paused = true;
    }
    document.body.classList.toggle("meditation-paused", medState.paused);
    document.getElementById("med-toggle").innerHTML = svgIcon(medState.paused ? "play" : "pause", "ui-icon");
    if (medState.paused) stopSoundscape();
    else startSoundscape(S.soundscape);
    updateMedUI();
  };
  document.getElementById("med-add5").onclick = () => {
    if (!medState) return;
    if (!medState.paused) syncMeditationClock();
    medState.remainingMs += 5 * 60000;
    if (!medState.paused) medState.endAt += 5 * 60000;
    medState.leftSec = Math.ceil(medState.remainingMs / 1000);
    medState.totalSec += 5 * 60;
    updateMedUI();
    toast("已加 5 分钟");
  };
  document.getElementById("med-stop").onclick = () => {
    if (!medState) return;
    const threshold = medState.intention ? "一息结束后方可记入修为。" : "若已坐满 5 分钟，本次修为会按比例计入。";
    if (confirm(`确定提前出关？\n${threshold}`)) {
      finishMeditate(false);
    }
  };
  document.querySelectorAll("[data-soundscape]").forEach(button => {
    button.onclick = () => {
      if (!S) return;
      S.soundscape = button.dataset.soundscape;
      saveState();
      renderSoundscapeSelection();
      if (medState && !medState.paused) startSoundscape(S.soundscape);
      toast(`声景：${SOUNDSCAPE_NAMES[S.soundscape]}`);
    };
  });
  document.getElementById("activity-cancel").onclick = () => {
    activityTask = null;
    document.getElementById("overlay-activity").hidden = true;
  };
  document.getElementById("activity-complete").onclick = () => {
    if (!activityTask) return;
    const task = activityTask;
    const outcome = measureTypeFor(task) === "count"
      ? { amount: document.getElementById("activity-amount").value }
      : {};
    let reward = calculateReward(task, outcome);
    if (!reward.valid) {
      toast("未达目标一半，本次不计入修为");
      return;
    }
    reward = incrementalActivityReward(task, reward);
    if (!reward) {
      toast("今日成果已结算，无新增修为");
      return;
    }
    activityTask = null;
    document.getElementById("overlay-activity").hidden = true;
    grantTaskReward(task, reward);
  };

  // 切出仍影响专注收益，但剩余时间按真实时间戳校准。
  document.addEventListener("visibilitychange", () => {
    if (medState && !medState.paused) {
      syncMeditationClock();
      if (medState.leftSec <= 0) {
        finishMeditate(true);
        return;
      }
      if (document.hidden) medState.focused = false;
      updateMedUI();
    }
  });
}

function renderSoundscapeSelection() {
  document.querySelectorAll("[data-soundscape]").forEach(button => {
    button.classList.toggle("active", S && button.dataset.soundscape === S.soundscape);
  });
}

function initPracticeMode() {
  document.getElementById("btn-rest-day").onclick = () => {
    if (!S) return;
    const today = todayStr();
    if (isRestDay(S, today)) {
      delete S.restDays[today];
      toast("今日恢复常行");
    } else {
      S.restDays[today] = true;
      toast("今日转入养息，只守一门轻功课");
    }
    saveState();
    renderHome();
  };
}

function returnIntentionTask(state) {
  return orderedTasks(state).find(task => measureTypeFor(task) === "timer") || null;
}

function maybeShowReturnWelcome() {
  if (!S || !S.createdAt || !S.lastDay || S.returnPromptDay === todayStr()) return;
  if (daysBetween(S.lastDay, todayStr()) < RETURN_GAP_DAYS) return;
  document.getElementById("overlay-return").hidden = false;
}

function initReturnWelcome() {
  document.getElementById("btn-return-intention").onclick = () => {
    const task = returnIntentionTask(S);
    S.returnPromptDay = todayStr();
    saveState();
    document.getElementById("overlay-return").hidden = true;
    if (task) {
      beginTask(task, { intention: true });
    } else {
      showView("tasks");
      toast("请先向引路人求一门可起念的计时功法");
    }
  };
  document.getElementById("btn-return-enter").onclick = () => {
    S.returnPromptDay = todayStr();
    saveState();
    document.getElementById("overlay-return").hidden = true;
  };
}

// ============== 统计 ==============
function renderStats() {
  if (!S) return;
  document.getElementById("s-total-cult").textContent = Math.round(S.cultivation);
  const totalMins = S.logs.reduce((s, l) => s + l.minutes, 0);
  document.getElementById("s-total-mins").textContent = totalMins;
  document.getElementById("s-total-sess").textContent = S.logs.length;
  document.getElementById("s-max-streak").textContent = S.maxStreak;
  renderWorldDossier(S);

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
          <div class="log-item-time">${l.date} · ${escapeHTML(l.achievement || l.minutes + " 分钟")}${l.focused === false ? " · 心魔扰心" : ""}</div>
        </div>
        <div class="log-item-gain">+${l.gain}</div>
      `;
      logList.appendChild(item);
    });
  }

  const storyList = document.getElementById("story-list");
  const chapters = storyChapters(S).reverse();
  storyList.innerHTML = chapters.length
    ? chapters.map(chapter => `
      <div class="story-card">
        <span>${escapeHTML(chapter.label || "机缘")} · ${escapeHTML(chapter.place || WORLD_SETTING.mountain)}</span>
        <b>${escapeHTML(chapter.title)}</b>
        <small>${escapeHTML(chapter.date || (S.createdAt ? dateStr(new Date(S.createdAt)) : ""))}</small>
        <p>${escapeHTML(chapter.text)}</p>
      </div>
    `).join("")
    : '<div class="empty-hint">择定灵根与道途后，机缘将由真实修行写下。</div>';
}

function renderWorldDossier(state) {
  const main = mainStoryState(state);
  document.getElementById("world-era").textContent = WORLD_SETTING.era;
  document.getElementById("world-title").textContent = `${WORLD_SETTING.realm} · ${WORLD_SETTING.mountain}`;
  document.getElementById("world-premise").textContent = WORLD_SETTING.premise;
  document.getElementById("world-chapter").textContent = main.chapter;
  document.getElementById("world-place").textContent = main.place;
  document.getElementById("world-objective").textContent = main.objective;
  const affiliation = document.getElementById("world-affiliation");
  const people = [...SIDE_CHARACTERS];
  if (state.identity) {
    const root = SPIRIT_ROOTS[state.identity.rootKey].name;
    const path = DAO_PATHS[state.identity.pathKey].name;
    const pathLore = PATH_LORE[state.identity.pathKey];
    affiliation.innerHTML = `<b>${escapeHTML(WORLD_SETTING.sect)}</b><span>${escapeHTML(state.name)} · ${escapeHTML(root)} · ${escapeHTML(path)}</span><p>${escapeHTML(WORLD_SETTING.creed)}</p>`;
    people.unshift({
      name: pathLore.guide,
      role: `${pathLore.hall} · ${pathLore.title}`,
      note: `你的道途引路人。${pathLore.vow}`,
    });
  } else {
    affiliation.innerHTML = `<b>${escapeHTML(WORLD_SETTING.sect)}</b><span>尚未录名</span><p>${escapeHTML(WORLD_SETTING.creed)}</p>`;
  }
  document.getElementById("world-people").innerHTML = people.map(person => `
    <div class="character-card">
      <b>${escapeHTML(person.name)}</b>
      <small>${escapeHTML(person.role)}</small>
      <p>${escapeHTML(person.note)}</p>
    </div>
  `).join("");
}

// ============== 我 ==============
function renderMe() {
  if (!S) return;
  document.getElementById("me-name").textContent = S.name;
  document.getElementById("me-realm").textContent = REALMS[S.realmIdx][0];
  const identity = S.identity;
  document.getElementById("me-root").textContent = identity ? SPIRIT_ROOTS[identity.rootKey].name : "未定";
  document.getElementById("me-path").textContent = identity ? DAO_PATHS[identity.pathKey].name : "未定";
  document.getElementById("me-pillars-row").hidden = !identity || !identity.pillars;
  document.getElementById("me-pillars").textContent = identity && identity.pillars ? identity.pillars.join(" · ") : "—";
  document.getElementById("btn-identity-upgrade").hidden = Boolean(identity);
  document.getElementById("me-since").textContent = S.createdAt ? dateStr(new Date(S.createdAt)) : "—";
  document.getElementById("me-cult").textContent = Math.round(S.cultivation);
  document.getElementById("ambient-volume").value = S.ambienceVolume;
  document.getElementById("effect-volume").value = S.effectVolume;
  document.getElementById("ambient-volume-label").textContent = `${S.ambienceVolume}%`;
  document.getElementById("effect-volume-label").textContent = `${S.effectVolume}%`;
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
  document.getElementById("btn-preview-bell").onclick = playCompletionBell;
  document.querySelectorAll("[data-preview-soundscape]").forEach(button => {
    button.onclick = () => {
      previewSoundscape(button.dataset.previewSoundscape);
      toast(`试听：${SOUNDSCAPE_NAMES[button.dataset.previewSoundscape]}`);
    };
  });
  document.getElementById("ambient-volume").oninput = (event) => {
    S.ambienceVolume = Number(event.target.value);
    document.getElementById("ambient-volume-label").textContent = `${S.ambienceVolume}%`;
    if (ambienceAudio) ambienceAudio.volume = S.ambienceVolume / 100;
    saveState();
  };
  document.getElementById("effect-volume").oninput = (event) => {
    S.effectVolume = Number(event.target.value);
    document.getElementById("effect-volume-label").textContent = `${S.effectVolume}%`;
    if (bellAudio) bellAudio.volume = S.effectVolume / 100;
    saveState();
  };
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
  initMentorConsult();
  initMeditate();
  initDemoMode();
  initMe();
  initPracticeMode();
  initStoryScenes();
  initInitiationWelcome();
  initReturnWelcome();
  initSpiritOrbits();

  if (!S) {
    showView("onboarding");
  } else {
    showView("home");
    if (!maybeShowInitiationWelcome()) maybeShowReturnWelcome();
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
