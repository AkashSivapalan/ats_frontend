import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import { useAuth } from '../auth/useAuth.js'

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: { name, email, password },
        isJson: true,
      })

      if (!res?.token) throw new Error('Registration succeeded but no token was returned.')
      auth.login(res.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="panel">
      <h1 className="panelTitle">Create account</h1>
      <p className="helper">You’ll be signed in immediately after registering.</p>

      {error && <div className="errorBox">{error}</div>}

      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <div className="labelRow">
            <label className="label" htmlFor="name">
              Name
            </label>
          </div>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="field">
          <div className="labelRow">
            <label className="label" htmlFor="email">
              Email
            </label>
          </div>
          <input
            id="email"
            className="input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="field">
          <div className="labelRow">
            <label className="label" htmlFor="password">
              Password
            </label>
            <span className="hint">Use something you can remember for dev.</span>
          </div>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        <button className="btn btnPrimary" disabled={submitting} type="submit">
          {submitting ? 'Creating…' : 'Register'}
        </button>

        <div className="hr" />
        <div className="hint">
          Already have an account? <Link to="/login">Login</Link>.
        </div>
      </form>
    </div>
  )
}

