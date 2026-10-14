document.addEventListener('DOMContentLoaded', () => {
      const layoutSelect = document.getElementById('layout-type');
      const formsContainer = document.getElementById('forms-container');
      const a4Preview = document.getElementById('a4-preview');
      const cardTemplate = document.getElementById('card-template');
      const zoomSlider = document.getElementById('zoom-slider');
      const zoomValue = document.getElementById('zoom-val');
      const quickGrade = document.getElementById('quick-grade');
      const status = document.getElementById('status');
      const logoUrl = 'https://ataro-qqq.github.io/ysexe-card/ysexe-rogo.png';
      const gradeStyles = {
        '高3': { color: '#2563eb', dark: '#17449b', soft: '#edf3ff', english: 'BLUE', school: 'HIGH', className: 'level-high' },
        '高2': { color: '#14804a', dark: '#0a6135', soft: '#e8f6ed', english: 'GREEN', school: 'HIGH', className: 'level-high' },
        '高1': { color: '#d94848', dark: '#a5262a', soft: '#fdf0f0', english: 'RED', school: 'HIGH', className: 'level-high' },
        '中3': { color: '#2563eb', dark: '#17449b', soft: '#edf3ff', english: 'BLUE', school: 'JUNIOR', className: 'level-middle' },
        '中2': { color: '#14804a', dark: '#0a6135', soft: '#e8f6ed', english: 'GREEN', school: 'JUNIOR', className: 'level-middle' },
        '中1': { color: '#d94848', dark: '#a5262a', soft: '#fdf0f0', english: 'RED', school: 'JUNIOR', className: 'level-middle' }
      };
      const samples = [
        { role: '執行部役員', name: '創英 太郎', spell: 'TARO SOEI', grade: '高2', className: '2年3組 20番', studentId: '272134', duty: '創英祭担当', pledge: '声をつなぎ、学校をもっと面白く。' },
        { role: '副会長', name: '横浜 花子', spell: 'HANAKO YOKOHAMA', grade: '中3', className: '3年1組 8番', studentId: '263108', duty: '広報・企画担当', pledge: 'みんなの「やってみたい」を形に。' },
        { role: '書記', name: '青葉 陸', spell: 'RIKU AOBA', grade: '高1', className: '1年2組 12番', studentId: '281212', duty: '校内美化担当', pledge: '小さな声も、学校を変える力に。' },
        { role: '会計', name: '港 葵', spell: 'AOI MINATO', grade: '中2', className: '2年4組 16番', studentId: '272416', duty: '行事運営担当', pledge: '参加したくなる学校行事をつくる。' },
        { role: '執行委員', name: '山手 翔', spell: 'SHO YAMATE', grade: '高3', className: '3年1組 3番', studentId: '273103', duty: '学校生活担当', pledge: '対話から始める、よりよい学校づくり。' }
      ];
      let members = samples.map(item => ({...item}));
      const fieldDefinitions = [
        { key: 'role', label: '役職', placeholder: '例：生徒会長', type: 'text', max: 30 },
        { key: 'name', label: '名前', placeholder: '例：創英 太郎', type: 'text', max: 24 },
        { key: 'spell', label: '名前の英語表記', hint: '自動で大文字', placeholder: '例：TARO SOEI', type: 'text', max: 40, uppercase: true },
        { key: 'grade', label: '学年', type: 'select' },
        { key: 'className', label: '所属学級', placeholder: '例：1年3組 20番', type: 'text', max: 30 },
        { key: 'studentId', label: '学籍番号', placeholder: '例：272134', type: 'text', max: 20 },
        { key: 'duty', label: '担当', placeholder: '例：創英祭担当', type: 'text', max: 35 },
        { key: 'pledge', label: '公約', placeholder: '伝えたい公約を入力（短めがおすすめ）', type: 'textarea', max: 100 }
      ];
      function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
      }
      function formMarkup(member, index, total) {
        const copies = total === 1 ? 10 : total === 2 ? 5 : 2;
        const fields = fieldDefinitions.map(field => {
          const id = `field-${index}-${field.key}`;
          const label = `<label for="${id}">${field.label}${field.hint ? `<small>${field.hint}</small>` : ''}</label>`;
          if (field.type === 'select') {
            const options = ['高3','高2','高1','中3','中2','中1'].map(grade => `<option value="${grade}" ${member.grade === grade ? 'selected' : ''}>${grade}（${gradeStyles[grade].english === 'BLUE' ? '青' : gradeStyles[grade].english === 'GREEN' ? '緑' : '赤'}）</option>`).join('');
            return `<div class="field">${label}<select id="${id}" data-index="${index}" data-field="${field.key}">${options}</select></div>`;
          }
          if (field.type === 'textarea') {
            return `<div class="field">${label}<textarea id="${id}" data-index="${index}" data-field="${field.key}" maxlength="${field.max}" placeholder="${field.placeholder}">${esc(member[field.key])}</textarea></div>`;
          }
          const inputVal = field.uppercase ? String(member[field.key] || '').toUpperCase() : member[field.key];
          return `<div class="field">${label}<input id="${id}" data-index="${index}" data-field="${field.key}" type="text" maxlength="${field.max}" value="${esc(inputVal)}" placeholder="${field.placeholder}" ${field.uppercase ? 'class="uppercase" autocapitalize="characters"' : ''}></div>`;
        });
        return `<section class="member-form" data-member="${index}">
          <div class="member-title"><span><span class="member-number">${index + 1}</span>メンバー ${index + 1}</span><span class="copies">同じ名刺を ${copies} 枚</span></div>
          <div class="form-grid">${fields[0]}${fields[1]}</div>
          ${fields[2]}
          <div class="form-grid">${fields[3]}${fields[4]}</div>
          <div class="form-grid">${fields[5]}${fields[6]}</div>
          ${fields[7]}
        </section>`;
      }
      function renderForms() {
        const count = Number(layoutSelect.value);
        formsContainer.innerHTML = members.slice(0, count).map((member, index) => formMarkup(member, index, count)).join('');
        formsContainer.querySelectorAll('[data-field]').forEach(control => {
          control.addEventListener('input', onFormChange);
          control.addEventListener('change', onFormChange);
        });
        renderPreview();
      }
      function onFormChange(event) {
        const control = event.currentTarget;
        const index = Number(control.dataset.index);
        const field = control.dataset.field;
        let value = control.value;
        if (field === 'spell') {
          value = value.toLocaleUpperCase('en-US');
          if (control.value !== value) {
            const start = control.selectionStart;
            const end = control.selectionEnd;
            control.value = value;
            try { control.setSelectionRange(start, end); } catch (_) {}
          }
        }
        if (!members[index]) members[index] = {...samples[index % samples.length]};
        members[index][field] = value;
        if (field === 'grade' && index === 0) quickGrade.value = value;
        renderPreview();
      }
      function setCardValue(card, selector, value, fallback = '') {
        const el = card.querySelector(selector);
        if (el) el.textContent = value || fallback;
      }
      function applyMemberToCard(card, member, index) {
        const grade = gradeStyles[member.grade] ? member.grade : '高2';
        const style = gradeStyles[grade];
        card.classList.remove('level-high', 'level-middle');
        card.classList.add(style.className);
        card.style.setProperty('--card-accent', style.color);
        card.style.setProperty('--card-accent-dark', style.dark);
        card.style.setProperty('--card-accent-soft', style.soft);
        const levelMark = card.querySelector('.level-mark');
        levelMark.textContent = style.school === 'HIGH' ? 'SENIOR HIGH' : 'JUNIOR HIGH';
        setCardValue(card, '.display-role', member.role, '役職');
        setCardValue(card, '.display-name', member.name, '名前');
        setCardValue(card, '.display-spell', String(member.spell || '').toLocaleUpperCase('en-US'), 'NAME SURNAME');
        setCardValue(card, '.display-class', member.className, '所属学級');
        setCardValue(card, '.display-id', member.studentId, '学籍番号');
        setCardValue(card, '.display-duty', member.duty, '担当');
        setCardValue(card, '.display-pledge', member.pledge, '公約を入力');
        setCardValue(card, '.display-year', grade.slice(1), '2');
        setCardValue(card, '.display-level-label', style.school === 'HIGH' ? 'HIGH' : 'JUNIOR');
        setCardValue(card, '.display-code', `SOEI / ${style.school === 'HIGH' ? 'SH' : 'JH'} / ${grade}`);
        const logo = card.querySelector('.card-logo');
        logo.src = logoUrl;
        logo.alt = '横浜創英ロゴ';
        const nameEl = card.querySelector('.display-name');
        const nameLen = [...String(member.name || '')].length;
        if (nameLen > 6) {
          nameEl.style.fontSize = '6.0mm';
          nameEl.style.letterSpacing = '0.10em';
        } else if (nameLen > 4) {
          nameEl.style.fontSize = '6.8mm';
          nameEl.style.letterSpacing = '0.14em';
        } else {
          nameEl.style.fontSize = '7.6mm';
          nameEl.style.letterSpacing = '0.18em';
        }
        const spell = card.querySelector('.display-spell');
        const spellLen = String(member.spell || '').length;
        spell.style.fontSize = spellLen > 22 ? '1.25mm' : spellLen > 16 ? '1.45mm' : '1.6mm';
        const role = card.querySelector('.display-role');
        const roleLen = [...String(member.role || '')].length;
        role.style.fontSize = roleLen > 14 ? '1.55mm' : '1.85mm';
        const pledge = card.querySelector('.display-pledge');
        const pledgeLen = [...String(member.pledge || '')].length;
        pledge.style.fontSize = pledgeLen > 38 ? '1.4mm' : pledgeLen > 24 ? '1.6mm' : '1.8mm';
        card.dataset.memberIndex = String(index);
      }
      function renderPreview() {
        const count = Number(layoutSelect.value);
        const visibleMembers = members.slice(0, count);
        a4Preview.innerHTML = '';
        for (let cardIndex = 0; cardIndex < 10; cardIndex++) {
          const memberIndex = count === 1 ? 0 : count === 2 ? cardIndex % 2 : Math.floor(cardIndex / 2);
          const clone = cardTemplate.content.cloneNode(true);
          const card = clone.querySelector('.business-card');
          applyMemberToCard(card, visibleMembers[memberIndex] || samples[0], memberIndex);
          a4Preview.appendChild(clone);
        }
        updateGradePreview(quickGrade.value);
      }
      function updateGradePreview(grade) {
        const safeGrade = gradeStyles[grade] ? grade : '高2';
        const style = gradeStyles[safeGrade];
        document.documentElement.style.setProperty('--accent', style.color);
        document.documentElement.style.setProperty('--accent-dark', style.dark);
        document.documentElement.style.setProperty('--accent-soft', style.soft);
        document.getElementById('grade-swatch').style.background = style.color;
        document.getElementById('grade-preview-title').textContent = `${safeGrade.startsWith('高') ? '高校' : '中学'}${safeGrade.slice(1)}年 — ${style.english}`;
        document.getElementById('grade-preview-note').textContent = style.school === 'HIGH'
          ? '高校：ソリッドな幾何学タグと直線的なストライプ'
          : '中学：破線スタイルのタグと丸型グラフィック';
      }
      layoutSelect.addEventListener('change', () => {
        const nextCount = Number(layoutSelect.value);
        while (members.length < nextCount) members.push({...samples[members.length % samples.length]});
        renderForms();
      });
      quickGrade.addEventListener('change', () => {
        if (members[0]) {
          members[0].grade = quickGrade.value;
          const input = formsContainer.querySelector('[data-index="0"][data-field="grade"]');
          if (input) input.value = quickGrade.value;
          renderPreview();
        } else updateGradePreview(quickGrade.value);
      });
      zoomSlider.addEventListener('input', () => {
        const value = Number(zoomSlider.value);
        a4Preview.style.transform = `scale(${value})`;
        zoomValue.textContent = `${Math.round(value * 100)}%`;
      });
      document.getElementById('reset-btn').addEventListener('click', () => {
        members = samples.map(item => ({...item}));
        layoutSelect.value = '1';
        quickGrade.value = members[0].grade;
        renderForms();
        status.textContent = '入力例に戻しました。';
      });
      window.printCards = function() {
        const oldTransform = a4Preview.style.transform;
        a4Preview.style.transform = 'none';
        status.textContent = '印刷ダイアログを開きます。用紙A4・倍率100%／実際のサイズを指定してください。';
        window.setTimeout(() => {
          window.print();
          a4Preview.style.transform = oldTransform;
        }, 120);
      };
      window.generatePDF = async function() {
        const button = document.getElementById('pdf-btn');
        const original = button.innerHTML;
        if (typeof html2pdf === 'undefined') {
          status.textContent = 'PDFライブラリを読み込めませんでした。印刷ボタンから「PDFに保存」を選択してください。';
          return;
        }
        button.disabled = true;
        button.textContent = 'PDFを作成中…';
        status.textContent = 'A4・4号名刺10面のPDFを作成しています。';
        const clone = a4Preview.cloneNode(true);
        clone.id = 'pdf-render-clone';
        Object.assign(clone.style, {
          position: 'fixed', left: '-250mm', top: '0', margin: '0', transform: 'none',
          boxShadow: 'none', width: '210mm', height: '297mm', overflow: 'hidden', zIndex: '-1'
        });
        document.body.appendChild(clone);
        try {
          await html2pdf().set({
            margin: 0,
            filename: 'Soei_Student_Council_Business_Cards.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, allowTaint: false, backgroundColor: '#ffffff', logging: false, scrollX: 0, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          }).from(clone).save();
          status.textContent = 'PDFの出力を開始しました。印刷時はA4・倍率100%を指定してください。';
        } catch (error) {
          console.error('PDF generation failed:', error);
          status.textContent = 'PDFを作成できませんでした。印刷ボタンから「PDFに保存」を選択してください。';
        } finally {
          clone.remove();
          button.disabled = false;
          button.innerHTML = original;
        }
      };
      document.querySelectorAll('img[src="' + logoUrl + '"]').forEach(img => {
        img.addEventListener('error', () => { img.style.opacity = '0.15'; img.title = 'ロゴ画像を読み込めません。インターネット接続を確認してください。'; });
      });
      renderForms();
      a4Preview.style.transform = `scale(${zoomSlider.value})`;
      zoomValue.textContent = `${Math.round(Number(zoomSlider.value) * 100)}%`;
    });
