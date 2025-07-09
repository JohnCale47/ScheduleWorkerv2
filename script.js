import { generateCalendar, navigateMonth } from './utils.js';
import { getUserData, saveUserData } from './storage.js';

let currentDate = new Date();
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply theme on load
document.documentElement.setAttribute('data-theme', currentTheme);

// Login functionality
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

// Dashboard functionality
if (document.getElementById('calendar-grid')) {
  initializeDashboard();
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  
  if (!username) return;
  
  currentUser = username;
  const userData = getUserData(username);
  
  if (!userData) {
    saveUserData(username, {});
  }
  
  window.location.href = 'dashboard.html';
}

function initializeDashboard() {
  // Display username
  const usernameDisplay = document.getElementById('username-display');
  usernameDisplay.textContent = currentUser || 'Guest';
  
  // Set up navigation buttons
  document.getElementById('prev-month').addEventListener('click', () => {
    currentDate = navigateMonth(currentDate, -1);
    updateCalendar();
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    currentDate = navigateMonth(currentDate, 1);
    updateCalendar();
  });
  
  // Set up logout button
  document.getElementById('logout').addEventListener('click', () => {
    currentUser = null;
    window.location.href = 'index.html';
  });
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
  }
  
  // Set up bulk actions
  document.getElementById('mark-all').addEventListener('click', markAllDays);
  document.getElementById('unmark-all').addEventListener('click', unmarkAllDays);
  
  // Initial calendar render
  updateCalendar();
}

function updateCalendar() {
  const monthYearDisplay = document.getElementById('current-month-year');
  const calendarGrid = document.getElementById('calendar-grid');
  
  monthYearDisplay.textContent = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  const userData = currentUser ? getUserData(currentUser) : {};
  calendarGrid.innerHTML = generateCalendar(currentDate, userData);
  
  // Add event listeners to day cells
  document.querySelectorAll('.day:not(.other-month)').forEach(day => {
    day.addEventListener('click', (e) => {
      const checkbox = day.querySelector('.day-checkbox');
      const dateStr = checkbox.dataset.date;
      checkbox.checked = !checkbox.checked;
      
      if (currentUser) {
        const userData = getUserData(currentUser) || {};
        userData[dateStr] = checkbox.checked;
        saveUserData(currentUser, userData);
      }
    });
  });
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
}

function markAllDays() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const userData = getUserData(currentUser) || {};
  
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    userData[dateStr] = true;
  }
  
  saveUserData(currentUser, userData);
  updateCalendar();
}

function unmarkAllDays() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const userData = getUserData(currentUser) || {};
  
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(year, month, i);
    const dateStr = date.toISOString().split('T')[0];
    userData[dateStr] = false;
  }
  
  saveUserData(currentUser, userData);
  updateCalendar();
}
