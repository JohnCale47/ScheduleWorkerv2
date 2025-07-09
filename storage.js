export function getUserData(username) {
  const allData = JSON.parse(localStorage.getItem('schedulePlannerData') || '{}');
  return allData[username];
}

export function saveUserData(username, data) {
  const allData = JSON.parse(localStorage.getItem('schedulePlannerData') || '{}');
  allData[username] = data;
  localStorage.setItem('schedulePlannerData', JSON.stringify(allData));
}
