import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://13.60.199.74:5000'
const ENDPOINTS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
]

const BLOBS = [
  { color: '#6366f1', size: 460, top: '-12%', left: '-10%', dx: 70, dy: 50, dur: 14 },
  { color: '#ec4899', size: 380, top: '58%', left: '62%', dx: -80, dy: -40, dur: 17 },
  { color: '#06b6d4', size: 340, top: '18%', left: '66%', dx: -50, dy: 70, dur: 19 },
]

const glass = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.22)',
  backdropFilter: 'saturate(180%) blur(28px)',
  WebkitBackdropFilter: 'saturate(180%) blur(28px)',
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkedAt, setCheckedAt] = useState(null)

  const load = async () => {
    setLoading(true)
    const next = []
    for (let i = 0; i < ENDPOINTS.length; i++) {
      const item = ENDPOINTS[i]
      const started = performance.now()
      try {
        const res = await fetch(API_URL + item.path)
        const data = await res.json()
        next.push({ ...item, ok: res.ok, msg: data.msg, ms: Math.round(performance.now() - started) })
      } catch (err) {
        next.push({ ...item, ok: false, msg: 'Could not reach the server', ms: null })
      }
    }
    setResults(next)
    setCheckedAt(new Date())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  let okCount = 0
  for (let i = 0; i < results.length; i++) {
    if (results[i].ok) okCount++
  }
  const allOk = !loading && results.length > 0 && okCount === results.length
  const noneOk = !loading && okCount === 0
  const statusColor = loading ? '#fbbf24' : allOk ? '#4ade80' : noneOk ? '#f87171' : '#fbbf24'
  const statusText = loading ? 'Checking' : allOk ? 'All systems live' : noneOk ? 'Server offline' : 'Partly online'

  const blobs = []
  for (let i = 0; i < BLOBS.length; i++) {
    const b = BLOBS[i]
    blobs.push(
      <motion.div
        key={i}
        animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
        transition={{ repeat: Infinity, duration: b.dur, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: b.top, left: b.left, width: b.size, height: b.size,
          borderRadius: '50%', background: b.color, opacity: 0.38, filter: 'blur(90px)', pointerEvents: 'none',
        }}
      />
    )
  }

  const rows = []
  if (loading) {
    for (let i = 0; i < ENDPOINTS.length; i++) {
      rows.push(
        <motion.div
          key={'skeleton' + i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          exit={{ opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.15 }}
          style={{ height: 76, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      )
    }
  } else {
    for (let i = 0; i < results.length; i++) {
      const r = results[i]
      rows.push(
        <motion.div
          key={r.path}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.12, type: 'spring', stiffness: 160, damping: 20 }}
          whileHover={{ scale: 1.02, y: -2 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 22,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, fontWeight: 800,
              color: r.ok ? '#052e16' : '#450a0a',
              background: r.ok ? 'linear-gradient(145deg,#86efac,#22c55e)' : 'linear-gradient(145deg,#fca5a5,#ef4444)',
              boxShadow: r.ok ? '0 6px 18px rgba(34,197,94,0.45)' : '0 6px 18px rgba(239,68,68,0.45)',
            }}
          >
            {r.ok ? '✓' : '!'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.6, color: 'rgba(255,255,255,0.5)' }}>
              GET {r.path}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: 17, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.msg}
            </p>
          </div>
          <div
            style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
              color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.1)',
            }}
          >
            {r.ms === null ? '--' : r.ms + ' ms'}
          </div>
        </motion.div>
      )
    }
  }

  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 20, boxSizing: 'border-box',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        background: '#070b1a', color: '#fff',
      }}
    >
      {blobs}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        style={{ ...glass, position: 'relative', width: '100%', maxWidth: 480, borderRadius: 36, padding: '30px 22px 26px', textAlign: 'center' }}
      >
        <motion.div
          layout
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999,
            fontSize: 12, fontWeight: 700, letterSpacing: 0.6, background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ width: 9, height: 9, borderRadius: '50%', background: statusColor, boxShadow: '0 0 12px ' + statusColor }}
          />
          {statusText}
        </motion.div>

        <h1
          style={{
            margin: '18px 0 6px', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
            background: 'linear-gradient(120deg,#fff 20%,#a5b4fc 55%,#f9a8d4)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
          }}
        >
          Frontend ↔ Backend
        </h1>
        <p style={{ margin: '0 0 26px', fontSize: 13, color: 'rgba(255,255,255,0.55)', wordBreak: 'break-all' }}>
          Live data from {API_URL}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'results'}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              {rows}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={load}
          disabled={loading}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: 24, height: 52, padding: '0 34px', borderRadius: 26, border: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800,
            color: '#1f1300', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
            background: 'linear-gradient(145deg,#fde68a,#f5c518 55%,#f59e0b)',
            boxShadow: '0 10px 28px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.55)',
          }}
        >
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0.2 }}
            style={{ display: 'inline-block', fontSize: 18, lineHeight: 1 }}
          >
            ↻
          </motion.span>
          Refresh
        </motion.button>

        <p style={{ margin: '16px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {checkedAt ? 'Last checked ' + formatTime(checkedAt) : 'Contacting server...'}
        </p>
      </motion.div>
    </div>
  )
}