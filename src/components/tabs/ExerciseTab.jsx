import { useState } from 'react'
import dayjs from 'dayjs'
import { useGymCycle } from '../../hooks/useGymCycle'
import MorningStretches from '../exercise/MorningStretches'
import GymSession from '../exercise/GymSession'
import NightStretches from '../exercise/NightStretches'

const SUB_TABS = ['Morning Stretches', 'Gym Session', 'Night Stretches']

export default function ExerciseTab() {
  const [subTab, setSubTab] = useState('Morning Stretches')
  const today = dayjs().format('YYYY-MM-DD')
  const split = useGymCycle(today)

  return (
    <div className="tab-content" style={{ paddingTop: 0 }}>
      {/* Sub-nav */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: 20,
        position: 'sticky',
        top: 0,
        background: 'var(--bg)',
        zIndex: 10,
        paddingTop: 16,
      }}>
        {SUB_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '10px 4px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 11,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: subTab === tab ? 'var(--green)' : 'var(--muted)',
              borderBottom: subTab === tab ? '2px solid var(--green)' : '2px solid transparent',
              transition: 'all 0.15s ease',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {subTab === 'Morning Stretches' && <MorningStretches />}
      {subTab === 'Gym Session' && <GymSession split={split} />}
      {subTab === 'Night Stretches' && <NightStretches />}
    </div>
  )
}
