/* src/passport/utils/university.js */
/**
 * Calculate AI admission probability for a college.
 * @param {Object} college - College object containing avgGPA, avgSAT, type.
 * @param {Object} studentData - Current user's student data (including gpa).
 * @param {Object} aiScore - Result from calculateAIScore (contains percentage).
 * @returns {number} Probability between 5 and 98.
 */
export function getAdmissionProbability(college, studentData, aiScore) {
  const studentGPA = parseFloat(studentData?.gpa) || 3.5;
  const profilePercentage = aiScore?.percentage || 40; // 0-100
  const { avgGPA, avgSAT, type } = college;

  let baseChance = 30;
  if (type === 'Safety') baseChance = 70;
  if (type === 'Match') baseChance = 45;
  if (type === 'Reach') baseChance = 12;

  const gpaDiff = studentGPA - avgGPA;
  baseChance += gpaDiff * 35;

  const profileFactor = (profilePercentage - 50) / 2.5; // -20 to +20
  baseChance += profileFactor;

  return Math.max(5, Math.min(98, Math.round(baseChance)));
}
