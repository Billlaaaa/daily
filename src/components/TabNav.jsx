const ICONS = {
  study: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 19.5A2.5 2.5 0 0 1 4.5 17H20" />
      <path d="M4.5 2H20v20H4.5A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2z" />
    </svg>
  ),
  daily: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M3 9h18" />
      <path d="M8 14l2.5 2.5L16 11" />
    </svg>
  ),
  nutrition: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11a9 9 0 0 1 18 0z" />
      <path d="M3 11h18v2a9 9 0 0 1-18 0z" />
      <path d="M12 11V6a2 2 0 0 1 2-2" />
    </svg>
  ),
  exercise: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5l11 11" />
      <path d="M21 21l-1.5-1.5M3 3l1.5 1.5" />
      <path d="M5 16l-2 2M18 5l2-2" />
      <path d="M9 9l-4 4 6 6 4-4M15 15l4-4-6-6-4 4" />
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="5" height="9" rx="1.5" />
      <rect x="9.5" y="6" width="5" height="15" rx="1.5" />
      <rect x="16" y="3" width="5" height="18" rx="1.5" />
    </svg>
  ),
}

const TABS = [
  { id: 'study',     label: 'Study' },
  { id: 'daily',     label: 'Daily' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'exercise',  label: 'Exercise' },
  { id: 'dashboard', label: 'Dashboard' },
]

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`bottom-nav-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {ICONS[tab.id]}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
