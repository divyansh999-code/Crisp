/**
 * Crisp — Content Script
 * Runs on claude.ai — injects the "Crisp ✦" button and confirmation UI.
 */

(function () {
  "use strict";

  const CRISP_BTN_ID = "crisp-rewrite-btn";
  const CRISP_MODAL_ID = "crisp-modal-overlay";

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function getInputBox() {
    // Claude uses a contenteditable div for its input
    return (
      document.querySelector('div[contenteditable="true"][data-placeholder]') ||
      document.querySelector('div[contenteditable="true"].ProseMirror') ||
      document.querySelector('div[contenteditable="true"]')
    );
  }

  function getInputText(box) {
    return box ? box.innerText.trim() : "";
  }

  function setInputText(box, text) {
    if (!box) return;
    // Focus the box first
    box.focus();
    // Select all and delete
    document.execCommand("selectAll", false, null);
    document.execCommand("delete", false, null);
    // Insert new text — triggers React state update
    document.execCommand("insertText", false, text);
    // Also dispatch an input event for good measure
    box.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // ─── Button Injection ────────────────────────────────────────────────────

  function findSendButton() {
    return document.querySelector('button[aria-label="Send message"]');
  }

  function injectCrispButton() {
    if (document.getElementById(CRISP_BTN_ID)) return true;

    const sendBtn = findSendButton();
    if (!sendBtn) return false;

    const area = sendBtn.parentElement;
    if (!area) return false;

    const btn = document.createElement("button");
    btn.id = CRISP_BTN_ID;
    btn.className = "crisp-btn";
    btn.title = "Rewrite with Crisp";
    btn.innerHTML = `<span class="crisp-icon">✦</span><span class="crisp-label">Crisp</span>`;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleCrispClick();
    });

    // Insert before the send button
    area.insertBefore(btn, sendBtn);
    return true;
  }

  // ─── Rewrite Logic ───────────────────────────────────────────────────────

  async function handleCrispClick() {
    const box = getInputBox();
    const original = getInputText(box);

    if (!original) {
      showToast("Type a prompt first.");
      return;
    }

    const { model, apiKey } = await getSettings();

    if (!apiKey) {
      showToast("Add your API key in Crisp Settings.");
      openSettings();
      return;
    }

    const btn = document.getElementById(CRISP_BTN_ID);
    btn.classList.add("crisp-loading");
    btn.innerHTML = `<span class="crisp-spinner"></span><span class="crisp-label">Rewriting…</span>`;
    btn.disabled = true;

    try {
      const rewritten = await rewritePrompt(original, model, apiKey);
      btn.classList.remove("crisp-loading");
      btn.innerHTML = `<span class="crisp-icon">✦</span><span class="crisp-label">Crisp</span>`;
      btn.disabled = false;
      showConfirmationModal(original, rewritten, box);
    } catch (err) {
      btn.classList.remove("crisp-loading");
      btn.innerHTML = `<span class="crisp-icon">✦</span><span class="crisp-label">Crisp</span>`;
      btn.disabled = false;
      showToast(`Error: ${err.message}`);
    }
  }

  async function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["crispModel", "crispApiKey"], (data) => {
        resolve({
          model: data.crispModel || "gemini",
          apiKey: data.crispApiKey || "",
        });
      });
    });
  }

  const SYSTEM_PROMPT = `You are a prompt rewriter. You do NOT answer prompts. You do NOT explain anything. You ONLY rewrite.

RULE 1: If input is social/casual/emotional → return it EXACTLY as-is. No changes.

RULE 2: If input is a task/question/request → rewrite it as a shorter, cleaner version of the SAME question. You are rewriting the QUESTION, not answering it. Never answer. Never explain.

EXAMPLE:
Input: 'I was wondering if you could please explain how transformers work in simple terms'
Output: 'Explain how transformers work. Simple terms.\nBe concise. No filler. Answer only what is asked.'

Remove padding. Keep the ask. Append 'Be concise. No filler. Answer only what is asked.' on a new line.

Return only the rewritten prompt. Nothing else. If you answer the question, you have failed.`;

  async function rewritePrompt(text, model, apiKey) {
    if (model === "gemini") {
      return await callGemini(text, apiKey);
    } else {
      return await callGroq(text, apiKey);
    }
  }

  async function callGemini(text, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\n\nUser prompt to rewrite:\n" + text }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err?.error?.message || `Gemini API error ${res.status}`
      );
    }

    const data = await res.json();
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!output) throw new Error("Empty response from Gemini.");
    return output;
  }

  async function callGroq(text, apiKey) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      max_tokens: 500,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err?.error?.message || `Groq API error ${res.status}`
      );
    }

    const data = await res.json();
    const output = data?.choices?.[0]?.message?.content?.trim();
    if (!output) throw new Error("Empty response from Groq.");
    return output;
  }

  // ─── Confirmation Modal ──────────────────────────────────────────────────

  function showConfirmationModal(original, rewritten, inputBox) {
    removeModal();

    const overlay = document.createElement("div");
    overlay.id = CRISP_MODAL_ID;
    overlay.className = "crisp-overlay";

    const tokenSavings = estimateTokenDiff(original, rewritten);

    overlay.innerHTML = `
      <div class="crisp-modal" role="dialog" aria-modal="true" aria-label="Crisp prompt comparison">
        <div class="crisp-modal-header">
          <span class="crisp-modal-title"><span class="crisp-icon-sm">✦</span> Crisp Rewrite</span>
          ${tokenSavings !== null ? `<span class="crisp-badge">${tokenSavings > 0 ? `~${tokenSavings} tokens saved` : "Optimized"}</span>` : ""}
          <button class="crisp-close-btn" aria-label="Close">&times;</button>
        </div>

        <div class="crisp-compare">
          <div class="crisp-panel crisp-original">
            <span class="crisp-panel-label">Original</span>
            <div class="crisp-panel-text">${escapeHtml(original)}</div>
          </div>
          <div class="crisp-divider">→</div>
          <div class="crisp-panel crisp-rewritten">
            <span class="crisp-panel-label">Rewritten</span>
            <div class="crisp-panel-text">${escapeHtml(rewritten)}</div>
          </div>
        </div>

        <div class="crisp-actions">
          <button class="crisp-action-btn crisp-keep-btn" id="crisp-keep-btn">Keep original</button>
          <button class="crisp-action-btn crisp-use-btn" id="crisp-use-btn">Use this ✦</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".crisp-close-btn").addEventListener("click", removeModal);
    overlay.querySelector("#crisp-keep-btn").addEventListener("click", removeModal);
    overlay.querySelector("#crisp-use-btn").addEventListener("click", () => {
      setInputText(inputBox, rewritten);
      removeModal();
    });

    // Close on backdrop click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) removeModal();
    });

    // Animate in
    requestAnimationFrame(() => overlay.classList.add("crisp-overlay-visible"));
  }

  function removeModal() {
    const existing = document.getElementById(CRISP_MODAL_ID);
    if (!existing) return;
    existing.classList.remove("crisp-overlay-visible");
    setTimeout(() => existing.remove(), 220);
  }

  function estimateTokenDiff(original, rewritten) {
    // Rough estimate: 1 token ≈ 4 chars
    const origTokens = Math.ceil(original.length / 4);
    const newTokens = Math.ceil(rewritten.length / 4);
    return origTokens - newTokens;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br>");
  }

  // ─── Toast ───────────────────────────────────────────────────────────────

  function showToast(msg) {
    const existing = document.getElementById("crisp-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "crisp-toast";
    toast.className = "crisp-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("crisp-toast-visible"));
    setTimeout(() => {
      toast.classList.remove("crisp-toast-visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function openSettings() {
    chrome.runtime.sendMessage({ action: "openSettings" });
  }

  // ─── Core Injection Logic ────────────────────────────────────────────────

  let retryCount = 0;
  const retryInterval = 500;
  const maxRetries = 20; // 10 seconds total

  function startInjectionLoop() {
    if (injectCrispButton()) {
      return; // Success
    }
    
    if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(startInjectionLoop, retryInterval);
    }
  }

  // Robust observer to catch any DOM changes including hydration/navigation
  const observer = new MutationObserver(() => {
    if (!document.getElementById(CRISP_BTN_ID)) {
      retryCount = 0; // Reset retry count for new page state
      startInjectionLoop();
    }
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Initial call
  startInjectionLoop();
})();
