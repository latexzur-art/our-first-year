const targetDate = new Date(2026, 9, 23, 0, 0, 0, 0);
const units = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]'),
};

function formatUnit(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const remaining = Math.max(0, targetDate.getTime() - Date.now());
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
    document.querySelector(".intro").textContent = "The moment has arrived. Thanks for being here.";
  }
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
