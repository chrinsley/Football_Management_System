import { useEffect, useState } from 'react'
import { createTeam, deleteTeam, getTeams } from '../api'

const emptyForm = { name: '', city: '', stadium: '', foundedYear: '' }

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function loadTeams() {
    try {
      setTeams(await getTeams())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await createTeam({
        name: form.name,
        city: form.city,
        stadium: form.stadium,
        foundedYear: Number(form.foundedYear)
      })
      setForm(emptyForm)
      await loadTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTeam(id)
      await loadTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <h2>Teams</h2>
      {error && <p className="error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input name="name" placeholder="Team name" value={form.name} onChange={updateField} required />
          <input name="city" placeholder="City" value={form.city} onChange={updateField} required />
          <input name="stadium" placeholder="Stadium" value={form.stadium} onChange={updateField} required />
          <input name="foundedYear" type="number" placeholder="Founded year" value={form.foundedYear} onChange={updateField} required />
        </div>
        <button type="submit">Add Team</button>
      </form>

      <div className="list">
        {teams.length === 0 ? (
          <p className="empty">No teams yet</p>
        ) : (
          teams.map((team) => (
            <div className="item" key={team.id}>
              <div>
                <strong>{team.name}</strong>
                <span>{team.city} · {team.stadium} · Founded {team.foundedYear}</span>
              </div>
              <button className="danger" onClick={() => handleDelete(team.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
