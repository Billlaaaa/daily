import { lsGet, lsSet, lsDel } from './useLocalStorage'
import { studyBlocks as defaultStudyBlocks } from '../data/studyBlocks'
import { dailyItems as defaultDailyItems } from '../data/dailyItems'
import {
  nutritionItems as defaultNutritionItems,
  supplementItems as defaultSupplementItems,
  DAILY_PROTEIN_TARGET,
  DAILY_CARB_TARGET,
  DAILY_FAT_TARGET,
} from '../data/nutritionItems'

const KEYS = {
  studyBlocks: 'studyBlocksOverride',
  dailyItems: 'dailyItemsOverride',
  nutritionItems: 'nutritionItemsOverride',
  supplementItems: 'supplementItemsOverride',
  macroTargets: 'macroTargetsOverride',
}

export const DEFAULTS = {
  studyBlocks: defaultStudyBlocks,
  dailyItems: defaultDailyItems,
  nutritionItems: defaultNutritionItems,
  supplementItems: defaultSupplementItems,
  macroTargets: { protein: DAILY_PROTEIN_TARGET, carbs: DAILY_CARB_TARGET, fat: DAILY_FAT_TARGET },
}

export function getStudyBlocks() {
  return lsGet(KEYS.studyBlocks, DEFAULTS.studyBlocks)
}

export function getDailyItems() {
  return lsGet(KEYS.dailyItems, DEFAULTS.dailyItems)
}

export function getNutritionItems() {
  return lsGet(KEYS.nutritionItems, DEFAULTS.nutritionItems)
}

export function getSupplementItems() {
  return lsGet(KEYS.supplementItems, DEFAULTS.supplementItems)
}

export function getMacroTargets() {
  return lsGet(KEYS.macroTargets, DEFAULTS.macroTargets)
}

export function getCalorieTarget(targets) {
  const t = targets || getMacroTargets()
  return 4 * t.protein + 4 * t.carbs + 9 * t.fat
}

export function savePlanData(domain, items) {
  lsSet(KEYS[domain], items)
}

export function resetPlanData(domain) {
  lsDel(KEYS[domain])
}
