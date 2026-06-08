// app.js — Frontend logic for Career Copilot Mini MVP

const roleSelect = document.getElementById('role-select');
const generateBtn = document.getElementById('generate-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const resultsSection = document.getElementById('results-section');
const questionsContainer = document.getElementById('questions-container');
const resultsBadge = document.getElementById('results-badge');
const resultsSubtitle = document.getElementById('results-subtitle');
const restartBtn = document.getElementById('restart-btn');
const errorBanner = document.getElementById('error-banner');
const errorText = document.getElementById('error-text');
const demoBanner = document.getElementById('demo-banner');
const roleError = document.getElementById('role-error');
const levelError = document.getElementById('level-error');
const expBtns = document.querySelectorAll('.experience-btn');

let selectedLevel = null;

// --- Experience level selection ---
expBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    expBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedLevel = btn.dataset.level;
    levelError.classList.remove('visible');
  });
});

// --- Generate button ---
generateBtn.addEventListener('click', async () => {
  const role = roleSelect.value;
  let valid = true;

  if (!role) {
    roleError.classList.add('visible');
    valid = false;
  } else {
    roleError.classList.remove('visible');
  }

  if (!selectedLevel) {
    levelError.classList.add('visible');
    valid = false;
  } else {
    levelError.classList.remove('visible');
  }

  if (!valid) return;

  setLoading(true);
  hideMessages();

  try {
    const result = await generateKit(role, selectedLevel);
    renderResults(role, selectedLevel, result.questions, result.isDemo);
  } catch (err) {
    showError('Something went wrong. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
});

// --- Restart button ---
restartBtn.addEventListener('click', () => {
  resultsSection.classList.add('hidden');
  questionsContainer.innerHTML = '';
  hideMessages();
  roleSelect.value = '';
  expBtns.forEach(b => b.classList.remove('selected'));
  selectedLevel = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Render results ---
function renderResults(role, level, questions, isDemo) {
  questionsContainer.innerHTML = '';
  resultsBadge.textContent = `${level} · ${role}`;
  resultsSubtitle.textContent = `${questions.length} personalized questions ready for practice`;

  questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-header">
        <div class="question-number">${i + 1}</div>
        <div class="question-text">${escapeHtml(q.question)}</div>
        <span class="toggle-icon">▾</span>
      </div>
      <div class="question-body">
        <hr class="divider" />
        <div class="ai-section">
          <div class="ai-section-label">✦ What the interviewer wants to know</div>
          <div class="ai-section-text">${escapeHtml(q.intent)}</div>
        </div>
        <div class="ai-section">
          <div class="ai-section-label">📋 Suggested answer structure</div>
          <div class="ai-section-text">${escapeHtml(q.structure)}</div>
        </div>
        <div class="ai-section">
          <div class="ai-section-label">💬 Example answer</div>
          <div class="ai-section-text">${escapeHtml(q.example)}</div>
        </div>
      </div>
    `;

    // Toggle open/close
    card.querySelector('.question-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });

    questionsContainer.appendChild(card);
  });

  resultsSection.classList.remove('hidden');

  if (isDemo) {
    demoBanner.classList.remove('hidden');
  }

  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- UI helpers ---
function setLoading(on) {
  generateBtn.disabled = on;
  btnText.classList.toggle('hidden', on);
  btnLoader.classList.toggle('hidden', !on);
}

function showError(msg) {
  errorText.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function hideMessages() {
  errorBanner.classList.add('hidden');
  demoBanner.classList.add('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}