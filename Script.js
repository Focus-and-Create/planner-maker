// ── SVG geometry constants ──────────────────────────────────────────────────
const CX = 250, CY = 250;
const CENTER_R  = 72;   // inner title circle
const SEG_INNER = 79;   // segment ring inner edge
const SEG_OUTER = 208;  // segment ring outer edge
const TICK_R    = 211;  // tick marks
const LABEL_R   = 221;  // time labels

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

// ── App state ────────────────────────────────────────────────────────────────
const state = {
  title:    '나의 방학 일정표',
  date:     '2025년 여름방학',
  name:     '',
  count:    12,
  theme:    'pastel',
  segments: [],
  selected: null,
};

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

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── SVG render ───────────────────────────────────────────────────────────────
function renderSVG() {
  const { count, segments, selected, title, date, name } = state;
  const deg = 360 / count;

  // Sizing by count
  const emojiSz  = count <= 6 ? 24 : count <= 8 ? 20 : count <= 12 ? 16 : count <= 16 ? 12 : 9;
  const labelSz  = count <= 8 ? 12 : count <= 12 ? 10.5 : count <= 16 ? 8.5 : 0;
  const showLabel = count <= 16;

  const midR = SEG_INNER + (SEG_OUTER - SEG_INNER) * 0.5;
  const font = "'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif";

  let s = '';

  // Outer ring background
  s += `<circle cx="${CX}" cy="${CY}" r="${LABEL_R + 8}" fill="#f8eef4"/>`;

  // Segments
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

    // Emoji
    const emojiY = showLabel && labelSz > 0 ? ty - emojiSz * 0.44 : ty;
    s += `<text x="${tx}" y="${emojiY}"
      text-anchor="middle" dominant-baseline="middle"
      font-size="${emojiSz}" style="pointer-events:none;user-select:none">${seg.emoji}</text>`;

    // Label
    if (showLabel && labelSz > 0) {
      s += `<text x="${tx}" y="${ty + emojiSz * 0.56 + 1}"
        text-anchor="middle" dominant-baseline="hanging"
        font-size="${labelSz}" font-family="${font}" fill="#2D1A25"
        style="pointer-events:none;user-select:none">${escapeXml(seg.label)}</text>`;
    }

    // Time label on outer ring
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

  // Divider lines between segments
  for (let i = 0; i < count; i++) {
    const [x1, y1] = toXY(SEG_INNER, i * deg);
    const [x2, y2] = toXY(SEG_OUTER, i * deg);
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="1.5"/>`;
  }

  // Center circle background
  s += `<circle cx="${CX}" cy="${CY}" r="${CENTER_R + 5}" fill="white"/>`;
  s += `<circle cx="${CX}" cy="${CY}" r="${CENTER_R}" fill="white" stroke="#F0D9E8" stroke-width="2"/>`;

  // Decorative dots on center border
  for (let i = 0; i < 36; i++) {
    const [dx, dy] = toXY(CENTER_R + 2.5, i * 10);
    s += `<circle cx="${dx}" cy="${dy}" r="1.8" fill="#F0D9E8"/>`;
  }

  // Center text
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

// ── Segment selection ─────────────────────────────────────────────────────────
function selectSeg(idx) {
  state.selected = state.selected === idx ? null : idx;
  renderSVG();
  renderEditor();
}

// ── Editor panel ─────────────────────────────────────────────────────────────
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
  renderSVG();

  // Re-render editor only for emoji/color (label/time use live input)
  if (key === 'emoji' || key === 'color') renderEditor();
  else {
    // Update preview circle
    const preview = document.querySelector('.seg-color-preview');
    if (preview) {
      preview.style.background = state.segments[state.selected].color;
      preview.textContent = state.segments[state.selected].emoji;
    }
  }
}

// ── Download as SVG ──────────────────────────────────────────────────────────
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

// ── Init & event wiring ───────────────────────────────────────────────────────
function init() {
  state.segments = buildSegments(state.count, state.theme);
  renderSVG();
  renderEditor();

  // Header info inputs
  ['inputTitle', 'inputDate', 'inputName'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => {
      const key = id === 'inputTitle' ? 'title' : id === 'inputDate' ? 'date' : 'name';
      state[key] = e.target.value;
      renderSVG();
    });
  });

  // Segment count buttons
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.dataset.count);
      if (count === state.count) return;
      state.count    = count;
      state.selected = null;
      state.segments = buildSegments(count, state.theme);
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSVG();
      renderEditor();
    });
  });

  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      if (theme === state.theme) return;
      state.theme = theme;
      const palette = PALETTES[theme];
      state.segments.forEach((seg, i) => { seg.color = palette[i % palette.length]; });
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSVG();
      if (state.selected !== null) renderEditor();
    });
  });

  // Reset
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

    renderSVG();
    renderEditor();
  });

  // Print
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // Download
  document.getElementById('downloadBtn').addEventListener('click', downloadSVG);
}

document.addEventListener('DOMContentLoaded', init);
