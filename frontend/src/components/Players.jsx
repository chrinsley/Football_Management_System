import { useEffect, useState } from 'react'
import { createPlayer, deletePlayer, getPlayers, getTeams } from '../api'

const emptyForm = { name: '', age: '', position: '', teamId: '', jerseyNumber: '' }

export default function Players() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [playerList, teamList] = await Promise.all([getPlayers(), getTeams()])
      setPlayers(playerList)
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
      await createPlayer({
        name: form.name,
        age: Number(form.age),
        position: form.position,
        teamId: Number(form.teamId),
        jerseyNumber: Number(form.jerseyNumber)
      })
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deletePlayer(id)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <h2>Players</h2>
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input name="name" placeholder="Player name" value={form.name} onChange={updateField} required />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={updateField} required />
          <input name="position" placeholder="Position" value={form.position} onChange={updateField} required />
          <select name="teamId" value={form.teamId} onChange={updateField} required>
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <input name="jerseyNumber" type="number" placeholder="Jersey #" value={form.jerseyNumber} onChange={updateField} required />
        </div>
        <button type="submit">Add Player</button>
      </form>

      <div className="list">
        {players.length === 0 ? (
          <p className="empty">No players yet</p>
        ) : (
          players.map((player) => (
            <div className="item" key={player.id}>
              <div>
                <strong>#{player.jerseyNumber} {player.name}</strong>
                <span>{player.position} · {teamName(player.teamId)} · Age {player.age}</span>
              </div>
              <button className="danger" onClick={() => handleDelete(player.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
