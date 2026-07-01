// Flat leaf list (streak / summary / settings all read this), with grouping
// metadata: `group` = collapsible routine section, `sub` = nested dropdown.
export const dailyItems = [
  // ── Morning Routine ──
  { id: 'm_brush',          time: '6:00 AM', label: 'Brush',                    category: 'daily',    group: 'Morning Routine' },
  { id: 'm_sc_cleanser',    time: '6:05 AM', label: 'Cleanser',                 category: 'skincare', group: 'Morning Routine', sub: 'Skincare' },
  { id: 'm_sc_shave',       time: '6:05 AM', label: 'Shave',                    category: 'skincare', group: 'Morning Routine', sub: 'Skincare' },
  { id: 'm_sc_niacinamide', time: '6:05 AM', label: 'Niacinamide',              category: 'skincare', group: 'Morning Routine', sub: 'Skincare' },
  { id: 'm_sc_moisturiser', time: '6:05 AM', label: 'Moisturiser',              category: 'skincare', group: 'Morning Routine', sub: 'Skincare' },
  { id: 'm_sc_sunscreen',   time: '6:05 AM', label: 'Sunscreen',                category: 'skincare', group: 'Morning Routine', sub: 'Skincare' },
  { id: 'm_shower',         time: '6:30 AM', label: 'Shower',                   category: 'daily',    group: 'Morning Routine' },
  { id: 'm_coffee',         time: '6:40 AM', label: 'Black coffee + sunlight',  category: 'daily',    group: 'Morning Routine' },

  // ── Night Time Routine ──
  { id: 'n_shower',         time: '9:20 PM',  label: 'Shower',                  category: 'daily',    group: 'Night Time Routine' },
  { id: 'n_sc_cleanser',    time: '9:30 PM',  label: 'Cleanser',                category: 'skincare', group: 'Night Time Routine', sub: 'Skincare' },
  { id: 'n_sc_ferulic',     time: '9:30 PM',  label: 'Ferulic',                 category: 'skincare', group: 'Night Time Routine', sub: 'Skincare' },
  { id: 'n_sc_moisturiser', time: '9:30 PM',  label: 'Moisturiser',             category: 'skincare', group: 'Night Time Routine', sub: 'Skincare' },
  { id: 'n_wsj',            time: '9:45 PM',  label: 'WSJ',                      category: 'daily',    group: 'Night Time Routine' },
  { id: 'n_bloomberg',      time: '10:00 PM', label: 'Bloomberg',               category: 'daily',    group: 'Night Time Routine' },
  { id: 'n_planning',       time: '11:00 PM', label: 'Plan next day',           category: 'daily',    group: 'Night Time Routine' },
]

export const categoryColors = {
  study:     '#FF4D00',
  daily:     '#5C5C6B',
  nutrition: '#FFB800',
  gym:       '#00E676',
  stretch:   '#A855F7',
  skincare:  '#38BDF8',
}
