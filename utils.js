export function generateCalendar(date, userData = {}) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  
  let html = '';
  
  // Previous month days
  for (let i = 0; i < startDay; i++) {
    const day = daysInPrevMonth - startDay + i + 1;
    const prevMonthDate = new Date(year, month - 1, day);
    html += createDayElement(prevMonthDate, true);
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    const isToday = isCurrentMonth && i === today.getDate();
    html += createDayElement(currentDate, false, isToday, userData);
  }
  
  // Next month days
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const nextMonthDays = totalCells - (startDay + daysInMonth);
  
  for (let i = 1; i <= nextMonthDays; i++) {
    const nextMonthDate = new Date(year, month + 1, i);
    html += createDayElement(nextMonthDate, true);
  }
  
  return html;
}

function createDayElement(date, isOtherMonth, isToday = false, userData = {}) {
  const dateStr = date.toISOString().split('T')[0];
  const dayNumber = date.getDate();
  const isChecked = userData[dateStr] || false;
  
  return `
    <div class="day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}">
      <span class="day-number">${dayNumber}</span>
      <input 
        type="checkbox" 
        class="day-checkbox" 
        data-date="${dateStr}"
        ${isChecked ? 'checked' : ''}
        ${isOtherMonth ? 'disabled' : ''}
      >
    </div>
  `;
}

export function navigateMonth(currentDate, direction) {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + direction);
  return newDate;
}
