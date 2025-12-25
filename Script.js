const BLOCK_LABELS = {
  schedule: 'Schedule',
  todo: 'To-Do',
  memo: 'Memo',
  goal: 'Goal',
  habit: 'Habit Tracker',
  'time-log': 'Time Log',
  emotion: 'Emotion',
  empty: 'Empty',
};

const BLOCK_ICONS = {
  schedule: 'S',
  todo: 'T',
  memo: 'M',
  goal: 'G',
  habit: 'H',
  'time-log': 'L',
  emotion: 'E',
  empty: '-',
};

const BLOCK_TYPES = Object.keys(BLOCK_LABELS);

// 레이아웃 데이터 클래스
class LayoutData {
  constructor() {
    this.rows = [];
    this.selected = null; // { type: 'row' | 'block', rowId, blockId? }
    this.history = [];
    this.historyIndex = -1;
    this.listeners = [];
    this.init();
  }

  init() {
    this.loadDefaultTemplate();
  }

  loadDefaultTemplate() {
    // Row 1: 날짜 헤더 (10%)
    const headerRow = {
      id: this.generateId(),
      height: 0.08,
      blocks: [
        {
          id: this.generateId(),
          type: 'memo',
          label: 'Date',
          width: 0.6,
          showLabel: false
        },
        {
          id: this.generateId(),
          type: 'emotion',
          label: 'Mood',
          width: 0.4,
          showLabel: false
        }
      ]
    };

    // Row 2: 메인 컨텐츠 (60%)
    const mainRow = {
      id: this.generateId(),
      height: 0.62,
      blocks: [
        {
          id: this.generateId(),
          type: 'schedule',
          label: 'Time Schedule',
          width: 0.5,
          showLabel: false
        },
        {
          id: this.generateId(),
          type: 'todo',
          label: 'To-Do List',
          width: 0.5,
          showLabel: false
        }
      ]
    };

    // Row 3: 목표 & 습관 (20%)
    const goalRow = {
      id: this.generateId(),
      height: 0.2,
      blocks: [
        {
          id: this.generateId(),
          type: 'goal',
          label: 'Daily Goal',
          width: 0.5,
          showLabel: false
        },
        {
          id: this.generateId(),
          type: 'habit',
          label: 'Habit Tracker',
          width: 0.5,
          showLabel: false
        }
      ]
    };

    // Row 4: 메모 (10%)
    const memoRow = {
      id: this.generateId(),
      height: 0.1,
      blocks: [
        {
          id: this.generateId(),
          type: 'memo',
          label: 'Notes',
          width: 1.0,
          showLabel: false
        }
      ]
    };

    this.rows = [headerRow, mainRow, goalRow, memoRow];
    this.selected = { type: 'row', rowId: headerRow.id };
  }

  resetTemplate() {
    this.loadDefaultTemplate();
    this.saveToHistory();
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  addRow() {
    const newRow = {
      id: this.generateId(),
      height: 1,
      blocks: []
    };
    this.rows.push(newRow);
    this.normalizeRowHeights();
    this.selected = { type: 'row', rowId: newRow.id };
    this.saveToHistory();
  }

  deleteRow(rowId) {
    if (this.rows.length <= 1) {
      alert('At least 1 row required!');
      return;
    }
    this.rows = this.rows.filter(r => r.id !== rowId);
    this.normalizeRowHeights();
    this.selected = { type: 'row', rowId: this.rows[0].id };
    this.saveToHistory();
  }

  normalizeRowHeights() {
    const total = this.rows.reduce((sum, r) => sum + r.height, 0);
    if (total > 0) {
      this.rows.forEach(r => r.height = r.height / total);
    } else {
      const h = 1 / this.rows.length;
      this.rows.forEach(r => r.height = h);
    }
  }

  updateRowHeight(rowId, newHeight, nextRowId = null) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;
    
    // nextRowId가 있으면 두 row 사이에서만 조절
    if (nextRowId) {
      const nextRow = this.rows.find(r => r.id === nextRowId);
      if (!nextRow) return;
      
      const totalHeight = row.height + nextRow.height;
      newHeight = Math.max(0.05, Math.min(totalHeight - 0.05, newHeight));
      
      const oldHeight = row.height;
      const diff = newHeight - oldHeight;
      
      row.height = newHeight;
      nextRow.height = totalHeight - newHeight;
      
      this.notifyListeners();
    } else {
      // 기존 방식 (모든 row에 분배)
      newHeight = Math.round(newHeight * 10) / 10;
      newHeight = Math.max(0.1, Math.min(0.9, newHeight));
      
      const oldHeight = row.height;
      const diff = newHeight - oldHeight;
      
      row.height = newHeight;
      
      const others = this.rows.filter(r => r.id !== rowId);
      const totalOther = others.reduce((sum, r) => sum + r.height, 0);
      
      if (totalOther > 0) {
        others.forEach(r => {
          r.height = Math.max(0.1, r.height - diff * (r.height / totalOther));
        });
      }
      
      this.normalizeRowHeights();
      this.notifyListeners();
    }
  }

  addBlock(rowId, type = 'empty') {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;

    const newBlock = {
      id: this.generateId(),
      type: type,
      label: BLOCK_LABELS[type],
      width: 1,
      showLabel: false
    };
    
    row.blocks.push(newBlock);
    this.normalizeBlockWidths(rowId);
    this.selected = { type: 'block', rowId, blockId: newBlock.id };
    this.saveToHistory();
  }

  deleteBlock(rowId, blockId) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;

    row.blocks = row.blocks.filter(b => b.id !== blockId);
    this.normalizeBlockWidths(rowId);
    
    if (row.blocks.length > 0) {
      this.selected = { type: 'block', rowId, blockId: row.blocks[0].id };
    } else {
      this.selected = { type: 'row', rowId };
    }
    this.saveToHistory();
  }

  normalizeBlockWidths(rowId) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row || row.blocks.length === 0) return;

    const total = row.blocks.reduce((sum, b) => sum + b.width, 0);
    if (total > 0) {
      row.blocks.forEach(b => b.width = b.width / total);
    } else {
      const w = 1 / row.blocks.length;
      row.blocks.forEach(b => b.width = w);
    }
  }

  updateBlockWidth(rowId, blockId, newWidth, nextBlockId = null) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;
    
    const block = row.blocks.find(b => b.id === blockId);
    if (!block) return;

    // nextBlockId가 있으면 두 블록 사이에서만 조절
    if (nextBlockId) {
      const nextBlock = row.blocks.find(b => b.id === nextBlockId);
      if (!nextBlock) return;
      
      const totalWidth = block.width + nextBlock.width;
      newWidth = Math.max(0.05, Math.min(totalWidth - 0.05, newWidth));
      
      const oldWidth = block.width;
      const diff = newWidth - oldWidth;
      
      block.width = newWidth;
      nextBlock.width = totalWidth - newWidth;
      
      this.notifyListeners();
    } else {
      // 기존 방식 (모든 블록에 분배)
      newWidth = Math.round(newWidth * 10) / 10;
      newWidth = Math.max(0.1, Math.min(0.9, newWidth));
      
      const oldWidth = block.width;
      const diff = newWidth - oldWidth;
      
      block.width = newWidth;
      
      const others = row.blocks.filter(b => b.id !== blockId);
      const totalOther = others.reduce((sum, b) => sum + b.width, 0);
      
      if (totalOther > 0) {
        others.forEach(b => {
          b.width = Math.max(0.1, b.width - diff * (b.width / totalOther));
        });
      }
      
      this.normalizeBlockWidths(rowId);
      this.notifyListeners();
    }
  }

  updateBlock(rowId, blockId, updates, saveHistory = true) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;
    
    const block = row.blocks.find(b => b.id === blockId);
    if (!block) return;

    if (updates.type && updates.type !== block.type) {
      block.type = updates.type;
      if (!updates.label) {
        block.label = BLOCK_LABELS[updates.type];
      }
    }
    
    Object.assign(block, updates);
    if (saveHistory) {
      this.saveToHistory();
    } else {
      this.notifyListeners();
    }
  }

  select(type, rowId, blockId = null) {
    if (type === 'row') {
      this.selected = { type: 'row', rowId };
    } else {
      this.selected = { type: 'block', rowId, blockId };
    }
    this.notifyListeners();
  }

  getSelectedRow() {
    if (!this.selected) return null;
    return this.rows.find(r => r.id === this.selected.rowId);
  }

  getSelectedBlock() {
    if (!this.selected || this.selected.type !== 'block') return null;
    const row = this.getSelectedRow();
    if (!row) return null;
    return row.blocks.find(b => b.id === this.selected.blockId);
  }

  saveToHistory() {
    const state = JSON.parse(JSON.stringify({ rows: this.rows, selected: this.selected }));
    const newHistory = this.history.slice(0, this.historyIndex + 1);
    newHistory.push(state);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      this.historyIndex++;
    }
    
    this.history = newHistory;
    this.notifyListeners();
  }

  undo() {
    if (this.canUndo()) {
      this.historyIndex--;
      const state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.rows = state.rows;
      this.selected = state.selected;
      this.notifyListeners();
    }
  }

  redo() {
    if (this.canRedo()) {
      this.historyIndex++;
      const state = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.rows = state.rows;
      this.selected = state.selected;
      this.notifyListeners();
    }
  }

  canUndo() { return this.historyIndex > 0; }
  canRedo() { return this.historyIndex < this.history.length - 1; }

  subscribe(listener) { this.listeners.push(listener); }
  notifyListeners() { this.listeners.forEach(l => l()); }
}

// UI 클래스
class UI {
  constructor(data) {
    this.data = data;
    this.isDragging = false;
    this.dragType = null;
    this.dragTargetId = null;
    this.dragColumnId = null;
    this.dragStartPos = 0;
    this.dragStartSize = 0;
    this.dragContainerSize = 0;
    this.activeSeparator = null;
    this.init();
  }

  init() {
    this.data.subscribe(() => this.render());
    this.setupEventListeners();
    this.setupGlobalDragHandlers();
    this.render();
  }

  setupEventListeners() {
    document.getElementById('undoBtn').addEventListener('click', () => this.data.undo());
    document.getElementById('redoBtn').addEventListener('click', () => this.data.redo());
    document.getElementById('paperSize').addEventListener('change', () => this.updateCanvasSize());
    document.getElementById('orientation').addEventListener('change', () => this.updateCanvasSize());
    document.getElementById('addRowBtn').addEventListener('click', () => this.data.addRow());
  }

  setupGlobalDragHandlers() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      
      const currentPos = this.dragType === 'row' ? e.clientY : e.clientX;
      const delta = currentPos - this.dragStartPos;
      const percentDelta = delta / this.dragContainerSize;
      const newSize = this.dragStartSize + percentDelta;
      
      if (this.dragType === 'row') {
        this.data.updateRowHeight(this.dragTargetId, newSize, this.dragNextRowId);
      } else {
        this.data.updateBlockWidth(this.dragRowId, this.dragTargetId, newSize, this.dragNextBlockId);
      }
    });

    window.addEventListener('mouseup', () => {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      if (this.activeSeparator) {
        this.activeSeparator.classList.remove('active');
        this.activeSeparator = null;
      }
      
      this.data.saveToHistory();
    });
  }

  updateCanvasSize() {
    const paperSize = document.getElementById('paperSize').value;
    const orientation = document.getElementById('orientation').value;
    const canvas = document.getElementById('canvasContainer');
    
    let width, height;
    
    // A4 = 210x297mm, 비율 = 1:1.414
    switch (paperSize) {
      case 'a4': 
        width = 420; 
        height = 594; // 420 * 1.414
        break;
      case 'letter': 
        width = 425; 
        height = 550; // 8.5:11 비율
        break;
      case 'tablet': 
        width = 512; 
        height = 683; // 3:4 비율
        break;
      default: 
        width = 420; 
        height = 594;
    }
    
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  render() {
    const activeEl = document.activeElement;
    const activeId = activeEl?.id;
    const selectionStart = activeEl?.selectionStart;
    const selectionEnd = activeEl?.selectionEnd;
    
    this.updateButtons();
    this.renderRowList();
    this.renderCanvas();
    this.renderPropertyPanel();
    
    // 포커스 복원
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) {
        el.focus();
        if (typeof selectionStart === 'number') {
          el.setSelectionRange(selectionStart, selectionEnd);
        }
      }
    }
  }

  updateButtons() {
    document.getElementById('undoBtn').disabled = !this.data.canUndo();
    document.getElementById('redoBtn').disabled = !this.data.canRedo();
  }

  renderRowList() {
    const container = document.getElementById('rowList');
    container.innerHTML = '';

    this.data.rows.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'row-item';
      
      const rowHeader = document.createElement('div');
      rowHeader.className = `row-header ${this.data.selected?.type === 'row' && this.data.selected?.rowId === row.id ? 'selected' : ''}`;
      rowHeader.innerHTML = `
        <span class="row-icon">—</span>
        <span class="row-label">Row ${rowIndex + 1}</span>
        <span class="row-height">${(row.height * 100).toFixed(0)}%</span>
      `;
      rowHeader.addEventListener('click', () => {
        this.data.select('row', row.id);
      });
      rowEl.appendChild(rowHeader);

      if (row.blocks.length > 0) {
        const blockList = document.createElement('div');
        blockList.className = 'block-list';
        
        row.blocks.forEach((block) => {
          const blockEl = document.createElement('div');
          blockEl.className = `block-item ${this.data.selected?.type === 'block' && this.data.selected?.blockId === block.id ? 'selected' : ''}`;
          blockEl.innerHTML = `
            <span class="block-label">${block.label}</span>
            <span class="block-width">${(block.width * 100).toFixed(0)}%</span>
          `;
          blockEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.data.select('block', row.id, block.id);
          });
          blockList.appendChild(blockEl);
        });
        
        rowEl.appendChild(blockList);
      }

      container.appendChild(rowEl);
    });
  }

  renderCanvas() {
    const canvas = document.getElementById('canvasContainer');
    canvas.innerHTML = '';

    this.data.rows.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = `canvas-row ${this.data.selected?.type === 'row' && this.data.selected?.rowId === row.id ? 'selected' : ''}`;
      rowEl.style.flex = `${row.height} 1 0%`;
      rowEl.dataset.rowId = row.id;

      if (row.blocks.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-row';
        emptyMsg.innerHTML = `<span>Row ${rowIndex + 1}</span><span class="empty-hint">Add blocks</span>`;
        rowEl.appendChild(emptyMsg);
        
        rowEl.addEventListener('click', () => {
          this.data.select('row', row.id);
        });
      } else {
        row.blocks.forEach((block, blockIndex) => {
          const blockEl = this.createBlockElement(row, block);
          rowEl.appendChild(blockEl);

          if (blockIndex < row.blocks.length - 1) {
            const nextBlock = row.blocks[blockIndex + 1];
            const sep = this.createBlockSeparator(row, block, nextBlock);
            rowEl.appendChild(sep);
          }
        });
      }

      canvas.appendChild(rowEl);

      if (rowIndex < this.data.rows.length - 1) {
        const nextRow = this.data.rows[rowIndex + 1];
        const sep = this.createRowSeparator(row, nextRow);
        canvas.appendChild(sep);
      }
    });
  }

  createBlockElement(row, block) {
    const el = document.createElement('div');
    el.className = `canvas-block block-${block.type} ${this.data.selected?.type === 'block' && this.data.selected?.blockId === block.id ? 'selected' : ''}`;
    el.style.flex = `${block.width} 1 0%`;
    el.dataset.blockId = block.id;

    // 라벨 표시 옵션
    if (block.showLabel) {
      const header = document.createElement('div');
      header.className = 'block-header';
      header.innerHTML = `<span class="block-title">${block.label}</span>`;
      el.appendChild(header);
    }

    const content = document.createElement('div');
    content.className = 'block-content';
    content.innerHTML = this.getBlockContent(block.type);
    el.appendChild(content);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.data.select('block', row.id, block.id);
    });

    return el;
  }

  createRowSeparator(currentRow, nextRow) {
    const sep = document.createElement('div');
    sep.className = 'row-separator';
    
    sep.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.dragType = 'row';
      this.dragTargetId = currentRow.id;
      this.dragNextRowId = nextRow.id;
      this.dragStartPos = e.clientY;
      this.dragStartSize = currentRow.height;
      this.dragNextStartSize = nextRow.height;
      this.dragContainerSize = document.getElementById('canvasContainer').getBoundingClientRect().height;
      
      this.activeSeparator = sep;
      sep.classList.add('active');
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    });

    return sep;
  }

  createBlockSeparator(row, currentBlock, nextBlock) {
    const sep = document.createElement('div');
    sep.className = 'block-separator';
    
    sep.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = true;
      this.dragType = 'block';
      this.dragTargetId = currentBlock.id;
      this.dragNextBlockId = nextBlock.id;
      this.dragRowId = row.id;
      this.dragStartPos = e.clientX;
      this.dragStartSize = currentBlock.width;
      
      const rowEl = document.querySelector(`[data-row-id="${row.id}"]`);
      this.dragContainerSize = rowEl.getBoundingClientRect().width;
      
      this.activeSeparator = sep;
      sep.classList.add('active');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    return sep;
  }

  getBlockContent(type) {
    switch (type) {
      case 'schedule':
        return `<div class="preview-lines blank-schedule">
          <div class="time-slot"><span class="time-guide">06:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">07:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">08:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">09:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">10:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">11:00</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">12:00</span><span class="line"></span></div>
        </div>`;
      case 'todo':
        return `<div class="preview-checks blank-todo">
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
          <div class="checkbox-line"><span class="checkbox">☐</span><span class="line"></span></div>
        </div>`;
      case 'memo':
        return `<div class="preview-lines blank-memo">
          <div class="memo-line"></div>
          <div class="memo-line"></div>
          <div class="memo-line"></div>
          <div class="memo-line"></div>
          <div class="memo-line"></div>
          <div class="memo-line"></div>
          <div class="memo-line"></div>
        </div>`;
      case 'goal':
        return `<div class="preview-lines blank-goal">
          <div class="goal-line"><span class="bullet">•</span><span class="line"></span></div>
          <div class="goal-line"><span class="bullet">•</span><span class="line"></span></div>
          <div class="goal-line"><span class="bullet">•</span><span class="line"></span></div>
        </div>`;
      case 'habit':
        return `<div class="preview-habit blank-habit">
          <div class="habit-row">
            <span class="habit-label-space"></span>
            <span class="habit-checks">
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
            </span>
          </div>
          <div class="habit-row">
            <span class="habit-label-space"></span>
            <span class="habit-checks">
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
            </span>
          </div>
          <div class="habit-row">
            <span class="habit-label-space"></span>
            <span class="habit-checks">
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
              <span class="habit-box">○</span>
            </span>
          </div>
        </div>`;
      case 'time-log':
        return `<div class="preview-lines blank-timelog">
          <div class="time-slot"><span class="time-guide">__:__</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">__:__</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">__:__</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">__:__</span><span class="line"></span></div>
          <div class="time-slot"><span class="time-guide">__:__</span><span class="line"></span></div>
        </div>`;
      case 'emotion':
        return `<div class="preview-lines blank-emotion">
          <div class="emotion-line"></div>
          <div class="emotion-line"></div>
          <div class="emotion-line"></div>
        </div>`;
      default:
        return '<div class="preview-empty">Empty Block</div>';
    }
  }

  renderPropertyPanel() {
    const panel = document.getElementById('propertyPanel');
    
    if (!this.data.selected) {
      panel.innerHTML = '<div class="panel-empty">No selection</div>';
      return;
    }

    const row = this.data.getSelectedRow();
    const block = this.data.getSelectedBlock();
    const rowIndex = this.data.rows.findIndex(r => r.id === row?.id);

    if (this.data.selected.type === 'row') {
      panel.innerHTML = `
        <div class="property-section">
          <h3>Row Info</h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Row</span>
              <span class="info-value">${rowIndex + 1}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Height</span>
              <span class="info-value">${(row.height * 100).toFixed(0)}%</span>
            </div>
            <div class="info-row">
              <span class="info-label">Blocks</span>
              <span class="info-value">${row.blocks.length}</span>
            </div>
          </div>
        </div>

        <div class="property-divider"></div>

        <div class="property-section">
          <h3>Add Block</h3>
          <div class="block-type-grid">
            ${BLOCK_TYPES.map(type => `
              <button class="block-type-btn" data-type="${type}">
                ${BLOCK_LABELS[type]}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="property-divider"></div>

        <div class="property-section">
          <button class="btn btn-danger" id="deleteRowBtn" ${this.data.rows.length <= 1 ? 'disabled' : ''}>
            Delete Row
          </button>
        </div>
      `;

      panel.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.data.addBlock(row.id, btn.dataset.type);
        });
      });

      const deleteBtn = document.getElementById('deleteRowBtn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm('Delete this row?')) {
            this.data.deleteRow(row.id);
          }
        });
      }

    } else {
      panel.innerHTML = `
        <div class="property-section">
          <h3>Block Info</h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Position</span>
              <span class="info-value">Row ${rowIndex + 1}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Type</span>
              <span class="info-value">${BLOCK_LABELS[block.type]}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Width</span>
              <span class="info-value">${(block.width * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div class="property-divider"></div>

        <div class="property-section">
          <h3>Label</h3>
          <input type="text" class="property-input" id="labelInput" value="${block.label}" />
          <label class="checkbox-label" style="margin-top: 8px; display: flex; align-items: center; gap: 6px; font-size: 12px;">
            <input type="checkbox" id="showLabelCheckbox" ${block.showLabel ? 'checked' : ''} />
            <span>Show label on canvas</span>
          </label>
        </div>

        <div class="property-section">
          <h3>Change Type</h3>
          <select class="property-select" id="typeSelect">
            ${BLOCK_TYPES.map(type => `
              <option value="${type}" ${block.type === type ? 'selected' : ''}>
                ${BLOCK_LABELS[type]}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="property-divider"></div>

        <div class="property-section">
          <h3>Add Block to Row</h3>
          <div class="block-type-grid">
            ${BLOCK_TYPES.map(type => `
              <button class="block-type-btn" data-type="${type}">
                ${BLOCK_LABELS[type]}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="property-divider"></div>

        <div class="property-section">
          <button class="btn btn-danger" id="deleteBlockBtn">
            Delete Block
          </button>
        </div>
      `;

      const labelInput = document.getElementById('labelInput');
      if (labelInput) {
        let isComposing = false;
        
        labelInput.addEventListener('compositionstart', () => {
          isComposing = true;
        });
        
        labelInput.addEventListener('compositionend', (e) => {
          isComposing = false;
          this.data.updateBlock(row.id, block.id, { label: e.target.value }, false);
        });
        
        labelInput.addEventListener('input', (e) => {
          if (!isComposing) {
            this.data.updateBlock(row.id, block.id, { label: e.target.value }, false);
          }
        });
        
        labelInput.addEventListener('blur', () => {
          this.data.saveToHistory();
        });
      }

      const showLabelCheckbox = document.getElementById('showLabelCheckbox');
      if (showLabelCheckbox) {
        showLabelCheckbox.addEventListener('change', (e) => {
          this.data.updateBlock(row.id, block.id, { showLabel: e.target.checked });
        });
      }

      const typeSelect = document.getElementById('typeSelect');
      if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
          this.data.updateBlock(row.id, block.id, { type: e.target.value });
        });
      }

      panel.querySelectorAll('[data-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.data.addBlock(row.id, btn.dataset.type);
        });
      });

      const deleteBtn = document.getElementById('deleteBlockBtn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm('Delete this block?')) {
            this.data.deleteBlock(row.id, block.id);
          }
        });
      }
    }
  }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
  const data = new LayoutData();
  data.saveToHistory();
  const ui = new UI(data);
  ui.updateCanvasSize();
  
  // Reset Template 버튼
  const resetBtn = document.getElementById('resetTemplateBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset to default template? Current layout will be lost.')) {
        data.resetTemplate();
      }
    });
  }
  
  window.layoutData = data;
  window.layoutUI = ui;
});