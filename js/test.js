// ── SBTI Test Logic ──────────────────────
// Depends on globals: SBTI_QUESTIONS, SBTI_SPECIAL, SBTI_TYPES, SBTI_IMAGES,
//   SBTI_NORMAL, SBTI_DIM, SBTI_I18N, SBTI_PREFIX

(function() {
  const dimensionMeta = SBTI_DIM.dimensionMeta;
  const dimensionOrder = SBTI_DIM.dimensionOrder;
  const questions = SBTI_QUESTIONS;
  const specialQuestions = SBTI_SPECIAL;

  const app = {
    shuffledQuestions: [],
    answers: {},
    previewMode: false
  };

  const questionList = document.getElementById('questionList');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const submitBtn = document.getElementById('submitBtn');
  const testHint = document.getElementById('testHint');

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getVisibleQuestions() {
    const visible = [...app.shuffledQuestions];
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
    if (gateIndex !== -1 && app.answers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    return visible;
  }

  function getQuestionMetaLabel(q) {
    if (q.special) return SBTI_I18N.supplementary;
    return app.previewMode ? dimensionMeta[q.dim].name : SBTI_I18N.dimHidden;
  }

  function renderQuestions() {
    const visibleQuestions = getVisibleQuestions();
    questionList.innerHTML = '';
    visibleQuestions.forEach((q, index) => {
      const card = document.createElement('article');
      card.className = 'question-card';
      const qLabel = SBTI_I18N.question.replace('{{num}}', index + 1);
      card.innerHTML = `
        <div class="question-meta">
          <div class="question-badge">${qLabel}</div>
          <div>${getQuestionMetaLabel(q)}</div>
        </div>
        <div class="question-title">${q.text}</div>
        <div class="options-list">
          ${q.options.map((opt, i) => {
            const code = ['A', 'B', 'C', 'D'][i] || String(i + 1);
            const checked = app.answers[q.id] === opt.value ? 'checked' : '';
            return `
              <label class="option-label">
                <input type="radio" name="${q.id}" value="${opt.value}" ${checked}>
                <div class="option-code">${code}</div>
                <div>${opt.label}</div>
              </label>
            `;
          }).join('')}
        </div>
      `;
      questionList.appendChild(card);
    });

    questionList.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const { name, value } = e.target;
        app.answers[name] = Number(value);
        if (name === 'drink_gate_q1') {
          if (Number(value) !== 3) delete app.answers['drink_gate_q2'];
          renderQuestions();
          return;
        }
        updateProgress();
      });
    });
    updateProgress();
  }

  function updateProgress() {
    const visibleQuestions = getVisibleQuestions();
    const total = visibleQuestions.length;
    const done = visibleQuestions.filter(q => app.answers[q.id] !== undefined).length;
    const percent = total ? (done / total) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${done} / ${total}`;
    const complete = done === total && total > 0;
    submitBtn.disabled = !complete;
    testHint.textContent = complete ? SBTI_I18N.hintComplete : SBTI_I18N.hintIncomplete;
  }

  // ── Scoring ────────────────────────────
  function sumToLevel(score) {
    if (score <= 3) return 'L';
    if (score === 4) return 'M';
    return 'H';
  }
  function levelNum(level) { return { L: 1, M: 2, H: 3 }[level]; }
  function parsePattern(pattern) { return pattern.replace(/-/g, '').split(''); }

  function computeResult() {
    const rawScores = {};
    const levels = {};
    Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });
    questions.forEach(q => { rawScores[q.dim] += Number(app.answers[q.id] || 0); });
    Object.entries(rawScores).forEach(([dim, score]) => { levels[dim] = sumToLevel(score); });

    const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));
    const ranked = SBTI_NORMAL.map(type => {
      const vector = parsePattern(type.pattern).map(levelNum);
      let distance = 0, exact = 0;
      for (let i = 0; i < vector.length; i++) {
        const diff = Math.abs(userVector[i] - vector[i]);
        distance += diff;
        if (diff === 0) exact++;
      }
      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
      return { ...type, ...SBTI_TYPES[type.code], distance, exact, similarity };
    }).sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      if (b.exact !== a.exact) return b.exact - a.exact;
      return b.similarity - a.similarity;
    });

    const bestNormal = ranked[0];
    const drunkTriggered = app.answers['drink_gate_q2'] === 2;
    const _r = typeof SBTI_I18N_RESULT !== 'undefined' ? SBTI_I18N_RESULT : null;

    let finalType, modeKicker, badge, sub, special = false;

    if (drunkTriggered) {
      finalType = SBTI_TYPES.DRUNK;
      modeKicker = _r ? _r.hiddenActivated : '隐藏人格已激活';
      badge = _r ? _r.matchDrunkBadge : '匹配度 100%';
      sub = _r ? _r.matchDrunk : '';
      special = true;
    } else if (bestNormal.similarity < 60) {
      finalType = SBTI_TYPES.HHHH;
      modeKicker = _r ? _r.systemFallback : '系统强制兜底';
      badge = (_r ? _r.matchLowBadge : '最高匹配仅 {{pct}}%').replace('{{pct}}', bestNormal.similarity);
      sub = _r ? _r.matchLow : '';
      special = true;
    } else {
      finalType = bestNormal;
      modeKicker = _r ? _r.yourType : '你的主类型';
      badge = (_r ? _r.matchPercent : '匹配度 {{pct}}%')
        .replace('{{pct}}', bestNormal.similarity)
        .replace('{{exact}}', bestNormal.exact);
      sub = _r ? _r.matchHigh : '';
    }

    return { rawScores, levels, ranked, bestNormal, finalType, modeKicker, badge, sub, special };
  }

  // ── Submit → store result & redirect ───
  function handleSubmit() {
    const result = computeResult();
    // Store in sessionStorage for result page
    sessionStorage.setItem('sbti_result', JSON.stringify({
      ...result,
      answers: app.answers
    }));
    window.location.href = SBTI_PREFIX + '/result';
  }

  // ── Init ───────────────────────────────
  function startTest() {
    app.previewMode = false;
    app.answers = {};
    const shuffledRegular = shuffle(questions);
    const insertIndex = Math.floor(Math.random() * shuffledRegular.length) + 1;
    app.shuffledQuestions = [
      ...shuffledRegular.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffledRegular.slice(insertIndex)
    ];
    renderQuestions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitBtn.addEventListener('click', handleSubmit);
  startTest();
})();
