import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://13.60.199.74:5000'
const ENDPOINTS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
]

/* Change the colours here and the whole page follows. */
const COLORS = {
  page: '#f3eee4',
  card: '#fffdf8',
  ink: '#161616',
  muted: '#6b665c',
  accent: '#ff5b1f',
  good: '#1f8a4c',
  bad: '#d62828',
}

const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
const SERIF = "Georgia, 'Times New Roman', serif"

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
  const summaryColor = loading ? COLORS.muted : allOk ? COLORS.good : noneOk ? COLORS.bad : COLORS.accent
  const summaryText = loading
    ? 'Checking the server...'
    : allOk
      ? 'Server is up. Both endpoints answered.'
      : noneOk
        ? 'Server is not answering.'
        : 'Server answered some endpoints, not all.'

  const rows = []
  if (loading) {
    for (let i = 0; i < ENDPOINTS.length; i++) {
      rows.push(
        <motion.div
          key={'wait' + i}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
          style={{
            padding: '18px 20px',
            borderTop: i === 0 ? 'none' : '2px solid ' + COLORS.ink,
            fontFamily: MONO,
            fontSize: 13,
            color: COLORS.muted,
          }}
        >
          GET {ENDPOINTS[i].path} ...
        </motion.div>
      )
    }
  } else {
    for (let i = 0; i < results.length; i++) {
      const r = results[i]
      rows.push(
        <motion.div
          key={r.path}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.35, ease: 'easeOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '18px 20px',
            borderTop: i === 0 ? 'none' : '2px solid ' + COLORS.ink,
            textAlign: 'left',
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 54,
              padding: '5px 0',
              textAlign: 'center',
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#fff',
              background: r.ok ? COLORS.good : COLORS.bad,
              border: '2px solid ' + COLORS.ink,
            }}
          >
            {r.ok ? 'OK' : 'FAIL'}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 12, color: COLORS.muted }}>GET {r.path}</p>
            <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: COLORS.ink, overflowWrap: 'anywhere' }}>
              {r.msg}
            </p>
          </div>
          <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: COLORS.muted }}>
            {r.ms === null ? '--' : r.ms + 'ms'}
          </span>
        </motion.div>
      )
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        background: COLORS.page,
        color: COLORS.ink,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ width: '100%', maxWidth: 520 }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ margin: '0 0 10px', fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: COLORS.accent, fontWeight: 700 }}
        >
          STATUS BOARD
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ margin: 0, fontFamily: SERIF, fontSize: 44, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Frontend talks to the Backend.
        </motion.h1>
        <p style={{ margin: '12px 0 28px', fontFamily: MONO, fontSize: 12, color: COLORS.muted, overflowWrap: 'anywhere' }}>
          {API_URL}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: COLORS.card,
            border: '2px solid ' + COLORS.ink,
            boxShadow: '6px 6px 0 ' + COLORS.ink,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 20px',
              borderBottom: '2px solid ' + COLORS.ink,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <motion.span
              animate={loading ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
              transition={loading ? { repeat: Infinity, duration: 1 } : {}}
              style={{ width: 10, height: 10, borderRadius: '50%', background: summaryColor, flexShrink: 0 }}
            />
            {summaryText}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={loading ? 'loading' : 'results'} exit={{ opacity: 0 }}>
              {rows}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28 }}>
          <motion.button
            type="button"
            onClick={load}
            disabled={loading}
            whileHover={loading ? {} : { x: -2, y: -2, boxShadow: '5px 5px 0 ' + COLORS.accent }}
            whileTap={loading ? {} : { x: 2, y: 2, boxShadow: '0px 0px 0 ' + COLORS.accent }}
            style={{
              height: 48,
              padding: '0 26px',
              border: '2px solid ' + COLORS.ink,
              background: COLORS.ink,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              boxShadow: '3px 3px 0 ' + COLORS.accent,
            }}
          >
            {loading ? 'Checking...' : 'Check again'}
          </motion.button>
          <span style={{ fontFamily: MONO, fontSize: 12, color: COLORS.muted }}>
            {checkedAt ? 'Last check ' + formatTime(checkedAt) : ''}
          </span>
        </div>
      </div>
    </div>
  )
}