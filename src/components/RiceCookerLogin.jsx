import { useState, useEffect } from 'react';
import './RiceCookerLogin.css';

const DEMO_USER = 'nayla';
const DEMO_PASS = 'masaknasi';
const COOKER_HEIGHT = 640;

function getScale() {
  const floor = Math.min(130, Math.max(70, window.innerHeight * 0.14));
  return Math.min(1, (window.innerHeight - floor - 16) / COOKER_HEIGHT);
}

function RiceCookerLogin() {
  const [state, setState] = useState('off');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const onResize = () => setScale(getScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (state !== 'cooking') return;
    const t = setTimeout(() => setState('open'), 2200);
    return () => clearTimeout(t);
  }, [state]);

  const startCooking = () => {
    if (state === 'off') setState('cooking');
  };

  const closeLid = () => {
    setState('off');
    setError('');
    setPassword('');
  };

  const fail = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      return fail('Username dan password wajib diisi.');
    }
    if (password.length < 6) {
      return fail('Password minimal 6 karakter.');
    }
    if (username === DEMO_USER && password === DEMO_PASS) {
      setError('');
      setState('success');
    } else {
      fail('Nasinya belum matang! Username atau password salah.');
    }
  };

  const on = state !== 'off';
  const isOpen = state === 'success';

  return (
    <div className="kitchen">
      <div className="wall" />

      <div className={`cooker ${shake ? 'shake' : ''}`} style={{ zoom: scale }}>
        {/* Kartu form muncul dari atas magic com */}
        <div className="card-slot">
          {state === 'success' && (
            <div className="card">
              <h2>Haloo, {username}!🎉</h2>
              <p className="welcome-text">
                Nasinya sudah matang. Makan yang banyak yaa..🍚🍤🍗🥗🍜
              </p>
              <button className="btn" onClick={closeLid}>
                Tutup Rice Cooker
              </button>
            </div>
          )}

          {state === 'open' && (
            <form className="card" onSubmit={handleSubmit} noValidate>
              <h2>Rice Cooker Login</h2>
              <p className="sub">Masuk dulu sebelum ambil nasi!</p>

              <label htmlFor="user">Username</label>
              <input
                id="user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user"
                autoComplete="username"
              />

              <label htmlFor="pass">Password</label>
              <input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn">Masuk</button>
              <button type="button" className="link" onClick={closeLid}>
                Tutup Rice Cooker
              </button>
            </form>
          )}
        </div>

        {/* Tutup (miring ke atas saat terbuka) */}
        <div
          className={`lid ${isOpen ? 'open' : ''} ${state === 'cooking' ? 'wobble' : ''}`}
        >
          <span className="lid-knob" />
        </div>

        {/* Badan magic com */}
        <div className="pot">
          <div className={`rice ${isOpen ? 'show' : ''}`} />
          <div className="plate">RICE COOKER</div>
          <div className="controls">
            <span className={`light cook ${state === 'cooking' ? 'on' : ''}`}>MASAK</span>
            <span className={`light warm ${state === 'open' || state === 'success' ? 'on' : ''}`}>HANGAT</span>
          </div>
          <button
            type="button"
            className={`cook-btn ${on ? 'pressed' : ''}`}
            onClick={startCooking}
            aria-label="Tekan tombol masak"
          >
            TEKAN
          </button>
        </div>
      </div>

      <div className="floor">
        <div className="counter-items"><span>🍛🥢</span><span>🥟🍵</span></div>
        {state === 'off' && (
          <p className="hint">Tekan tombol untuk menanak nasi 🍚</p>
        )}
        {state === 'cooking' && <p className="hint small">Sedang menanak…</p>}
        {state === 'open' && (
          <p className="hint small">Login dulu ya^.^</p>
        )}
      </div>
    </div>
  );
}

export default RiceCookerLogin;