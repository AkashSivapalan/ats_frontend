import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export function AppLayout() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthRoute =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register')

  async function onLogout() {
    auth.logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="appShell">
      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <Link to={auth.token ? '/dashboard' : '/login'}>Resume ATS Analyzer</Link>
          </div>

          <div className="topbarRight">
            {auth.token ? (
              <>
                <span className="badge">Signed in</span>
                <button className="btn btnDanger" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn" to="/register">
                  Register
                </Link>
                <Link className="btn btnPrimary" to="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

