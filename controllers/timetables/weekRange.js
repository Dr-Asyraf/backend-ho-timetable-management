// function to get the start and end of the current week
function getCurrentWeekRange() {
  const today = new Date();
  const first = today.getDate() - today.getDay(); // Get the first day of the week (Sunday)
  const last = first + 6; // Get the last day of the week (Saturday)

  const startOfWeek = new Date(today.setDate(first))
    .toISOString()
    .split("T")[0]; // Format as YYYY-MM-DD
  const endOfWeek = new Date(today.setDate(last)).toISOString().split("T")[0];

  return { startOfWeek, endOfWeek };
}

export default getCurrentWeekRange;
