export function updateCurrentDate(): void {
  const dateElement = document.getElementById('currentDate');
  if (!dateElement) return;

  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('en-US', options);
}

export function startLiveClock(): void {
  const timeElement = document.getElementById('currentTime');
  if (!timeElement) return;

  function update(): void {
    const now = new Date();
    (timeElement as HTMLElement).textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  update();
  setInterval(update, 1000);
}
