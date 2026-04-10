// ── SBTI Result Page Logic ──────────────
// Depends on globals: SBTI_TYPES, SBTI_IMAGES, SBTI_DIM, SBTI_PREFIX,
//   SBTI_I18N_RESULT (optional, for i18n labels)

(function() {
  const stored = sessionStorage.getItem('sbti_result');
  if (!stored) {
    window.location.href = SBTI_PREFIX + '/test';
    return;
  }

  const result = JSON.parse(stored);
  let { levels, ranked, finalType, modeKicker, badge, sub, special } = result;
  // Ensure finalType text fields reflect current page language by
  // re-resolving type data from SBTI_TYPES using the type code.
  if (finalType && finalType.code && typeof SBTI_TYPES !== 'undefined' && SBTI_TYPES[finalType.code]) {
    // merge stored metadata (distance, exact, similarity) with current-language type data
    const storedMeta = { distance: finalType.distance, exact: finalType.exact, similarity: finalType.similarity };
    finalType = { ...SBTI_TYPES[finalType.code], ...storedMeta };
  }
  const dimensionMeta = SBTI_DIM.dimensionMeta;
  const dimensionOrder = SBTI_DIM.dimensionOrder;
  const dimExplanations = SBTI_DIM.dimExplanations;

  // ── Type Box ───────────────────────────
  const typeKicker = document.getElementById('typeKicker');
  const typeName   = document.getElementById('typeName');
  const typeCode   = document.getElementById('typeCode');
  const matchBadge = document.getElementById('matchBadge');
  const typeSub    = document.getElementById('typeSub');
  const typeIntro  = document.getElementById('typeIntro');
  const typeImg    = document.getElementById('typeImg');

  if (typeKicker)  typeKicker.textContent = modeKicker;
  if (typeName)    typeName.textContent = finalType.cn || finalType.code;
  if (typeCode)    typeCode.textContent = finalType.code;
  if (matchBadge)  matchBadge.textContent = badge;
  if (typeSub)     typeSub.textContent = sub;
  if (typeIntro)   typeIntro.textContent = finalType.intro || '';

  if (typeImg && SBTI_IMAGES && SBTI_IMAGES[finalType.code]) {
    typeImg.src = '/image/' + SBTI_IMAGES[finalType.code];
    typeImg.alt = finalType.cn || finalType.code;
    typeImg.style.display = '';
  }

  // ── Analysis ───────────────────────────
  const analysisBox = document.getElementById('analysisBox');
  if (analysisBox) {
    analysisBox.textContent = finalType.desc || '';
  }

  // ── Dimension List ─────────────────────
  const dimList = document.getElementById('dimensionList');
  if (dimList) {
    dimList.innerHTML = '';
    dimensionOrder.forEach(dim => {
      const level = levels[dim];
      const meta = dimensionMeta[dim];
      const explanation = dimExplanations[dim] ? dimExplanations[dim][level] : '';
      const barPercent = { L: 25, M: 55, H: 90 }[level];
      const levelLabel = { L: 'Low', M: 'Mid', H: 'High' }[level];
      const item = document.createElement('div');
      item.className = 'dim-item';
      item.innerHTML = `
        <div class="dim-header">
          <span class="dim-name">${meta.name}</span>
          <span class="dim-level dim-level-${level.toLowerCase()}">${levelLabel}</span>
        </div>
        <div class="dim-bar"><div class="dim-bar-fill" style="width:${barPercent}%"></div></div>
        <div class="dim-explain">${explanation}</div>
      `;
      dimList.appendChild(item);
    });
  }

  // ── Fun Note ───────────────────────────
  const funNote = document.getElementById('funNote');
  if (funNote) {
    const i18n = typeof SBTI_I18N_RESULT !== 'undefined' ? SBTI_I18N_RESULT : {};
    funNote.textContent = special ? (i18n.noteSpecial || '') : (i18n.noteNormal || '');
  }

  // ── Runner-Up List ─────────────────────
  const runnerList = document.getElementById('runnerList');
  if (runnerList) {
    const runners = ranked.filter(r => r.code !== finalType.code).slice(0, 3);
    runnerList.innerHTML = '';
    runners.forEach(r => {
      const el = document.createElement('div');
      el.className = 'runner-item';
      el.innerHTML = `
        <span class="runner-name">${r.cn || r.code} (${r.code})</span>
        <span class="runner-sim">${r.similarity}%</span>
      `;
      runnerList.appendChild(el);
    });
  }

  // ── Share ──────────────────────────────
  const shareBtn = document.getElementById('shareBtn');
  const toast = document.getElementById('toast');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.origin + SBTI_PREFIX + '/result?type=' + encodeURIComponent(finalType.code);
      navigator.clipboard.writeText(url).then(() => {
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        }
      }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        }
      });
    });
  }

  // ── CTA ────────────────────────────────
  const retakeBtn = document.getElementById('retakeBtn');
  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      sessionStorage.removeItem('sbti_result');
      window.location.href = SBTI_PREFIX + '/test';
    });
  }
})();
