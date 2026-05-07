// ── Utilities ────────────────────────────────────────────────────────────────
function dateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function todayDayName() {
  return ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
}

function uid() {
  return Math.random().toString(36).slice(2,9) + Date.now().toString(36);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function formatKorDate(d = new Date()) {
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getMonth()+1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}

function loadData(key, fb) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
}

function saveData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Tab navigation ────────────────────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${id}"]`).classList.add('active');
  if (id === 'today')   { renderTimeline(); scrollToNow(); }
  if (id === 'todo')    renderTodos();
  if (id === 'routine') renderRoutines();
  if (id === 'stats')   renderStats();
}

// ────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ────────────────────────────────────────────────────────────────────────────
const PX_PER_MIN = 1.2;   // timeline density: px per minute
const MIN_BLOCK_H = 30;   // minimum block height px

const BLOCK_COLORS = [
  { bg: '#FCE4EC', border: '#E91E8C', name: '로즈' },
  { bg: '#FFF3E0', border: '#FF9800', name: '피치' },
  { bg: '#FFFDE7', border: '#FFC107', name: '버터' },
  { bg: '#E8F5E9', border: '#4CAF50', name: '세이지' },
  { bg: '#E3F2FD', border: '#2196F3', name: '스카이' },
  { bg: '#F3E5F5', border: '#9C27B0', name: '라벤더' },
  { bg: '#ECEFF1', border: '#607D8B', name: '슬레이트' },
  { bg: '#EFEBE9', border: '#795548', name: '모카' },
];

let timeBlocks  = loadData('haru_blocks', []);
let editingBlockId = null;
let selectedBlockColor = BLOCK_COLORS[0];
let editingBlockTodos = [];
let snapMin = 10;
let pointerDrag = null;
let quickBlockId = null;
let blockClickTimer = null;

function saveBlocks() { saveData('haru_blocks', timeBlocks); }

function randomBlockColor() {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
}

function snapToGrid(minutes) {
  return Math.round(minutes / snapMin) * snapMin;
}

function yToMinutes(clientY) {
  const inner = document.getElementById('tlInner');
  const rect  = inner.getBoundingClientRect();
  // getBoundingClientRect already accounts for scroll, no scrollTop needed
  return Math.max(0, Math.min(1439, Math.floor((clientY - rect.top) / PX_PER_MIN)));
}

function updatePreviewEl(el, startMin, endMin) {
  const sh = Math.floor(startMin / 60), sm = startMin % 60;
  const eh = Math.floor(endMin   / 60) % 24, em = endMin % 60;
  el.style.top    = `${startMin * PX_PER_MIN}px`;
  el.style.height = `${Math.max((endMin - startMin) * PX_PER_MIN, MIN_BLOCK_H)}px`;
  el.textContent  = `${fmtTime(sh, sm)} – ${fmtTime(eh, em)}`;
}

function handlePointerDown(e) {
  if (e.target.closest('.tl-block')) return;
  e.preventDefault();

  const startMin = snapToGrid(yToMinutes(e.clientY));
  const endMin   = startMin + snapMin;

  const preview = document.createElement('div');
  preview.className = 'tl-block-preview';
  updatePreviewEl(preview, startMin, endMin);
  document.getElementById('tlInner').appendChild(preview);

  pointerDrag = { startMin, endMin, preview, moved: false };
  document.getElementById('tlInner').setPointerCapture(e.pointerId);
}

function handlePointerMove(e) {
  if (!pointerDrag) return;
  const rawMin    = yToMinutes(e.clientY);
  const snapped   = snapToGrid(rawMin);
  const endMin    = Math.max(pointerDrag.startMin + snapMin, snapped);
  pointerDrag.endMin  = endMin;
  pointerDrag.moved   = (endMin - pointerDrag.startMin) >= snapMin * 2;
  updatePreviewEl(pointerDrag.preview, pointerDrag.startMin, endMin);
}

function handlePointerUp(e) {
  if (!pointerDrag) return;
  const { startMin, endMin, preview } = pointerDrag;
  preview.remove();
  pointerDrag = null;

  const durationM = Math.max(snapMin, endMin - startMin);
  const color = randomBlockColor();
  const id = uid();
  timeBlocks.push({
    id, date: dateStr(),
    label: '',
    startH: Math.floor(startMin / 60),
    startM: startMin % 60,
    durationM, color, todos: [],
  });
  saveBlocks();
  renderTimeline();
  showQuickPopup(id);
}

// ── Quick popup ──────────────────────────────────────────────────────────────
function showQuickPopup(blockId) {
  const block = timeBlocks.find(b => b.id === blockId);
  if (!block) return;

  const end = blockEndTime(block);
  document.getElementById('qpTime').textContent =
    `${fmtTime(block.startH, block.startM)} – ${fmtTime(end.h, end.m)}`;
  document.getElementById('qpColorDot').style.background = block.color.border;
  document.getElementById('qpInput').value = block.label || '';

  // Position near the block in the viewport
  const inner  = document.getElementById('tlInner');
  const scroll = document.getElementById('tlScroll');
  const iRect  = inner.getBoundingClientRect();
  const blockTopPx = (block.startH * 60 + block.startM) * PX_PER_MIN;
  const blockMidVh = iRect.top + blockTopPx + (block.durationM * PX_PER_MIN) / 2;
  const clampedTop = Math.max(80, Math.min(window.innerHeight - 140, blockMidVh - 50));

  const popup = document.getElementById('quickPopup');
  popup.style.top = clampedTop + 'px';
  quickBlockId = blockId;
  popup.classList.remove('hidden');
  requestAnimationFrame(() => {
    popup.classList.add('visible');
    document.getElementById('qpInput').focus();
  });
}

function saveQuickPopup() {
  if (!quickBlockId) return;
  const block = timeBlocks.find(b => b.id === quickBlockId);
  const name = document.getElementById('qpInput').value.trim();
  if (block) {
    block.label = name || '새 블록';
    saveBlocks();
  }
  closeQuickPopup(false);
  renderTimeline();
}

function closeQuickPopup(deleteIfEmpty = true) {
  const popup = document.getElementById('quickPopup');
  popup.classList.remove('visible');
  setTimeout(() => popup.classList.add('hidden'), 200);

  if (deleteIfEmpty && quickBlockId) {
    const block = timeBlocks.find(b => b.id === quickBlockId);
    if (block && !block.label) {
      timeBlocks = timeBlocks.filter(b => b.id !== quickBlockId);
      saveBlocks();
      renderTimeline();
    }
  }
  quickBlockId = null;
}

// ── Block click / dblclick ───────────────────────────────────────────────────
function handleBlockClick(id) {
  clearTimeout(blockClickTimer);
  blockClickTimer = setTimeout(() => showQuickPopup(id), 220);
}

function handleBlockDblClick(id) {
  clearTimeout(blockClickTimer);
  openEditBlock(id);
}

function blockEndTime(b) {
  const totalMin = b.startH * 60 + b.startM + b.durationM;
  return { h: Math.floor(totalMin / 60) % 24, m: totalMin % 60 };
}

function fmtTime(h, m) {
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function renderTimeline() {
  const today = dateStr();
  const inner = document.getElementById('tlInner');
  if (!inner) return;

  const totalH = 24;
  const totalPx = totalH * 60 * PX_PER_MIN;
  inner.style.height = totalPx + 'px';

  let html = '';

  // Hour lines + labels
  for (let h = 0; h < 24; h++) {
    const top = h * 60 * PX_PER_MIN;
    const topHalf = top + 30 * PX_PER_MIN;
    html += `<div class="tl-hour-line" style="top:${top}px"></div>`;
    html += `<div class="tl-half-line" style="top:${topHalf}px"></div>`;
    html += `<div class="tl-hour-label" style="top:${top}px">${String(h).padStart(2,'0')}</div>`;
  }
  // Bottom line
  html += `<div class="tl-hour-line" style="top:${totalPx}px"></div>`;

  // Blocks for today
  const todayBlocks = timeBlocks.filter(b => b.date === today);
  todayBlocks.forEach(b => {
    const topPx = (b.startH * 60 + b.startM) * PX_PER_MIN;
    const heightPx = Math.max(b.durationM * PX_PER_MIN, MIN_BLOCK_H);
    const end = blockEndTime(b);
    const timeRange = `${fmtTime(b.startH, b.startM)} – ${fmtTime(end.h, end.m)}`;

    const doneTodos = (b.todos || []).filter(t => t.done).length;
    const totalTodos = (b.todos || []).length;
    const showProgress = totalTodos > 0;

    const todoItems = (b.todos || []).map(t => `
      <div class="tl-block-todo${t.done ? ' done' : ''}" onclick="toggleBlockTodo(event,'${b.id}','${t.id}')">
        <span class="tl-check">${t.done ? '✓' : ''}</span>
        <span>${escapeHtml(t.text)}</span>
      </div>`).join('');

    html += `
      <div class="tl-block" style="top:${topPx}px;height:${heightPx}px;background:${b.color.bg};border-left-color:${b.color.border}"
           data-id="${b.id}"
           onclick="handleBlockClick('${b.id}')"
           ondblclick="handleBlockDblClick('${b.id}')"
      >
        <div class="tl-block-content">
          <div class="tl-block-row">
            <span class="tl-block-label">${escapeHtml(b.label)}</span>
            <span class="tl-block-time">${timeRange}</span>
          </div>
          ${showProgress ? `<div class="tl-block-progress">${doneTodos}/${totalTodos}</div>` : ''}
          ${todoItems ? `<div class="tl-block-todos">${todoItems}</div>` : ''}
        </div>
      </div>`;
  });

  // Current time line
  const now = new Date();
  const nowPx = (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN;
  html += `<div class="tl-now-line" id="tlNowLine" style="top:${nowPx}px">
    <div class="tl-now-dot"></div>
  </div>`;

  // Click to add: invisible tap target over empty space (handled at container level)
  inner.innerHTML = html;
}

function scrollToNow() {
  const scroll = document.getElementById('tlScroll');
  if (!scroll) return;
  const now = new Date();
  const nowPx = (now.getHours() * 60 + now.getMinutes()) * PX_PER_MIN;
  scroll.scrollTop = Math.max(0, nowPx - 180);
}

function toggleBlockTodo(e, blockId, todoId) {
  e.stopPropagation();
  const block = timeBlocks.find(b => b.id === blockId);
  if (!block) return;
  const todo = block.todos.find(t => t.id === todoId);
  if (todo) todo.done = !todo.done;
  saveBlocks();
  renderTimeline();
}

// ── Block sheet ──────────────────────────────────────────────────────────────
function openAddBlock(startH, startM, durationM = 60) {
  editingBlockId = null;
  editingBlockTodos = [];
  selectedBlockColor = BLOCK_COLORS[0];

  document.getElementById('blockSheetTitle').textContent = '블록 추가';
  document.getElementById('deleteBlockBtn').classList.add('hidden');
  document.getElementById('blockLabel').value = '';
  document.getElementById('blockStartH').value = String(startH).padStart(2,'0');
  document.getElementById('blockStartM').value = String(startM).padStart(2,'0');
  document.getElementById('blockDuration').value = String(durationM);
  document.getElementById('blockTodoInput').value = '';
  // Highlight matching duration preset if any
  document.querySelectorAll('.dur-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.min) === durationM);
  });

  renderBlockColorPicker();
  renderBlockTodoList();
  openSheet('blockSheet');
}

function openEditBlock(id) {
  const block = timeBlocks.find(b => b.id === id);
  if (!block) return;

  editingBlockId = id;
  editingBlockTodos = (block.todos || []).map(t => ({ ...t }));
  selectedBlockColor = block.color;

  document.getElementById('blockSheetTitle').textContent = '블록 수정';
  document.getElementById('deleteBlockBtn').classList.remove('hidden');
  document.getElementById('blockLabel').value = block.label;
  document.getElementById('blockStartH').value = String(block.startH).padStart(2,'0');
  document.getElementById('blockStartM').value = String(block.startM).padStart(2,'0');
  document.getElementById('blockDuration').value = String(block.durationM);
  document.getElementById('blockTodoInput').value = '';

  renderBlockColorPicker();
  renderBlockTodoList();
  openSheet('blockSheet');
}

function renderBlockColorPicker() {
  const picker = document.getElementById('blockColorPicker');
  picker.innerHTML = BLOCK_COLORS.map((c, i) =>
    `<button class="color-dot${selectedBlockColor.bg === c.bg ? ' active' : ''}"
      style="background:${c.bg};border-color:${c.border}"
      onclick="selectBlockColor(${i})" title="${c.name}"></button>`
  ).join('');
}

function selectBlockColor(idx) {
  selectedBlockColor = BLOCK_COLORS[idx];
  renderBlockColorPicker();
}

function renderBlockTodoList() {
  const list = document.getElementById('blockTodoList');
  if (editingBlockTodos.length === 0) {
    list.innerHTML = '';
    return;
  }
  list.innerHTML = editingBlockTodos.map(t => `
    <div class="block-todo-item${t.done ? ' done' : ''}">
      <span class="tl-check small">${t.done ? '✓' : ''}</span>
      <span class="block-todo-text">${escapeHtml(t.text)}</span>
      <button class="btn-icon-xs" onclick="removeEditingTodo('${t.id}')">×</button>
    </div>`).join('');
}

function removeEditingTodo(id) {
  editingBlockTodos = editingBlockTodos.filter(t => t.id !== id);
  renderBlockTodoList();
}

function addEditingTodo() {
  const input = document.getElementById('blockTodoInput');
  const text = input.value.trim();
  if (!text) return;
  editingBlockTodos.push({ id: uid(), text, done: false });
  input.value = '';
  renderBlockTodoList();
}

function saveBlock() {
  const label    = document.getElementById('blockLabel').value.trim();
  const startH   = parseInt(document.getElementById('blockStartH').value) || 0;
  const startM   = parseInt(document.getElementById('blockStartM').value) || 0;
  const durationM = Math.max(5, parseInt(document.getElementById('blockDuration').value) || 60);

  if (!label) { document.getElementById('blockLabel').focus(); return; }

  const today = dateStr();
  if (editingBlockId) {
    const block = timeBlocks.find(b => b.id === editingBlockId);
    if (block) {
      block.label = label; block.startH = startH; block.startM = startM;
      block.durationM = durationM; block.color = selectedBlockColor;
      block.todos = editingBlockTodos;
    }
  } else {
    timeBlocks.push({
      id: uid(), date: today, label, startH, startM,
      durationM, color: selectedBlockColor, todos: editingBlockTodos,
    });
  }

  saveBlocks();
  closeSheet('blockSheet');
  renderTimeline();
}

function deleteBlock() {
  if (!editingBlockId) return;
  if (!confirm('이 블록을 삭제할까요?')) return;
  timeBlocks = timeBlocks.filter(b => b.id !== editingBlockId);
  saveBlocks();
  closeSheet('blockSheet');
  renderTimeline();
}

// ────────────────────────────────────────────────────────────────────────────
// TODO MODULE
// ────────────────────────────────────────────────────────────────────────────
let todos = loadData('haru_todos', []);
let todoFilter = 'all';
let selectedPriority = 'medium';

function saveTodos() { saveData('haru_todos', todos); }

function addTodo(text) {
  if (!text.trim()) return;
  todos.push({ id: uid(), text: text.trim(), priority: selectedPriority,
    completed: false, createdAt: dateStr(), completedAt: null });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const t = todos.find(t => t.id === id);
  if (!t) return;
  t.completed = !t.completed;
  t.completedAt = t.completed ? new Date().toISOString() : null;
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
    const msgs = { all:'오늘 할 일을 추가해보세요', active:'진행 중인 항목 없음', done:'완료한 항목 없음' };
    container.innerHTML = `<div class="empty-msg">${msgs[todoFilter]}</div>`;
    return;
  }

  container.innerHTML = list.map(t => `
    <div class="todo-row${t.completed ? ' done' : ''}" data-priority="${t.priority}">
      <button class="todo-check${t.completed ? ' checked' : ''}" onclick="toggleTodo('${t.id}')">
        ${t.completed ? '✓' : ''}
      </button>
      <span class="todo-text">${escapeHtml(t.text)}</span>
      <button class="btn-icon-xs del" onclick="deleteTodo('${t.id}')">×</button>
    </div>`).join('');
}

// ────────────────────────────────────────────────────────────────────────────
// ROUTINE MODULE
// ────────────────────────────────────────────────────────────────────────────
let routines = loadData('haru_routines', []);
let routineLogs = loadData('haru_routine_logs', []);
let selectedDays = ['mon','tue','wed','thu','fri'];

function saveRoutines()    { saveData('haru_routines', routines); }
function saveRoutineLogs() { saveData('haru_routine_logs', routineLogs); }

function computeStreak(routineId, targetDays) {
  let streak = 0;
  const today = dateStr();
  const d = new Date();
  for (let i = 0; i < 366; i++) {
    const ds = dateStr(d);
    const day = ['sun','mon','tue','wed','thu','fri','sat'][d.getDay()];
    if (targetDays.includes(day)) {
      const log = routineLogs.find(l => l.routineId === routineId && l.date === ds);
      if (log && log.completed) { streak++; }
      else if (ds !== today) { break; }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function toggleRoutineLog(id) {
  const today = dateStr();
  const ex = routineLogs.find(l => l.routineId === id && l.date === today);
  if (ex) ex.completed = !ex.completed;
  else routineLogs.push({ routineId: id, date: today, completed: true });
  const r = routines.find(r => r.id === id);
  if (r) { r.streak = computeStreak(id, r.targetDays); saveRoutines(); }
  saveRoutineLogs();
  renderRoutines();
}

function addRoutine(name, days) {
  if (!name.trim() || !days.length) return;
  routines.push({ id: uid(), name: name.trim(), targetDays: days, streak: 0, createdAt: dateStr() });
  saveRoutines();
  renderRoutines();
}

function deleteRoutine(id) {
  if (!confirm('삭제할까요?')) return;
  routines = routines.filter(r => r.id !== id);
  routineLogs = routineLogs.filter(l => l.routineId !== id);
  saveRoutines(); saveRoutineLogs();
  renderRoutines();
}

function renderRoutines() {
  const today = dateStr();
  const todayDay = todayDayName();
  const DAY = { mon:'월', tue:'화', wed:'수', thu:'목', fri:'금', sat:'토', sun:'일' };

  // Today's routines
  const todayR = routines.filter(r => r.targetDays.includes(todayDay));
  const todayCont = document.getElementById('todayRoutineList');
  if (!todayCont) return;

  todayCont.innerHTML = todayR.length === 0
    ? `<div class="empty-msg">오늘 해당하는 루틴이 없어요</div>`
    : todayR.map(r => {
        const log = routineLogs.find(l => l.routineId === r.id && l.date === today);
        const done = log && log.completed;
        return `<div class="routine-row${done ? ' done' : ''}">
          <button class="routine-check${done ? ' checked' : ''}" onclick="toggleRoutineLog('${r.id}')">
            ${done ? '✓' : ''}
          </button>
          <span class="routine-name">${escapeHtml(r.name)}</span>
          ${r.streak > 1 ? `<span class="streak-num">${r.streak}일</span>` : ''}
        </div>`;
      }).join('');

  // All routines
  const allCont = document.getElementById('allRoutineList');
  allCont.innerHTML = routines.length === 0
    ? `<div class="empty-msg">+ 추가로 루틴을 만들어보세요</div>`
    : routines.map(r => `
        <div class="routine-full-row">
          <div class="routine-full-info">
            <span class="routine-name">${escapeHtml(r.name)}</span>
            <span class="routine-days-label">${r.targetDays.map(d => DAY[d]).join('·')}</span>
          </div>
          ${r.streak > 0 ? `<span class="streak-num">${r.streak}일 연속</span>` : ''}
          <button class="btn-icon-xs del" onclick="deleteRoutine('${r.id}')">×</button>
        </div>`).join('');
}

// ────────────────────────────────────────────────────────────────────────────
// STATS MODULE
// ────────────────────────────────────────────────────────────────────────────
function renderStats() {
  const today = dateStr();
  const todayDay = todayDayName();

  const todayTodos = todos.filter(t => t.createdAt === today);
  const doneTodos  = todayTodos.filter(t => t.completed).length;
  const todayRs    = routines.filter(r => r.targetDays.includes(todayDay));
  const doneRs     = todayRs.filter(r => {
    const log = routineLogs.find(l => l.routineId === r.id && l.date === today);
    return log && log.completed;
  }).length;

  const el = (id) => document.getElementById(id);
  const lbl = document.getElementById('statsDateLabel');
  if (lbl) lbl.textContent = formatKorDate();

  if (el('statTodo'))    el('statTodo').textContent    = todayTodos.length ? `${doneTodos}/${todayTodos.length}` : '—';
  if (el('statRoutine')) el('statRoutine').textContent = todayRs.length    ? `${doneRs}/${todayRs.length}`      : '—';

  renderWeekChart();
  renderStreakList();
}

function renderWeekChart() {
  const wrap = document.getElementById('weekChart');
  if (!wrap) return;

  const DAY_LABELS = ['일','월','화','수','목','금','토'];
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const ds = dateStr(d);
    const dayTodos = todos.filter(t => t.createdAt === ds);
    const done = dayTodos.filter(t => t.completed).length;
    const rate = dayTodos.length > 0 ? done / dayTodos.length : -1;
    days.push({ label: DAY_LABELS[d.getDay()], rate, isToday: i === 0 });
  }

  const W = 280, H = 120, padB = 24, padT = 16, barAreaH = H - padB - padT;
  const barW = Math.floor((W - 16) / 7) - 4;

  let bars = '';
  days.forEach((d, i) => {
    const x = 8 + i * ((W - 16) / 7);
    const hasData = d.rate >= 0;
    const barH = hasData ? Math.max(d.rate > 0 ? 4 : 2, Math.round(d.rate * barAreaH)) : 2;
    const barY = padT + barAreaH - barH;
    const fill = d.isToday ? '#E91E8C' : (hasData ? '#F8BBD0' : '#F0F0F0');

    bars += `<rect x="${x}" y="${barY}" width="${barW}" height="${barH}" rx="3" fill="${fill}"/>`;
    bars += `<text x="${x + barW/2}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#9E9E9E" font-family="system-ui,sans-serif">${d.label}</text>`;
    if (hasData && d.rate > 0) {
      bars += `<text x="${x + barW/2}" y="${barY - 4}" text-anchor="middle" font-size="9" fill="#E91E8C" font-family="system-ui,sans-serif">${Math.round(d.rate*100)}%</text>`;
    }
  });

  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
}

function renderStreakList() {
  const cont = document.getElementById('streakList');
  if (!cont) return;
  if (!routines.length) {
    cont.innerHTML = `<div class="empty-msg">루틴을 추가하면 연속 기록이 나타나요</div>`;
    return;
  }
  const sorted = [...routines].sort((a,b) => (b.streak||0) - (a.streak||0));
  cont.innerHTML = sorted.map((r, i) => `
    <div class="streak-row">
      <span class="streak-rank">${i+1}</span>
      <span class="streak-name">${escapeHtml(r.name)}</span>
      <span class="streak-val">${r.streak > 0 ? `${r.streak}일` : '—'}</span>
    </div>`).join('');
}

// ────────────────────────────────────────────────────────────────────────────
// SHEET HELPERS
// ────────────────────────────────────────────────────────────────────────────
function openSheet(id) {
  const s = document.getElementById(id);
  s.classList.remove('hidden');
  requestAnimationFrame(() => s.classList.add('open'));
}

function closeSheet(id) {
  const s = document.getElementById(id);
  s.classList.remove('open');
  setTimeout(() => s.classList.add('hidden'), 280);
}

// ────────────────────────────────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────────────────────────────────
function init() {
  // Date labels
  const d = formatKorDate();
  ['tlDate','todayDateLabel','statsDateLabel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = d;
  });

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  // ── Timeline ──
  renderTimeline();
  scrollToNow();

  // Drag / tap on timeline to create block
  const tlInner = document.getElementById('tlInner');
  tlInner.addEventListener('pointerdown', handlePointerDown);
  tlInner.addEventListener('pointermove', handlePointerMove);
  tlInner.addEventListener('pointerup',   handlePointerUp);
  tlInner.addEventListener('pointercancel', () => {
    if (pointerDrag) { pointerDrag.preview.remove(); pointerDrag = null; }
  });

  // Snap selector
  document.getElementById('snapSelect').addEventListener('change', e => {
    snapMin = parseInt(e.target.value);
  });

  document.getElementById('addBlockBtn').addEventListener('click', () => {
    const now = new Date();
    openAddBlock(now.getHours(), Math.floor(now.getMinutes() / 15) * 15);
  });

  // Quick popup
  document.getElementById('qpSave').addEventListener('click', saveQuickPopup);
  document.getElementById('qpCancel').addEventListener('click', () => closeQuickPopup(true));
  document.getElementById('qpDetail').addEventListener('click', () => {
    const id = quickBlockId;
    closeQuickPopup(false);
    if (id) openEditBlock(id);
  });
  document.getElementById('qpInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') saveQuickPopup();
    if (e.key === 'Escape') closeQuickPopup(true);
  });
  // Click outside quick popup to cancel
  document.addEventListener('pointerdown', e => {
    if (quickBlockId && !e.target.closest('#quickPopup')) closeQuickPopup(true);
  });

  document.getElementById('blockSaveBtn').addEventListener('click', saveBlock);
  document.getElementById('deleteBlockBtn').addEventListener('click', deleteBlock);
  document.getElementById('blockCancelBtn').addEventListener('click', () => closeSheet('blockSheet'));
  document.getElementById('blockBackdrop').addEventListener('click', () => closeSheet('blockSheet'));

  document.getElementById('blockTodoAddBtn').addEventListener('click', addEditingTodo);
  document.getElementById('blockTodoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addEditingTodo();
  });

  document.querySelectorAll('.dur-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('blockDuration').value = btn.dataset.min;
      document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ── Todo ──
  renderTodos();

  document.getElementById('todoAddBtn').addEventListener('click', () => {
    const input = document.getElementById('todoInput');
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  document.getElementById('todoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('todoAddBtn').click();
  });

  document.querySelectorAll('.pri-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPriority = btn.dataset.p;
      document.querySelectorAll('.pri-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      todoFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTodos();
    });
  });

  // ── Routine ──
  renderRoutines();

  document.getElementById('addRoutineBtn').addEventListener('click', () => {
    selectedDays = ['mon','tue','wed','thu','fri'];
    document.getElementById('routineName').value = '';
    document.querySelectorAll('#dayToggleGroup .day-btn').forEach(b =>
      b.classList.toggle('active', selectedDays.includes(b.dataset.day)));
    openSheet('routineSheet');
  });

  document.getElementById('routineSaveBtn').addEventListener('click', () => {
    addRoutine(document.getElementById('routineName').value, [...selectedDays]);
    closeSheet('routineSheet');
  });

  document.getElementById('routineCancelBtn').addEventListener('click', () => closeSheet('routineSheet'));
  document.getElementById('routineBackdrop').addEventListener('click', () => closeSheet('routineSheet'));

  document.querySelectorAll('#dayToggleGroup .day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;
      selectedDays = selectedDays.includes(day)
        ? selectedDays.filter(d => d !== day)
        : [...selectedDays, day];
      btn.classList.toggle('active', selectedDays.includes(day));
    });
  });

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
