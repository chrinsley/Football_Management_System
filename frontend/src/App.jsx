import { useState } from 'react'
import Teams from './components/Teams'
import Players from './components/Players'
import Matches from './components/Matches'

const tabs = [
  { id: 'teams', label: 'Teams' },
  { id: 'players', label: 'Players' },
  { id: 'matches', label: 'Matches' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('teams')

  return (
    <div className="app">
      <header className="header">
        <h1>Football Management</h1>
        <p>Manage teams, players, and matches</p>
      </header>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'teams' && <Teams />}
      {activeTab === 'players' && <Players />}
      {activeTab === 'matches' && <Matches />}
    </div>
  )
}
