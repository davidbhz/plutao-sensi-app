const isAndroid = /Android/i.test(navigator.userAgent || "");
const lowMemory = Number(navigator.deviceMemory || 0) > 0 && Number(navigator.deviceMemory) <= 4;
const forcedLowPerformance = location.search.indexOf("low-performance=1") !== -1;

if (isAndroid || lowMemory || forcedLowPerformance) {
  document.documentElement.classList.add("low-performance-mode");
  document.body.classList.add("low-performance-mode");
}

const optionSections = [
  {
    title: "Configurações do jogo",
    items: [
      {
        id: "smooth-screen",
        title: "Ativar suavidade de tela PRO",
        message: "Suavidade de tela ativada",
        feedback: "Melhora aplicada: resposta mais lisa no toque."
      },
      {
        id: "trick-button",
        title: "Ativar botão trick PRO",
        message: "Botão trick PRO ativado",
        feedback: "Melhora aplicada: mais controle nos comandos."
      },
      {
        id: "delay-reduction",
        title: "Ativar reduzimento de delay PRO",
        message: "Reduzimento de delay ativado",
        feedback: "Melhora aplicada: menor sensação de atraso."
      }
    ]
  },
  {
    title: "Configurações do celular",
    items: [
      {
        id: "noise-clean",
        title: "Reduzir travamento no jogo",
        message: "Limpeza de ruído concluída",
        feedback: "Melhora aplicada: experiência mais limpa e estável."
      },
      {
        id: "fps-optimized",
        title: "Ativar otimização de FPS PRO",
        message: "FPS otimizado com sucesso",
        feedback: "Melhora aplicada: mais estabilidade visual."
      },
      {
        id: "anti-lag",
        title: "Ativar anti lag PRO",
        message: "Anti lag PRO ativado",
        feedback: "Melhora aplicada: menos sensação de travamento."
      }
    ]
  },
  {
    title: "Calibração de Mira",
    items: [
      {
        id: "touch-optimized",
        title: "Otimizar toque de tela",
        message: "Toque otimizado com sucesso",
        feedback: "Melhora aplicada: resposta de toque mais confortável."
      },
      {
        id: "scope-2x",
        title: "Otimizar Mira 2X",
        message: "Mira 2X otimizada com sucesso",
        feedback: "Melhora aplicada: mais controle com mira 2X."
      },
      {
        id: "scope-4x",
        title: "Otimizar Mira 4X",
        message: "Mira 4X otimizada com sucesso",
        feedback: "Melhora aplicada: mais controle com mira 4X."
      },
      {
        id: "fast-aim",
        title: "Ativar mira rápida em movimento",
        message: "Mira rápida calibrada",
        feedback: "Melhora aplicada: mais controle durante movimentação."
      }
    ]
  }
];

const trainings = [
  {
    id: "aim-training",
    message: "Ótimo, a caminho da evolução",
    title: "Treino de mira",
    description: "Treine por mais de 30 minutos na ilha de treinamento. Nos primeiros 15 minutos aqueça a mira com os bonecos parados. Nos 15 minutos restantes, treine com os players da ilha.",
    feedback: "Treino concluído. Sua mira está aquecida."
  },
  {
    id: "aim-movement",
    message: "Aposto que sua sensi está insana",
    title: "Treino de mira e movimento",
    description: "Treine sua puxada de capa enquanto se movimenta. Evite ao máximo atirar parado. Atirar em movimento ajuda no controle da subida de capa.",
    feedback: "Movimentação treinada com sucesso."
  },
  {
    id: "kills-training",
    message: "Parabéns, isso é o que esperamos dos alunos",
    title: "Faça kills",
    description: "Faça pelo menos 80 kills na ilha de treinamento. Coloque a sensibilidade em prática e treine sua movimentação.",
    feedback: "Meta de treino marcada como concluída."
  },
  {
    id: "scope-2x-training",
    message: "Controle sua mira 2X",
    title: "Treino com mira 2X",
    description: "Treine puxadas curtas com a mira 2X e mantenha o controle no alvo.",
    feedback: "Mira 2X treinada com sucesso."
  },
  {
    id: "ranked-training",
    message: "Pronto para ranquear",
    title: "Treino ranked",
    description: "Jogue partidas ranqueadas focando em controle, movimentação e consistência. Não troque sua sensi toda hora.",
    feedback: "Treino ranked concluído."
  }
];

const sensitivityProfiles = {
  "Mais capa": { "Geral": 96, "Red Dot": 92, "Mira 2X": 86, "Mira 4X": 78, "AWM": 58, "Olhadinha": 68 },
  "Mais controle": { "Geral": 88, "Red Dot": 84, "Mira 2X": 78, "Mira 4X": 70, "AWM": 50, "Olhadinha": 60 },
  "Equilibrado": { "Geral": 92, "Red Dot": 88, "Mira 2X": 82, "Mira 4X": 74, "AWM": 54, "Olhadinha": 64 },
  "Celular fraco": { "Geral": 90, "Red Dot": 86, "Mira 2X": 80, "Mira 4X": 72, "AWM": 52, "Olhadinha": 62 },
  "Jogabilidade lisa": { "Geral": 94, "Red Dot": 90, "Mira 2X": 84, "Mira 4X": 76, "AWM": 56, "Olhadinha": 66 }
};

const screenTitles = {
  home: "Auxílio PRO",
  config: "Configurações do jogo",
  training: "Aquecimento de mira",
  sensi: "Sensibilidade ideal"
};

const storageKeys = {
  options: "plutao-sensi-options",
  trainings: "plutao-sensi-trainings",
  sensitivity: "plutao-sensi-last"
};

let activeOptions = readStoredObject(storageKeys.options);
let completedTrainings = readStoredObject(storageKeys.trainings);
let toastTimer;
let deferredInstallPrompt;

const configSections = document.querySelector("#config-sections");
const trainingList = document.querySelector("#training-list");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toast-message");
const backButton = document.querySelector("#back-button");
const installButton = document.querySelector("#install-button");

function readStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function writeStoredObject(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app remains usable if private browsing blocks local storage.
  }
}

function renderOptions() {
  configSections.innerHTML = optionSections.map((section) => `
    <section class="option-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">AJUSTES PRO</span>
          <h2>${section.title}</h2>
        </div>
        <span class="section-count">${section.items.length} opções</span>
      </div>
      <div class="option-list">
        ${section.items.map((item) => {
          const active = Boolean(activeOptions[item.id]);
          return `
            <article class="option-card${active ? " active" : ""}" id="option-${item.id}">
              <div class="message-strip">
                <span class="message-dot"></span>
                <span>${active ? item.message : "Pronto para ativar"}</span>
              </div>
              <button class="option-main" type="button" onclick="activateOption('${item.id}')" aria-pressed="${active}">
                <span class="option-copy">
                  <strong>${item.title}</strong>
                  <span>Toque para ${active ? "desativar" : "ativar"}</span>
                </span>
                <span class="toggle" aria-hidden="true"></span>
              </button>
              <div class="feedback"><div><p>${item.feedback}</p></div></div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
}

function renderTrainings() {
  trainingList.innerHTML = trainings.map((training, index) => {
    const active = Boolean(completedTrainings[training.id]);
    return `
      <article class="training-card${active ? " active" : ""}" id="training-${training.id}">
        <div class="message-strip">
          <span class="message-dot"></span>
          <span>${training.message}</span>
        </div>
        <h2 class="training-title">${String(index + 1).padStart(2, "0")} · ${training.title}</h2>
        <p class="training-description">${training.description}</p>
        <button class="training-complete" type="button" onclick="toggleTraining('${training.id}')" aria-pressed="${active}">
          <span class="custom-check" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12l4 4L19 6"/></svg>
          </span>
          <span>${active ? "Concluído" : "Já concluí"}</span>
        </button>
        <div class="feedback"><div><p>${training.feedback}</p></div></div>
      </article>
    `;
  }).join("");

  updateProgress();
}

function activateOption(id) {
  const item = optionSections.flatMap((section) => section.items).find((option) => option.id === id);
  if (!item) return;

  activeOptions[id] = !activeOptions[id];
  writeStoredObject(storageKeys.options, activeOptions);
  renderOptions();

  const card = document.querySelector(`#option-${id}`);
  if (activeOptions[id] && card) {
    card.classList.add("just-activated");
    showToast("Ativado com sucesso");
    vibrate();
  } else {
    showToast("Ajuste desativado");
  }

  updateHomeStats();
}

function toggleTraining(id) {
  const training = trainings.find((item) => item.id === id);
  if (!training) return;

  completedTrainings[id] = !completedTrainings[id];
  writeStoredObject(storageKeys.trainings, completedTrainings);
  renderTrainings();

  const card = document.querySelector(`#training-${id}`);
  if (completedTrainings[id] && card) {
    card.classList.add("just-activated");
    showToast("Treino concluído com sucesso");
    vibrate();
  } else {
    showToast("Conclusão removida");
  }

  updateHomeStats();
}

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(35);
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2000);
}

function navigateTo(screenName) {
  const target = document.querySelector(`[data-screen="${screenName}"]`);
  if (!target) return;

  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen === target));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.go === screenName));
  document.querySelector("#screen-title").textContent = screenTitles[screenName];
  backButton.classList.toggle("visible", screenName !== "home");
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    history.replaceState(null, "", `#${screenName}`);
  } catch {
    // Hash navigation is optional when opened from a restricted local context.
  }
}

function updateProgress() {
  const completed = trainings.filter((training) => completedTrainings[training.id]).length;
  document.querySelector("#training-progress").textContent = `${completed}/${trainings.length}`;
}

function updateHomeStats() {
  const optionCount = optionSections.flatMap((section) => section.items).filter((item) => activeOptions[item.id]).length;
  const trainingCount = trainings.filter((training) => completedTrainings[training.id]).length;
  document.querySelector("#home-option-count").textContent = `${optionCount}/10`;
  document.querySelector("#home-training-count").textContent = `${trainingCount}/5`;
}

function generateSensitivity(brand, profile, shouldToast = true) {
  const values = sensitivityProfiles[profile] || sensitivityProfiles.Equilibrado;
  const result = document.querySelector("#sensi-result");
  const valuesContainer = document.querySelector("#sensi-values");

  document.querySelector("#result-brand").textContent = brand;
  document.querySelector("#result-profile").textContent = profile;
  valuesContainer.innerHTML = Object.entries(values).map(([label, value]) => `
    <div class="sensi-value">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  result.hidden = false;
  result.classList.remove("reveal");
  void result.offsetWidth;
  result.classList.add("reveal");

  writeStoredObject(storageKeys.sensitivity, { brand, profile });
  if (shouldToast) {
    showToast("Sensibilidade gerada com sucesso");
    vibrate();
    window.setTimeout(() => result.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
  }
}

function restoreSensitivity() {
  const last = readStoredObject(storageKeys.sensitivity);
  if (!last.brand || !last.profile) return;

  document.querySelector("#brand").value = last.brand;
  document.querySelector("#profile").value = last.profile;
  generateSensitivity(last.brand, last.profile, false);
}

document.addEventListener("click", (event) => {
  const navigationButton = event.target.closest("[data-go]");
  if (navigationButton) {
    navigateTo(navigationButton.dataset.go);
  }
});

backButton.addEventListener("click", () => navigateTo("home"));

document.querySelector("#sensi-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  generateSensitivity(form.get("brand"), form.get("profile"));
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
  showToast("App instalado com sucesso");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // PWA caching is unavailable when the files are opened without a web server.
    });
  });
}

renderOptions();
renderTrainings();
restoreSensitivity();
updateHomeStats();
navigateTo(location.hash.replace("#", "") || "home");

window.activateOption = activateOption;
window.toggleTraining = toggleTraining;
