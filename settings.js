// settings.js — Crisp Settings Page Logic

(function () {
  "use strict";

  const modelRadios = document.querySelectorAll('input[name="model"]');
  const apiKeyInput = document.getElementById("api-key-input");
  const toggleVisBtn = document.getElementById("toggle-vis");
  const saveBtn = document.getElementById("save-btn");
  const statusBanner = document.getElementById("status-banner");
  const keyLabel = document.getElementById("key-label");

  const KEY_LABELS = {
    gemini: "Google AI API Key",
    groq: "Groq Cloud API Key",
  };

  const KEY_PLACEHOLDERS = {
    gemini: "AIza…",
    groq: "gsk_…",
  };

  // ── Load saved settings ──────────────────────────────────────
  chrome.storage.sync.get(["crispModel", "crispApiKey"], (data) => {
    const savedModel = data.crispModel || "gemini";
    const savedKey = data.crispApiKey || "";

    const radio = document.querySelector(`input[value="${savedModel}"]`);
    if (radio) radio.checked = true;

    apiKeyInput.value = savedKey;
    updateKeyLabel(savedModel);
  });

  // ── Model radio change ──────────────────────────────────────
  modelRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        updateKeyLabel(radio.value);
        apiKeyInput.value = "";
        apiKeyInput.focus();
      }
    });
  });

  function updateKeyLabel(model) {
    keyLabel.textContent = KEY_LABELS[model] || "API Key";
    apiKeyInput.placeholder = KEY_PLACEHOLDERS[model] || "Paste your API key here…";
  }

  function getSelectedModel() {
    for (const r of modelRadios) {
      if (r.checked) return r.value;
    }
    return "gemini";
  }

  // ── Toggle key visibility ───────────────────────────────────
  toggleVisBtn.addEventListener("click", () => {
    const isHidden = apiKeyInput.type === "password";
    apiKeyInput.type = isHidden ? "text" : "password";
    toggleVisBtn.textContent = isHidden ? "🙈" : "👁";
  });

  // ── Save ────────────────────────────────────────────────────
  saveBtn.addEventListener("click", () => {
    const model = getSelectedModel();
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      showStatus("Please enter your API key.", "error");
      apiKeyInput.focus();
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving…";

    chrome.storage.sync.set({ crispModel: model, crispApiKey: apiKey }, () => {
      if (chrome.runtime.lastError) {
        showStatus("Failed to save: " + chrome.runtime.lastError.message, "error");
      } else {
        showStatus("✓ Settings saved!", "success");
      }
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Settings";
    });
  });

  // ── Status banner ───────────────────────────────────────────
  let statusTimer = null;

  function showStatus(msg, type) {
    statusBanner.textContent = msg;
    statusBanner.className = `status-banner ${type} visible`;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      statusBanner.classList.remove("visible");
    }, 3000);
  }

  // ── Enter key to save ───────────────────────────────────────
  apiKeyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveBtn.click();
  });
})();
