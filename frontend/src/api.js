const API = '/api'

async function request(url, options = {}) {
  const response = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const getTeams = () => request('/teams')
export const createTeam = (data) => request('/teams', { method: 'POST', body: JSON.stringify(data) })
export const deleteTeam = (id) => request(`/teams/${id}`, { method: 'DELETE' })

export const getPlayers = () => request('/players')
export const createPlayer = (data) => request('/players', { method: 'POST', body: JSON.stringify(data) })
export const deletePlayer = (id) => request(`/players/${id}`, { method: 'DELETE' })

export const getMatches = () => request('/matches')
export const createMatch = (data) => request('/matches', { method: 'POST', body: JSON.stringify(data) })
export const deleteMatch = (id) => request(`/matches/${id}`, { method: 'DELETE' })
