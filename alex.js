// alex.js — Alex page client logic
// State machine: idle → submitting → result | error
// No bundler. No library. Plain vanilla JS.
// Security: NEVER use innerHTML on raw model text. All text via textContent.

(function () {
  'use strict';

  // ── Rehearsal brief (Cmd/Ctrl+Shift+P safety net for pitcher) ─────────────

  var BRIEF_REHEARSAL =
    'Alex, I need to hire a Senior Software Engineer. They need 5+ years ' +
    'experience in React and Node.js. London-based, hybrid 2 days in office. ' +
    'Reports to the CTO. Salary £85,000–£100,000. Company is a 28-person ' +
    'Series B SaaS. Start date ASAP. We\'re building a B2B analytics platform. ' +
    'Culture is fast-paced, high autonomy, engineering-led.';

  // ── State machine ─────────────────────────────────────────────────────────

  // state: 'idle' | 'submitting' | 'result' | 'error'
  var state = 'idle';

  function setState(next) {
    state = next;
    render();
  }

  function render() {
    var input      = document.getElementById('brief-input');
    var submitBtn  = document.getElementById('submit-btn');
    var loading    = document.getElementById('loading-panel');
    var outputRgn  = document.getElementById('output-region');
    var resetSec   = document.getElementById('reset-section');
    var warning    = document.getElementById('warning-panel');

    // Visibility
    loading.hidden    = (state !== 'submitting');
    outputRgn.hidden  = (state !== 'result');
    resetSec.hidden   = (state !== 'result');
    warning.hidden    = (state !== 'error');

    // Input/button disabled during submitting
    var busy = (state === 'submitting');
    input.disabled = busy;
    submitBtn.disabled = busy || (input.value.trim().length < 20);
  }

  // ── Input handler ─────────────────────────────────────────────────────────

  function onInput() {
    var input     = document.getElementById('brief-input');
    var submitBtn = document.getElementById('submit-btn');
    var len = input.value.trim().length;
    submitBtn.disabled = (len < 20) || (state === 'submitting');
  }

  function onKeydown(e) {
    var input = document.getElementById('brief-input');
    // Block additional characters once at 2000 (allow navigation + delete keys)
    if (input.value.length >= 2000 &&
        !e.ctrlKey && !e.metaKey && !e.altKey &&
        e.key.length === 1) {
      e.preventDefault();
    }
  }

  // ── Loading copy rotation ─────────────────────────────────────────────────

  var LOADING_LINES = [
    'Reviewing the brief.',
    'Drafting the advert.',
    'Building the scorecard.',
    'Polishing the spec.',
  ];
  var loadingInterval = null;
  var loadingIdx = 0;

  function startLoadingRotation() {
    loadingIdx = 0;
    var copyEl = document.getElementById('loading-copy');
    if (copyEl) copyEl.textContent = LOADING_LINES[0];
    loadingInterval = setInterval(function () {
      loadingIdx = (loadingIdx + 1) % LOADING_LINES.length;
      var el = document.getElementById('loading-copy');
      if (el) el.textContent = LOADING_LINES[loadingIdx];
    }, 1500);
  }

  function stopLoadingRotation() {
    if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
    }
  }

  // ── Fetch + submit flow ───────────────────────────────────────────────────

  function doSubmit() {
    var input = document.getElementById('brief-input');
    var brief = input.value.trim();

    if (brief.length < 20) return;

    var outputRgn = document.getElementById('output-region');
    outputRgn.innerHTML = ''; // clear previous results safely

    setState('submitting');
    startLoadingRotation();

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 30000);

    fetch('/api/alex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brief: brief }),
      signal: controller.signal,
    })
      .then(function (res) {
        clearTimeout(timeoutId);
        stopLoadingRotation();
        if (!res.ok) {
          throw new Error('non-ok response: ' + res.status);
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.output) {
          throw new Error('empty output in response');
        }
        renderOutput(data.output);
        setState('result');
        // Smooth-scroll to first output card
        var firstCard = document.querySelector('#output-region .output-card');
        if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function (err) {
        clearTimeout(timeoutId);
        stopLoadingRotation();
        console.error('alex submit failed:', err, { briefLength: brief.length });
        setState('error');
      });
  }

  // ── Section parser ────────────────────────────────────────────────────────

  function parseSections(text) {
    var sections = {};
    var parts = text.split(/^## /m);
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part.trim()) continue;
      var newlineIdx = part.indexOf('\n');
      if (newlineIdx === -1) continue;
      var title = part.slice(0, newlineIdx).trim();
      var body  = part.slice(newlineIdx + 1).trim();
      sections[title] = body;
    }
    return sections;
  }

  // ── Markdown renderer (~40 lines, no library, no innerHTML on model text) ──

  function markdownToHtml(md) {
    var frag = document.createDocumentFragment();
    var lines = md.split('\n');
    var i = 0;
    var currentList = null;
    var currentListType = null; // 'ul' | 'ol'
    var inTable = false;
    var tableEl = null;
    var tableHead = true;

    function flushList() {
      if (currentList) {
        frag.appendChild(currentList);
        currentList = null;
        currentListType = null;
      }
    }

    function flushTable() {
      if (tableEl) {
        frag.appendChild(tableEl);
        tableEl = null;
        inTable = false;
        tableHead = true;
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      // Blank line
      if (line.trim() === '') {
        flushList();
        flushTable();
        i++;
        continue;
      }

      // ### heading → h4 (since ## becomes h3 in PLAN notes; model uses ## inside sections)
      if (/^## /.test(line)) {
        flushList(); flushTable();
        var h = document.createElement('h3');
        h.textContent = line.slice(3).trim();
        frag.appendChild(h);
        i++;
        continue;
      }

      // Table row: line starts and ends with |
      if (/^\|/.test(line) && /\|$/.test(line.trim())) {
        if (!inTable) {
          inTable = true;
          tableEl = document.createElement('table');
          tableHead = true;
        }
        // Skip separator rows (---|---|)
        if (/^\|[\s\-|:]+\|$/.test(line.trim())) {
          tableHead = false;
          i++;
          continue;
        }
        var cells = line.trim().split('|').slice(1, -1);
        var rowEl = document.createElement('tr');
        for (var c = 0; c < cells.length; c++) {
          var cellEl = tableHead
            ? document.createElement('th')
            : document.createElement('td');
          cellEl.textContent = cells[c].trim();
          rowEl.appendChild(cellEl);
        }
        tableEl.appendChild(rowEl);
        i++;
        continue;
      }

      flushTable();

      // Unordered list
      if (/^- /.test(line)) {
        if (currentListType !== 'ul') {
          flushList();
          currentList = document.createElement('ul');
          currentListType = 'ul';
        }
        var li = document.createElement('li');
        appendInline(li, line.slice(2));
        currentList.appendChild(li);
        i++;
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        if (currentListType !== 'ol') {
          flushList();
          currentList = document.createElement('ol');
          currentListType = 'ol';
        }
        var oli = document.createElement('li');
        appendInline(oli, line.replace(/^\d+\.\s/, ''));
        currentList.appendChild(oli);
        i++;
        continue;
      }

      flushList();

      // Plain paragraph line
      var p = document.createElement('p');
      appendInline(p, line);
      frag.appendChild(p);
      i++;
    }

    flushList();
    flushTable();
    return frag;
  }

  // Apply inline formatting: **bold** → <strong>, rest as textContent
  function appendInline(parent, text) {
    // Split on **...**
    var parts = text.split(/\*\*([^*]+)\*\*/g);
    for (var j = 0; j < parts.length; j++) {
      if (j % 2 === 0) {
        // Plain text
        if (parts[j]) parent.appendChild(document.createTextNode(parts[j]));
      } else {
        // Bold
        var strong = document.createElement('strong');
        strong.textContent = parts[j];
        parent.appendChild(strong);
      }
    }
  }

  // ── Output renderer ───────────────────────────────────────────────────────

  function renderOutput(text) {
    var outputRgn = document.getElementById('output-region');
    outputRgn.innerHTML = ''; // safe: clearing, not inserting model text

    var sections = parseSections(text);
    var adText = sections['LINKEDIN JOB ADVERT'];

    if (!adText) {
      // Fallback: raw output card
      var fallback = buildCard(false);
      var tag = document.createElement('div');
      tag.className = 'output-tag';
      tag.textContent = 'RAW OUTPUT (COULD NOT PARSE EXPECTED SECTIONS)';
      fallback.appendChild(tag);
      var pre = document.createElement('pre');
      pre.textContent = text; // safe: textContent
      fallback.appendChild(pre);
      outputRgn.appendChild(fallback);
      return;
    }

    // ── Card 1: LinkedIn Job Advert (hero) ───────────────────────────────────
    var heroCard = buildCard(true);

    var heroTag = document.createElement('div');
    heroTag.className = 'output-tag output-tag--gold';
    heroTag.textContent = 'OUTPUT 01 — LINKEDIN JOB ADVERT';
    heroCard.appendChild(heroTag);

    var pre = document.createElement('pre');
    pre.textContent = adText; // safe: textContent, preserves emojis + line breaks
    heroCard.appendChild(pre);

    var heroActions = document.createElement('div');
    heroActions.className = 'output-card-actions';

    var heroCopyBtn = buildCopyButton(adText);
    heroActions.appendChild(heroCopyBtn);

    var postBtn = document.createElement('button');
    postBtn.className = 'cta-button cta-button--blue';
    postBtn.textContent = 'Post to LinkedIn →';
    postBtn.addEventListener('click', function () {
      var text = adText;
      var wasTruncated = false;
      if (text.length > 2000) {
        text = text.slice(0, 1950) + '…';
        wasTruncated = true;
        console.warn('LinkedIn ad truncated to 1950 chars (original: ' + adText.length + ')');
      }
      var url = 'https://www.linkedin.com/feed/?shareActive=true&text=' +
                encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
      if (wasTruncated) {
        showTruncationPill(heroActions);
      }
    });
    heroActions.appendChild(postBtn);
    heroCard.appendChild(heroActions);

    outputRgn.appendChild(heroCard);

    // ── Card 2: Job Specification ────────────────────────────────────────────
    var specCard = buildCard(false);

    var specTag = document.createElement('div');
    specTag.className = 'output-tag';
    specTag.textContent = 'OUTPUT 02 — JOB SPECIFICATION';
    specCard.appendChild(specTag);

    var specContent = sections['JOB SPECIFICATION'] || '';
    if (specContent) {
      specCard.appendChild(markdownToHtml(specContent));
      var specActions = document.createElement('div');
      specActions.className = 'output-card-actions';
      specActions.appendChild(buildCopyButton(specContent));
      specCard.appendChild(specActions);
    } else {
      var specFallback = document.createElement('p');
      specFallback.textContent = '(Job Specification not found in output)';
      specCard.appendChild(specFallback);
    }

    outputRgn.appendChild(specCard);

    // ── Card 3: Interview Scorecard ──────────────────────────────────────────
    var scoreCard = buildCard(false);

    var scoreTag = document.createElement('div');
    scoreTag.className = 'output-tag';
    scoreTag.textContent = 'OUTPUT 03 — INTERVIEW SCORECARD';
    scoreCard.appendChild(scoreTag);

    var scoreContent = sections['INTERVIEW SCORECARD'] || '';
    if (scoreContent) {
      scoreCard.appendChild(markdownToHtml(scoreContent));
      var scoreActions = document.createElement('div');
      scoreActions.className = 'output-card-actions';
      scoreActions.appendChild(buildCopyButton(scoreContent));
      scoreCard.appendChild(scoreActions);
    } else {
      var scoreFallback = document.createElement('p');
      scoreFallback.textContent = '(Interview Scorecard not found in output)';
      scoreCard.appendChild(scoreFallback);
    }

    outputRgn.appendChild(scoreCard);
  }

  // ── Copy button ───────────────────────────────────────────────────────────

  function buildCopyButton(text) {
    var btn = document.createElement('button');
    btn.className = 'cta-button cta-button--ghost';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-success') || btn.classList.contains('is-error')) {
        return;
      }
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showCopyFeedback(btn, false);
        console.error('clipboard api unavailable');
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () { showCopyFeedback(btn, true); },
        function (err) {
          showCopyFeedback(btn, false);
          console.error('clipboard write failed:', err && err.message);
        }
      );
    });
    return btn;
  }

  function showCopyFeedback(btn, ok) {
    if (btn._feedbackTimer) {
      clearTimeout(btn._feedbackTimer);
    }
    btn.textContent = ok ? 'Copied ✓' : 'Copy failed';
    btn.classList.add(ok ? 'is-success' : 'is-error');
    btn._feedbackTimer = setTimeout(function () {
      btn.classList.remove('is-success', 'is-error');
      btn.textContent = 'Copy';
      btn._feedbackTimer = null;
    }, 1500);
  }

  function showTruncationPill(container) {
    // Idempotent — only one pill at a time
    var existing = container.querySelector('.truncation-pill');
    if (existing) existing.remove();
    var pill = document.createElement('span');
    pill.className = 'truncation-pill';
    pill.textContent = 'Trimmed to fit LinkedIn (2k limit)';
    container.appendChild(pill);
    setTimeout(function () { pill.remove(); }, 4000);
  }

  // Helper: create an output card element
  function buildCard(hero) {
    var card = document.createElement('div');
    card.className = hero ? 'output-card output-card--hero' : 'output-card';
    return card;
  }

  // ── Reset handler ─────────────────────────────────────────────────────────

  function doReset() {
    var input     = document.getElementById('brief-input');
    var outputRgn = document.getElementById('output-region');
    var copyBtns  = outputRgn.querySelectorAll('.cta-button--ghost');
    for (var k = 0; k < copyBtns.length; k++) {
      if (copyBtns[k]._feedbackTimer) {
        clearTimeout(copyBtns[k]._feedbackTimer);
        copyBtns[k]._feedbackTimer = null;
      }
    }
    outputRgn.innerHTML = '';
    input.value = '';
    setState('idle');
    input.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Pitcher shortcut: Cmd/Ctrl+Shift+P ───────────────────────────────────

  function onDocKeydown(e) {
    var mod = e.metaKey || e.ctrlKey;
    if (mod && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      var input = document.getElementById('brief-input');
      input.value = BRIEF_REHEARSAL;
      input.dispatchEvent(new Event('input'));
      input.focus();
    }
  }

  // ── Wire everything on DOMContentLoaded ──────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var input     = document.getElementById('brief-input');
    var submitBtn = document.getElementById('submit-btn');
    var retryBtn  = document.getElementById('retry-btn');
    var resetBtn  = document.getElementById('reset-btn');

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);

    submitBtn.addEventListener('click', doSubmit);

    retryBtn.addEventListener('click', function () {
      doSubmit();
    });

    resetBtn.addEventListener('click', doReset);

    document.addEventListener('keydown', onDocKeydown);

    // Initial render (sets correct disabled/hidden state)
    render();
  });

}());
