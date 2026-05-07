// ── SVG geometry constants ──────────────────────────────────────────────────
const CX = 250, CY = 250;
const CENTER_R  = 72;
const SEG_INNER = 79;
const SEG_OUTER = 208;
const TICK_R    = 211;
const LABEL_R   = 221;

// ── Color palettes ──────────────────────────────────────────────────────────
const PALETTES = {
  pastel: [
    '#FFB3C6','#FFCBA4','#FFF099','#B5F2C8','#B3D9FF',
    '#D5B8FF','#FFB3D9','#A8F0E8','#FFC8A0','#D0F0A8',
    '#F0C0F0','#A8D8FF','#FFD0A0','#B8FFD8','#F0B0D0',
    '#C8D0FF','#FFE0B8','#A8EED8','#FFB8C8','#D8B8FF',
    '#B8F8C8','#FFD8A8','#C8F0FF','#F8C8F0',
  ],
  vivid: [
    '#FF6B6B','#FF8C42','#FFC857','#4ECDC4','#45B7D1',
    '#96E6A1','#F9CA24','#F0932B','#EB4D4B','#6AB04C',
    '#E056DA','#686DE0','#48DBFB','#22A6B3','#BE2EDD',
    '#F9CA24','#FF9FF3','#00D2D3','#FF6348','#7BED9F',
    '#70A1FF','#5F27CD','#01ABC6','#FF4D4D',
  ],
  ocean: [
    '#74B9FF','#A29BFE','#81ECEC','#55EFC4','#00B894',
    '#0984E3','#6C5CE7','#00CEC9','#BADC58','#7ED6DF',
    '#22A6B3','#7FDBFF','#01CBC6','#1289A7','#C4E538',
    '#009432','#12CBC4','#FDA7DF','#9980FA','#C4E538',
    '#5758BB','#D980FA','#1289A7','#3D9970',
  ],
  forest: [
    '#55EFC4','#00B894','#BADC58','#6AB04C','#1DD1A1',
    '#A3CB38','#009432','#C4E538','#33D9B2','#F7DC6F',
    '#82E0AA','#AED6F1','#A569BD','#FAD7A0','#F9E79F',
    '#A8D8EA','#B5E8A0','#D4EFDF','#D7BDE2','#D2B4DE',
    '#AED6F1','#A9DFBF','#FDEBD0','#ABE0B8',
  ],
  sunset: [
    '#FF6B9D','#FF9A8B','#FFC3A0','#FFD1A4','#FFECB3',
    '#FFA3A3','#FF8B94','#FFAAA5','#FFB3BA','#FFD6BA',
    '#FFC8A2','#FF9F85','#FF7675','#FD79A8','#FDCB6E',
    '#E17055','#FAB1A0','#F19066','#F8A5C2','#F5CD79',
    '#FDA7DF','#E77F67','#CF6A87','#D6A2E8',
  ],
  candy: [
    '#FF85A2','#FFB347','#FFD700','#98FF98','#87CEEB',
    '#DDA0DD','#FF7F50','#20B2AA','#FF69B4','#32CD32',
    '#FF6347','#9370DB','#00FA9A','#FF4500','#DA70D6',
    '#ADFF2F','#FF8C00','#7B68EE','#00CED1','#DC143C',
    '#FF1493','#00FF7F','#FFA500','#4169E1',
  ],
};

// ── Emoji set ───────────────────────────────────────────────────────────────
const EMOJIS = [
  '🌅','🌙','⭐','🌞','🌈','🌸','🌿','🍀',
  '🍳','🥣','🥞','🍱','🍜','🍕','🍎','🥗',
  '📚','✏️','📖','🔬','🔢','🌍','💻','📝',
  '🏃','⚽','🏊','🚴','🤸','🏋️','🚶','🧘',
  '🎮','🎵','🎨','🎭','📺','🎯','🎸','🎪',
  '🛁','🧼','😴','☕','💆','🌺','🦋','🐱',
  '🎒','🎀','🌟','💫','🍦','🧁','🍩','🎁',
];

// ── Default segment templates ────────────────────────────────────────────────
const TEMPLATES = {
  6: [
    { label:'아침',      emoji:'🌅', time:'06:00' },
    { label:'오전 공부', emoji:'📚', time:'09:00' },
    { label:'점심',      emoji:'🍱', time:'12:00' },
    { label:'오후 활동', emoji:'⚽', time:'14:00' },
    { label:'저녁',      emoji:'🍜', time:'18:00' },
    { label:'취침',      emoji:'🌙', time:'21:00' },
  ],
  8: [
    { label:'기상',      emoji:'🌅', time:'06:00' },
    { label:'아침식사',  emoji:'🍳', time:'07:30' },
    { label:'오전 공부', emoji:'📚', time:'09:00' },
    { label:'점심',      emoji:'🍱', time:'12:00' },
    { label:'오후 공부', emoji:'✏️', time:'13:30' },
    { label:'운동',      emoji:'⚽', time:'16:00' },
    { label:'저녁식사',  emoji:'🍜', time:'18:00' },
    { label:'취침',      emoji:'🌙', time:'21:00' },
  ],
  12: [
    { label:'기상',      emoji:'🌅', time:'06:00' },
    { label:'아침준비',  emoji:'🧼', time:'07:00' },
    { label:'아침식사',  emoji:'🍳', time:'08:00' },
    { label:'공부',      emoji:'📚', time:'09:00' },
    { label:'휴식',      emoji:'☕', time:'10:30' },
    { label:'공부',      emoji:'✏️', time:'11:00' },
    { label:'점심식사',  emoji:'🍱', time:'12:00' },
    { label:'낮잠',      emoji:'😴', time:'13:00' },
    { label:'운동',      emoji:'⚽', time:'14:00' },
    { label:'자유시간',  emoji:'🎮', time:'16:00' },
    { label:'저녁식사',  emoji:'🍜', time:'18:00' },
    { label:'취침준비',  emoji:'🌙', time:'21:00' },
  ],
  16: [
    { label:'기상',      emoji:'🌅', time:'06:00' },
    { label:'씻기',      emoji:'🧼', time:'06:30' },
    { label:'아침',      emoji:'🍳', time:'07:00' },
    { label:'준비',      emoji:'🎒', time:'08:00' },
    { label:'공부',      emoji:'📚', time:'09:00' },
    { label:'공부',      emoji:'✏️', time:'10:00' },
    { label:'휴식',      emoji:'☕', time:'11:00' },
    { label:'공부',      emoji:'📖', time:'11:30' },
    { label:'점심',      emoji:'🍱', time:'12:00' },
    { label:'낮잠',      emoji:'😴', time:'13:00' },
    { label:'공부',      emoji:'🔬', time:'14:00' },
    { label:'운동',      emoji:'⚽', time:'15:30' },
    { label:'독서',      emoji:'📖', time:'16:30' },
    { label:'저녁',      emoji:'🍜', time:'18:00' },
    { label:'자유',      emoji:'🎮', time:'19:00' },
    { label:'취침',      emoji:'🌙', time:'21:00' },
  ],
  24: [
    { label:'취침', emoji:'🌙', time:'00:00' },
    { label:'취침', emoji:'😴', time:'01:00' },
    { label:'취침', emoji:'💤', time:'02:00' },
    { label:'취침', emoji:'🛌', time:'03:00' },
    { label:'취침', emoji:'⭐', time:'04:00' },
    { label:'취침', emoji:'🌠', time:'05:00' },
    { label:'기상', emoji:'🌅', time:'06:00' },
    { label:'씻기', emoji:'🧼', time:'07:00' },
    { label:'아침', emoji:'🍳', time:'08:00' },
    { label:'공부', emoji:'📚', time:'09:00' },
    { label:'공부', emoji:'✏️', time:'10:00' },
    { label:'휴식', emoji:'☕', time:'11:00' },
    { label:'점심', emoji:'🍱', time:'12:00' },
    { label:'낮잠', emoji:'😴', time:'13:00' },
    { label:'공부', emoji:'📖', time:'14:00' },
    { label:'운동', emoji:'⚽', time:'15:00' },
    { label:'독서', emoji:'📖', time:'16:00' },
    { label:'자유', emoji:'🎮', time:'17:00' },
    { label:'저녁', emoji:'🍜', time:'18:00' },
    { label:'자유', emoji:'📺', time:'19:00' },
    { label:'씻기', emoji:'🛁', time:'20:00' },
    { label:'준비', emoji:'🌙', time:'21:00' },
    { label:'독서', emoji:'📖', time:'22:00' },
    { label:'취침', emoji:'😴', time:'23:00' },
  ],
};

// ── Utilities ────────────────────────────────────────────────────────────────
function dateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function todayDayName() {
  return ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
}

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const escapeXml = escapeHtml;

function formatKoreanDate(d = new Date()) {
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

// ── localStorage helpers ─────────────────────────────────────────────────────
function loadData(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Tab navigation ───────────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');

  if (tabId === 'todo')    renderTodos();
  if (tabId === 'routine') renderRoutines();
  if (tabId === 'report')  renderReport();
}

// ────────────────────────────────────────────────────────────────────────────
// PLANNER MODULE
// ────────────────────────────────────────────────────────────────────────────
const PLANNER_KEY = 'haru_planner';

const state = (() => {
  const saved = loadData(PLANNER_KEY, null);
  if (saved) return { ...saved, selected: null };
  return {
    title:    '나의 방학 일정표',
    date:     '2025년 여름방학',
    name:     '',
    count:    12,
    theme:    'pastel',
    segments: [],
    selected: null,
  };
})();

function savePlanner() {
  const { selected, ...rest } = state;
  saveData(PLANNER_KEY, rest);
}

function buildSegments(count, theme) {
  const palette = PALETTES[theme];
  return TEMPLATES[count].map((t, i) => ({
    label: t.label,
    emoji: t.emoji,
    time:  t.time,
    color: palette[i % palette.length],
  }));
}

// ── SVG helpers ──────────────────────────────────────────────────────────────
function toXY(r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function arcPath(iR, oR, sDeg, eDeg) {
  const [x0, y0] = toXY(iR, sDeg);
  const [x1, y1] = toXY(oR, sDeg);
  const [x2, y2] = toXY(oR, eDeg);
  const [x3, y3] = toXY(iR, eDeg);
  const la = (eDeg - sDeg) > 180 ? 1 : 0;
  return `M${x0},${y0}L${x1},${y1}A${oR},${oR} 0 ${la},1 ${x2},${y2}L${x3},${y3}A${iR},${iR} 0 ${la},0 ${x0},${y0}Z`;
}

function renderSVG() {
  const { count, segments, selected, title, date, name } = state;
  const deg = 360 / count;

  const emojiSz  = count <= 6 ? 24 : count <= 8 ? 20 : count <= 12 ? 16 : count <= 16 ? 12 : 9;
  const labelSz  = count <= 8 ? 12 : count <= 12 ? 10.5 : count <= 16 ? 8.5 : 0;
  const showLabel = count <= 16;

  const midR = SEG_INNER + (SEG_OUTER - SEG_INNER) * 0.5;
  const font = "'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif";

  let s = '';

  s += `<circle cx="${CX}" cy="${CY}" r="${LABEL_R + 8}" fill="#f8eef4"/>`;

  segments.forEach((seg, i) => {
    const sDeg = i * deg;
    const eDeg = sDeg + deg;
    const mDeg = sDeg + deg / 2;
    const [tx, ty] = toXY(midR, mDeg);

    const isSel = selected === i;
    s += `<path d="${arcPath(SEG_INNER, SEG_OUTER, sDeg, eDeg)}"
      fill="${escapeXml(seg.color)}"
      stroke="${isSel ? '#333' : 'white'}"
      stroke-width="${isSel ? 3 : 1.5}"
      class="seg-path"
      data-idx="${i}"
      onclick="selectSeg(${i})"/>`;

    const emojiY = showLabel && labelSz > 0 ? ty - emojiSz * 0.44 : ty;
    s += `<text x="${tx}" y="${emojiY}"
      text-anchor="middle" dominant-baseline="middle"
      font-size="${emojiSz}" style="pointer-events:none;user-select:none">${seg.emoji}</text>`;

    if (showLabel && labelSz > 0) {
      s += `<text x="${tx}" y="${ty + emojiSz * 0.56 + 1}"
        text-anchor="middle" dominant-baseline="hanging"
        font-size="${labelSz}" font-family="${font}" fill="#2D1A25"
        style="pointer-events:none;user-select:none">${escapeXml(seg.label)}</text>`;
    }

    if (seg.time) {
      const [lx, ly] = toXY(LABEL_R, mDeg);
      let rot = mDeg;
      if (mDeg > 90 && mDeg <= 270) rot = mDeg - 180;
      s += `<text x="${lx}" y="${ly}"
        text-anchor="middle" dominant-baseline="middle"
        font-size="6.5" font-family="${font}" fill="#9B7A8D"
        transform="rotate(${rot},${lx},${ly})"
        style="pointer-events:none;user-select:none">${escapeXml(seg.time)}</text>`;
    }
  });

  for (let i = 0; i < count; i++) {
    const [x1, y1] = toXY(SEG_INNER, i * deg);
    const [x2, y2] = toXY(SEG_OUTER, i * deg);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="1.5"/>`;
  }

  s += `<circle cx="${CX}" cy="${CY}" r="${CENTER_R + 5}" fill="white"/>`;
  s += `<circle cx="${CX}" cy="${CY}" r="${CENTER_R}" fill="white" stroke="#F0D9E8" stroke-width="2"/>`;

  for (let i = 0; i < 36; i++) {
    const [dx, dy] = toXY(CENTER_R + 2.5, i * 10);
    s += `<circle cx="${dx}" cy="${dy}" r="1.8" fill="#F0D9E8"/>`;
  }

  const lines = [title, date, name].filter(Boolean);
  const lineH = 13;
  const startY = CY - ((lines.length - 1) * lineH) / 2;

  lines.forEach((line, i) => {
    const isFirst = i === 0;
    s += `<text x="${CX}" y="${startY + i * lineH}"
      text-anchor="middle" dominant-baseline="middle"
      font-size="${isFirst ? 9.5 : 8}"
      font-weight="${isFirst ? '800' : '500'}"
      font-family="${font}"
      fill="${isFirst ? '#D63384' : '#9B7A8D'}"
      style="pointer-events:none;user-select:none">${escapeXml(line)}</text>`;
  });

  document.getElementById('planner').innerHTML = s;
}

function selectSeg(idx) {
  state.selected = state.selected === idx ? null : idx;
  renderSVG();
  renderEditor();
}

function renderEditor() {
  const panel = document.getElementById('editorPanel');
  const { selected, segments } = state;

  if (selected === null) {
    panel.innerHTML = `
      <div class="panel-title">✏️ 칸 수정하기</div>
      <div class="editor-empty">
        <div class="editor-empty-icon">👆</div>
        <p>원 안의 칸을 클릭해서<br>내용을 수정해보세요!</p>
      </div>`;
    return;
  }

  const seg = segments[selected];
  const palette = PALETTES[state.theme];

  const emojiBtns = EMOJIS.map(e =>
    `<button class="emoji-btn${seg.emoji === e ? ' active' : ''}"
      onclick="updateSeg('emoji','${e}')">${e}</button>`
  ).join('');

  const colorSwatches = palette.slice(0, 24).map(c =>
    `<button class="color-swatch${seg.color === c ? ' active' : ''}"
      style="background:${c}"
      onclick="updateSeg('color','${c}')"></button>`
  ).join('');

  panel.innerHTML = `
    <div class="panel-title">✏️ ${selected + 1}번 칸 수정</div>
    <div class="seg-editor">
      <div class="seg-color-preview" style="background:${seg.color}">${seg.emoji}</div>
      <div>
        <div class="editor-section-label">활동 이름</div>
        <input class="field-input" id="segLabel"
          value="${escapeXml(seg.label)}"
          placeholder="예) 공부, 운동..."
          oninput="updateSeg('label', this.value)">
      </div>
      <div>
        <div class="editor-section-label">시간</div>
        <input class="field-input" id="segTime"
          value="${escapeXml(seg.time)}"
          placeholder="예) 09:00"
          oninput="updateSeg('time', this.value)">
      </div>
      <div>
        <div class="editor-section-label">아이콘</div>
        <div class="emoji-grid">${emojiBtns}</div>
      </div>
      <div>
        <div class="editor-section-label">색상</div>
        <div class="color-grid">${colorSwatches}</div>
      </div>
    </div>`;
}

function updateSeg(key, value) {
  if (state.selected === null) return;
  state.segments[state.selected][key] = value;
  savePlanner();
  renderSVG();
  if (key === 'emoji' || key === 'color') renderEditor();
  else {
    const preview = document.querySelector('.seg-color-preview');
    if (preview) {
      preview.style.background = state.segments[state.selected].color;
      preview.textContent = state.segments[state.selected].emoji;
    }
  }
}

function downloadSVG() {
  const svg = document.getElementById('planner');
  const src = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = '동그라미_일정표.svg';
  a.click();
  URL.revokeObjectURL(url);
}

// ────────────────────────────────────────────────────────────────────────────
// TODO MODULE
// ────────────────────────────────────────────────────────────────────────────
let todos = loadData('haru_todos', []);
let todoFilter = 'all';

function saveTodos() { saveData('haru_todos', todos); }

function addTodo(text, priority) {
  if (!text.trim()) return;
  todos.push({
    id: uid(),
    text: text.trim(),
    priority,
    completed: false,
    createdAt: dateStr(),
    completedAt: null,
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  todo.completedAt = todo.completed ? new Date().toISOString() : null;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  const today = dateStr();
  const todayTodos = todos.filter(t => t.createdAt === today);

  const done = todayTodos.filter(t => t.completed).length;
  const badge = document.getElementById('todoBadge');
  if (badge) badge.textContent = `${done}/${todayTodos.length}`;

  let list = todayTodos;
  if (todoFilter === 'active') list = list.filter(t => !t.completed);
  if (todoFilter === 'done')   list = list.filter(t => t.completed);

  const container = document.getElementById('todoList');
  if (!container) return;

  if (list.length === 0) {
    const msgs = {
      all: ['📝', '오늘 할 일을 추가해보세요!'],
      active: ['🎉', '진행 중인 항목이 없어요'],
      done: ['✨', '완료한 항목이 없어요'],
    };
    const [icon, msg] = msgs[todoFilter];
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon}</div><p>${msg}</p></div>`;
    return;
  }

  const priorityIcon  = { high:'🔴', medium:'🟡', low:'🟢' };

  container.innerHTML = list.map(todo => `
    <div class="todo-item${todo.completed ? ' done' : ''}">
      <button class="todo-check${todo.completed ? ' checked' : ''}" onclick="toggleTodo('${todo.id}')">
        ${todo.completed ? '✓' : ''}
      </button>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <span class="priority-dot" title="${todo.priority}">${priorityIcon[todo.priority]}</span>
      <button class="todo-delete" onclick="deleteTodo('${todo.id}')">✕</button>
    </div>`).join('');
}

// ────────────────────────────────────────────────────────────────────────────
// ROUTINE MODULE
// ────────────────────────────────────────────────────────────────────────────
let routines = loadData('haru_routines', []);
let routineLogs = loadData('haru_routine_logs', []);
let selectedRoutineEmoji = '⭐';
let selectedDays = ['mon','tue','wed','thu','fri'];

function saveRoutines()    { saveData('haru_routines', routines); }
function saveRoutineLogs() { saveData('haru_routine_logs', routineLogs); }

function computeStreak(routineId, targetDays) {
  let streak = 0;
  const today = dateStr();
  const d = new Date();

  for (let i = 0; i < 366; i++) {
    const ds = dateStr(d);
    const dayName = ['sun','mon','tue','wed','thu','fri','sat'][d.getDay()];

    if (targetDays.includes(dayName)) {
      const log = routineLogs.find(l => l.routineId === routineId && l.date === ds);
      if (log && log.completed) {
        streak++;
      } else if (ds !== today) {
        break;
      }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function toggleRoutineLog(routineId) {
  const today = dateStr();
  const existing = routineLogs.find(l => l.routineId === routineId && l.date === today);
  if (existing) {
    existing.completed = !existing.completed;
  } else {
    routineLogs.push({ routineId, date: today, completed: true });
  }

  const routine = routines.find(r => r.id === routineId);
  if (routine) {
    routine.streak = computeStreak(routineId, routine.targetDays);
    saveRoutines();
  }
  saveRoutineLogs();
  renderRoutines();
}

function addRoutine(name, emoji, targetDays) {
  if (!name.trim() || targetDays.length === 0) return;
  routines.push({
    id: uid(),
    name: name.trim(),
    emoji,
    targetDays,
    streak: 0,
    createdAt: dateStr(),
  });
  saveRoutines();
  renderRoutines();
}

function deleteRoutine(id) {
  if (!confirm('이 루틴을 삭제할까요?')) return;
  routines = routines.filter(r => r.id !== id);
  routineLogs = routineLogs.filter(l => l.routineId !== id);
  saveRoutines();
  saveRoutineLogs();
  renderRoutines();
}

function openRoutineSheet() {
  selectedRoutineEmoji = '⭐';
  selectedDays = ['mon','tue','wed','thu','fri'];

  const sheet = document.getElementById('routineSheet');
  sheet.classList.remove('hidden');
  sheet.classList.add('open');

  document.getElementById('routineName').value = '';
  document.getElementById('selectedEmojiPreview').textContent = '⭐';

  // Emoji picker
  const picker = document.getElementById('routineEmojiPicker');
  picker.innerHTML = EMOJIS.map(e =>
    `<button class="emoji-btn${e === selectedRoutineEmoji ? ' active' : ''}"
      onclick="selectRoutineEmoji('${e}')">${e}</button>`
  ).join('');

  // Day toggles
  document.querySelectorAll('#dayToggleGroup .day-btn').forEach(btn => {
    const active = selectedDays.includes(btn.dataset.day);
    btn.classList.toggle('active', active);
  });
}

function closeRoutineSheet() {
  const sheet = document.getElementById('routineSheet');
  sheet.classList.remove('open');
  setTimeout(() => sheet.classList.add('hidden'), 300);
}

function selectRoutineEmoji(emoji) {
  selectedRoutineEmoji = emoji;
  document.getElementById('selectedEmojiPreview').textContent = emoji;
  document.querySelectorAll('#routineEmojiPicker .emoji-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === emoji);
  });
}

function renderRoutines() {
  const today = dateStr();
  const todayDay = todayDayName();

  const todayRoutines = routines.filter(r => r.targetDays.includes(todayDay));
  const todayContainer = document.getElementById('todayRoutineList');
  if (!todayContainer) return;

  if (todayRoutines.length === 0) {
    todayContainer.innerHTML = `<div class="empty-state small"><p>오늘 해당하는 루틴이 없어요</p></div>`;
  } else {
    todayContainer.innerHTML = todayRoutines.map(r => {
      const log = routineLogs.find(l => l.routineId === r.id && l.date === today);
      const done = log && log.completed;
      return `
        <div class="routine-item${done ? ' done' : ''}">
          <button class="routine-check${done ? ' checked' : ''}" onclick="toggleRoutineLog('${r.id}')">
            ${done ? '✓' : ''}
          </button>
          <span class="routine-emoji">${r.emoji}</span>
          <span class="routine-name">${escapeHtml(r.name)}</span>
          ${r.streak > 0 ? `<span class="streak-badge">🔥 ${r.streak}</span>` : ''}
        </div>`;
    }).join('');
  }

  const allContainer = document.getElementById('allRoutineList');
  if (!allContainer) return;

  const DAY_LABELS = { mon:'월', tue:'화', wed:'수', thu:'목', fri:'금', sat:'토', sun:'일' };
  if (routines.length === 0) {
    allContainer.innerHTML = `<div class="empty-state small"><p>+ 추가 버튼으로 루틴을 만들어보세요!</p></div>`;
  } else {
    allContainer.innerHTML = routines.map(r => `
      <div class="routine-full-item">
        <span class="routine-emoji">${r.emoji}</span>
        <div class="routine-info">
          <div class="routine-name">${escapeHtml(r.name)}</div>
          <div class="routine-days">${r.targetDays.map(d => DAY_LABELS[d]).join('·')}</div>
        </div>
        ${r.streak > 0 ? `<span class="streak-badge">🔥 ${r.streak}</span>` : ''}
        <button class="routine-delete" onclick="deleteRoutine('${r.id}')">🗑</button>
      </div>`).join('');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// REPORT MODULE
// ────────────────────────────────────────────────────────────────────────────
function renderReport() {
  const today = dateStr();
  const todayDay = todayDayName();

  // Summary
  const todayTodos = todos.filter(t => t.createdAt === today);
  const doneTodos = todayTodos.filter(t => t.completed).length;
  const todayRoutines = routines.filter(r => r.targetDays.includes(todayDay));
  const doneRoutines = todayRoutines.filter(r => {
    const log = routineLogs.find(l => l.routineId === r.id && l.date === today);
    return log && log.completed;
  }).length;

  const todoRateEl = document.getElementById('reportTodoRate');
  const routineRateEl = document.getElementById('reportRoutineRate');
  const reportDateEl = document.getElementById('reportDate');

  if (reportDateEl) reportDateEl.textContent = formatKoreanDate();
  if (todoRateEl) {
    todoRateEl.textContent = todayTodos.length > 0
      ? `${Math.round(doneTodos / todayTodos.length * 100)}%`
      : '항목 없음';
    todoRateEl.dataset.sub = todayTodos.length > 0 ? `${doneTodos}/${todayTodos.length}` : '';
  }
  if (routineRateEl) {
    routineRateEl.textContent = todayRoutines.length > 0
      ? `${Math.round(doneRoutines / todayRoutines.length * 100)}%`
      : '루틴 없음';
    routineRateEl.dataset.sub = todayRoutines.length > 0 ? `${doneRoutines}/${todayRoutines.length}` : '';
  }

  renderWeeklyChart();
  renderHeatmap();
  renderStreakList();
}

function renderWeeklyChart() {
  const chartEl = document.getElementById('weeklyChart');
  if (!chartEl) return;

  const DAY_LABELS = ['일','월','화','수','목','금','토'];
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = dateStr(d);
    const dayTodos = todos.filter(t => t.createdAt === ds);
    const done = dayTodos.filter(t => t.completed).length;
    const rate = dayTodos.length > 0 ? done / dayTodos.length : 0;
    days.push({ label: DAY_LABELS[d.getDay()], rate, count: dayTodos.length, isToday: i === 0 });
  }

  const W = 300;
  const H = 140;
  const padL = 10, padR = 10, padT = 24, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const barW = Math.floor(innerW / 7) - 6;

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">`;

  // Gridline at 50%
  const gridY = padT + innerH * 0.5;
  svg += `<line x1="${padL}" y1="${gridY}" x2="${W - padR}" y2="${gridY}" stroke="#F0D9E8" stroke-width="1" stroke-dasharray="3,3"/>`;

  days.forEach((day, i) => {
    const x = padL + i * (innerW / 7) + 3;
    const barH = Math.max(day.rate > 0 ? 4 : 0, Math.round(day.rate * innerH));
    const barY = padT + innerH - barH;
    const fill = day.isToday ? '#FF7EB3' : '#D5B8FF';

    svg += `<rect x="${x}" y="${barY}" width="${barW}" height="${barH}" rx="4" fill="${fill}"/>`;
    svg += `<text x="${x + barW / 2}" y="${H - padB + 14}" text-anchor="middle" font-size="10" fill="#9B7A8D" font-family="sans-serif">${day.label}</text>`;

    if (day.rate > 0) {
      svg += `<text x="${x + barW / 2}" y="${barY - 4}" text-anchor="middle" font-size="9" fill="#D63384" font-family="sans-serif">${Math.round(day.rate * 100)}%</text>`;
    } else if (day.count === 0) {
      svg += `<text x="${x + barW / 2}" y="${padT + innerH - 4}" text-anchor="middle" font-size="8" fill="#F0D9E8" font-family="sans-serif">-</text>`;
    }
  });

  svg += '</svg>';
  chartEl.outerHTML = svg.replace('<svg', `<svg id="weeklyChart" class="weekly-chart"`);
}

function renderHeatmap() {
  const container = document.getElementById('heatmapGrid');
  if (!container) return;

  const DAY_LABELS = ['일','월','화','수','목','금','토'];
  const today = new Date();
  const cells = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = dateStr(d);
    const dayName = ['sun','mon','tue','wed','thu','fri','sat'][d.getDay()];
    const dayRoutines = routines.filter(r => r.targetDays.includes(dayName));
    const done = dayRoutines.filter(r => {
      const log = routineLogs.find(l => l.routineId === r.id && l.date === ds);
      return log && log.completed;
    }).length;
    const rate = dayRoutines.length > 0 ? done / dayRoutines.length : -1;
    cells.push({ label: DAY_LABELS[d.getDay()], rate, done, total: dayRoutines.length, isToday: i === 0 });
  }

  container.innerHTML = cells.map(cell => {
    let intensity = 0;
    if (cell.rate >= 1)        intensity = 4;
    else if (cell.rate >= 0.75) intensity = 3;
    else if (cell.rate >= 0.5)  intensity = 2;
    else if (cell.rate > 0)     intensity = 1;

    const noRoutine = cell.rate === -1;
    const title = noRoutine ? '루틴 없음' : `${cell.done}/${cell.total} 완료`;
    return `<div class="heatmap-cell intensity-${noRoutine ? 'none' : intensity}${cell.isToday ? ' today' : ''}" title="${title}">
      <span class="heatmap-label">${cell.label}</span>
    </div>`;
  }).join('');
}

function renderStreakList() {
  const container = document.getElementById('streakList');
  if (!container) return;

  if (routines.length === 0) {
    container.innerHTML = `<div class="empty-state small"><p>루틴을 추가하면 스트릭이 나타나요</p></div>`;
    return;
  }

  const sorted = [...routines].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  container.innerHTML = sorted.map((r, i) => `
    <div class="streak-item">
      <span class="streak-rank">${i + 1}</span>
      <span class="routine-emoji">${r.emoji}</span>
      <span class="streak-name">${escapeHtml(r.name)}</span>
      <span class="streak-count">${r.streak > 0 ? `🔥 ${r.streak}일` : '—'}</span>
    </div>`).join('');
}

// ────────────────────────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────────────────────────
function init() {
  // Planner init
  if (!state.segments.length) state.segments = buildSegments(state.count, state.theme);

  // Sync inputs with saved state
  document.getElementById('inputTitle').value = state.title;
  document.getElementById('inputDate').value  = state.date;
  document.getElementById('inputName').value  = state.name;
  document.querySelector(`.seg-btn[data-count="${state.count}"]`)?.classList.add('active');
  document.querySelector(`.theme-btn[data-theme="${state.theme}"]`)?.classList.add('active');
  document.querySelectorAll('.seg-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.count) === state.count));
  document.querySelectorAll('.theme-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.theme === state.theme));

  renderSVG();
  renderEditor();

  // Planner input events
  ['inputTitle','inputDate','inputName'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => {
      const key = id === 'inputTitle' ? 'title' : id === 'inputDate' ? 'date' : 'name';
      state[key] = e.target.value;
      savePlanner();
      renderSVG();
    });
  });

  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.dataset.count);
      if (count === state.count) return;
      state.count    = count;
      state.selected = null;
      state.segments = buildSegments(count, state.theme);
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      savePlanner();
      renderSVG();
      renderEditor();
    });
  });

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      if (theme === state.theme) return;
      state.theme = theme;
      const palette = PALETTES[theme];
      state.segments.forEach((seg, i) => { seg.color = palette[i % palette.length]; });
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      savePlanner();
      renderSVG();
      if (state.selected !== null) renderEditor();
    });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('처음 상태로 초기화할까요?')) return;
    state.title    = '나의 방학 일정표';
    state.date     = '2025년 여름방학';
    state.name     = '';
    state.count    = 12;
    state.theme    = 'pastel';
    state.selected = null;
    state.segments = buildSegments(12, 'pastel');
    document.getElementById('inputTitle').value = state.title;
    document.getElementById('inputDate').value  = state.date;
    document.getElementById('inputName').value  = '';
    document.querySelectorAll('.seg-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.count === '12'));
    document.querySelectorAll('.theme-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.theme === 'pastel'));
    savePlanner();
    renderSVG();
    renderEditor();
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
  document.getElementById('downloadBtn').addEventListener('click', downloadSVG);

  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Todo: date display
  const todayDateEl = document.getElementById('todayDate');
  if (todayDateEl) todayDateEl.textContent = formatKoreanDate();

  // Todo: add button
  document.getElementById('todoAddBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('todoPriority').value;
    addTodo(input.value, priority);
    input.value = '';
    input.focus();
  });

  document.getElementById('todoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('todoAddBtn').click();
  });

  // Todo: filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      todoFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTodos();
    });
  });

  // Routine: add button
  document.getElementById('addRoutineBtn').addEventListener('click', openRoutineSheet);

  document.getElementById('routineCancelBtn').addEventListener('click', closeRoutineSheet);
  document.getElementById('sheetBackdrop').addEventListener('click', closeRoutineSheet);

  document.getElementById('routineSaveBtn').addEventListener('click', () => {
    const name = document.getElementById('routineName').value;
    if (!name.trim()) {
      document.getElementById('routineName').focus();
      return;
    }
    if (selectedDays.length === 0) {
      alert('반복 요일을 하나 이상 선택해주세요.');
      return;
    }
    addRoutine(name, selectedRoutineEmoji, [...selectedDays]);
    closeRoutineSheet();
  });

  document.querySelectorAll('#dayToggleGroup .day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
      } else {
        selectedDays.push(day);
      }
      btn.classList.toggle('active', selectedDays.includes(day));
    });
  });

  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
