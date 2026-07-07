import { useEffect, useState } from 'react'
import { createMatch, deleteMatch, getMatches, getTeams } from '../api'

const emptyForm = {
  homeTeamId: '',
  awayTeamId: '',
  matchDate: '',
  venue: '',
  status: 'SCHEDULED',
  homeScore: '',
  awayScore: ''
}

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [matchList, teamList] = await Promise.all([getMatches(), getTeams()])
      setMatches(matchList)
      setTeams(teamList)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function teamName(teamId) {
    const team = teams.find((item) => item.id === teamId)
    return team ? team.name : `Team #${teamId}`
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await createMatch({
        homeTeamId: Number(form.homeTeamId),
        awayTeamId: Number(form.awayTeamId),
        matchDate: form.matchDate,
        venue: form.venue,
        status: form.status,
        homeScore: form.homeScore === '' ? null : Number(form.homeScore),
        awayScore: form.awayScore === '' ? null : Number(form.awayScore)
      })
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteMatch(id)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <h2>Matches</h2>
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <select name="homeTeamId" value={form.homeTeamId} onChange={updateField} required>
            <option value="">Home team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select name="awayTeamId" value={form.awayTeamId} onChange={updateField} required>
            <option value="">Away team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <input name="matchDate" type="date" value={form.matchDate} onChange={updateField} required />
          <input name="venue" placeholder="Venue" value={form.venue} onChange={updateField} required />
          <select name="status" value={form.status} onChange={updateField} required>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live</option>
            <option value="FINISHED">Finished</option>
          </select>
          <input name="homeScore" type="number" placeholder="Home score" value={form.homeScore} onChange={updateField} />
          <input name="awayScore" type="number" placeholder="Away score" value={form.awayScore} onChange={updateField} />
        </div>
        <button type="submit">Add Match</button>
      </form>

      <div className="list">
        {matches.length === 0 ? (
          <p className="empty">No matches yet</p>
        ) : (
          matches.map((match) => (
            <div className="item" key={match.id}>
              <div>
                <strong>{teamName(match.homeTeamId)} vs {teamName(match.awayTeamId)}</strong>
                <span>
                  {match.matchDate} · {match.venue} · {match.status}
                  {match.homeScore != null && match.awayScore != null && ` · ${match.homeScore} - ${match.awayScore}`}
                </span>
              </div>
              <button className="danger" onClick={() => handleDelete(match.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
