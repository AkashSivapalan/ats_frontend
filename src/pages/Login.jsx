import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
import { useAuth } from '../auth/useAuth.js'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => location.state?.from || '/dashboard', [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
        isJson: true,
      })

      if (!res?.token) throw new Error('Login succeeded but no token was returned.')
      auth.login(res.token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="panel">
      <h1 className="panelTitle">Login</h1>
      <p className="helper">Sign in to upload your resume and analyze job descriptions.</p>

      {error && <div className="errorBox">{error}</div>}

      <form className="form" onSubmit={onSubmit}>
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
          </div>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        <button className="btn btnPrimary" disabled={submitting} type="submit">
          {submitting ? 'Signing in…' : 'Login'}
        </button>

        <div className="hr" />
        <div className="hint">
          Don’t have an account? <Link to="/register">Create one</Link>.
        </div>
      </form>
    </div>
  )
}

