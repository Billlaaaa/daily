export const nutritionItems = [
  { id: 'oats',   time: '12:00 PM', label: '80g oats + 500ml milk',             protein: 27, carbs: 68, fat: 14, kcal: 506 },
  { id: 'whey1',  time: '2:00 PM',  label: '2 scoops whey + 500ml toned milk',  protein: 67, carbs: 26, fat: 12, kcal: 480 },
  { id: 'whey2',  time: '5:00 PM',  label: '2 scoops whey + 500ml toned milk',  protein: 67, carbs: 26, fat: 12, kcal: 480 },
  { id: 'dinner', time: '9:30 PM',  label: 'Dal chawal + 1 big katori curd',    protein: 22, carbs: 80, fat: 17, kcal: 561 },
]

export const supplementItems = [
  { id: 'fishoil', time: '12:00 PM', label: 'Fish oil' },
  { id: 'multi',   time: '12:00 PM', label: 'Methylated multivitamin' },
  { id: 'mag',     time: '11:00 PM', label: 'Magnesium' },
  { id: 'psyl',    time: '11:00 PM', label: 'Psyllium husk' },
]

export const DAILY_PROTEIN_TARGET = 183
export const DAILY_CARB_TARGET = 200
export const DAILY_FAT_TARGET = 55
export const DAILY_CALORIE_TARGET = 4 * DAILY_PROTEIN_TARGET + 4 * DAILY_CARB_TARGET + 9 * DAILY_FAT_TARGET
