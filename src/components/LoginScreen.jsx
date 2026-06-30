import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const { signIn } = useAuth()

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 40,
    }}>
      {/* Logo area */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: '0.12em',
          color: 'var(--text)',
          marginBottom: 6,
        }}>
          MISSION CONTROL
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--accent)',
          letterSpacing: '0.08em',
        }}>
          CFA Level 1 · 50-Day Sprint
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 320, height: 1, background: 'var(--border)' }} />

      {/* Sign-in card */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          Sign in with Google to sync your data across devices.
        </div>

        <GoogleLogin
          onSuccess={(res) => signIn(res.credential)}
          onError={() => console.error('Google sign-in failed')}
          theme="filled_black"
          shape="pill"
          size="large"
          text="signin_with"
        />
      </div>
    </div>
  )
}
