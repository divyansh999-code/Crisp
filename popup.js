// popup.js — Crisp Popup Logic

(function () {
  "use strict";

  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  const modelChip = document.getElementById("model-chip");
  const settingsBtn = document.getElementById("settings-btn");

  const MODEL_NAMES = { gemini: "Gemini", groq: "Groq" };

  // Load current settings and show status
  chrome.storage.sync.get(["crispModel", "crispApiKey"], (data) => {
    const hasKey = !!(data.crispApiKey && data.crispApiKey.trim());
    const model = data.crispModel || "gemini";

    if (hasKey) {
      statusDot.classList.add("active");
      statusText.textContent = "Active on claude.ai";
      modelChip.textContent = MODEL_NAMES[model] || model;
      modelChip.style.display = "";
    } else {
      statusDot.classList.add("inactive");
      statusText.textContent = "No API key set";
      modelChip.style.display = "none";
    }
  });

  // Open settings page
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
})();
