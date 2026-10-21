const targetDate = new Date(2026, 9, 23, 0, 0, 0, 0);
const units = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]'),
};
let countdownInterval;
let testTarget;
let hasRevealed = false;
const passwordHash = "6cbf6903d6ef529642ac316e9516097c28c18eb76121083fba95ecceb1cf1a6d";

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const endTime = testTarget || targetDate.getTime();
  const remaining = Math.max(0, endTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  units.days.textContent = formatUnit(days);
  units.hours.textContent = formatUnit(hours);
  units.minutes.textContent = formatUnit(minutes);
  units.seconds.textContent = formatUnit(seconds);

  if (remaining === 0) {
    clearInterval(countdownInterval);
    startReveal();
  }
}

function startReveal() {
  if (hasRevealed) {
    return;
  }

  hasRevealed = true;
  document.querySelector(".hero").classList.add("is-hidden");
  const loader = document.querySelector("#transition-loader");
  loader.classList.add("is-visible");

  window.setTimeout(() => {
    loader.classList.remove("is-visible");
    const content = document.querySelector("#reveal-content");
    content.hidden = false;
    content.classList.add("is-visible");
  }, 1400);
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function openPasswordModal() {
  const modal = document.querySelector("#password-modal");
  modal.hidden = false;
  document.querySelector("#test-password").focus();
}

function closePasswordModal() {
  document.querySelector("#password-modal").hidden = true;
  document.querySelector("#password-error").hidden = true;
  document.querySelector("#password-form").reset();
}

document.querySelector("#test-button").addEventListener("click", openPasswordModal);

document.querySelector("#modal-close").addEventListener("click", closePasswordModal);

document.querySelector("#password-modal").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    closePasswordModal();
  }
});

document.querySelector("#password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = new FormData(event.currentTarget).get("password");
  const isCorrect = typeof password === "string" && (await hashPassword(password)) === passwordHash;

  if (!isCorrect) {
    document.querySelector("#password-error").hidden = false;
    document.querySelector("#test-password").select();
    return;
  }

  closePasswordModal();
  if (hasRevealed) {
    return;
  }

  testTarget = Date.now() + 3000;
  updateCountdown();
  clearInterval(countdownInterval);
  countdownInterval = window.setInterval(updateCountdown, 1000);
});

document.querySelector("#return-button").addEventListener("click", () => {
  testTarget = null;
  hasRevealed = false;
  document.querySelector(".hero").classList.remove("is-hidden");
  document.querySelector("#transition-loader").classList.remove("is-visible");

  const content = document.querySelector("#reveal-content");
  content.hidden = true;
  content.classList.remove("is-visible");

  updateCountdown();
  clearInterval(countdownInterval);
  countdownInterval = window.setInterval(updateCountdown, 1000);
});

updateCountdown();
countdownInterval = window.setInterval(updateCountdown, 1000);
