export const farmingTips = [
  "Rotate your crops seasonally to maintain soil health and reduce pest pressure naturally.",
  "Early morning watering reduces evaporation and helps prevent fungal diseases on leaves.",
  "Intercropping legumes with cereals can fix nitrogen naturally, reducing fertilizer costs.",
  "Monitor soil pH regularly — most crops thrive between 6.0 and 7.0.",
  "Mulching your beds retains moisture, suppresses weeds, and improves soil structure over time.",
  "Keep detailed records of each planting cycle to identify what works best on your land.",
  "Healthy poultry litter is one of the best organic fertilizers for crop farms.",
  "Integrated pest management reduces chemical dependency and improves long-term farm profitability.",
  "Post-harvest storage is as important as cultivation — proper storage reduces 30% of losses.",
  "Water stress at flowering reduces crop yield significantly — ensure adequate moisture at this stage.",
  "Drip irrigation can reduce water use by up to 60% compared to surface flooding.",
  "Diversify your farm enterprises to spread risk and create multiple income streams.",
];

export function getTipForNow(): string {
  const hour = new Date().getHours();
  const sixHourBlock = Math.floor(hour / 6);
  const day = new Date().getDate();
  const index = (day * 4 + sixHourBlock) % farmingTips.length;
  return farmingTips[index];
}
