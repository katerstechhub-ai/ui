import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.VITE_API_URL || 'http://13.60.199.74:5000'
const ENDPOINTS = ['/', '/about']

export default function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const next = []
    for (let i = 0; i < ENDPOINTS.length; i++) {
      const path = ENDPOINTS[i]
      try {
        const res = await fetch(API_URL + path)
        const data = await res.json()
        next.push({ path, ok: res.ok, msg: data.msg })
      } catch (err) {
        next.push({ path, ok: false, msg: 'Could not reach the server' })
      }
    }
    setResults(next)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const cards = []
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    cards.push(
      <motion.div
        key={r.path}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15, type: 'spring', stiffness: 120 }}
        whileHover={{ scale: 1.03 }}
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRadius: 20,
          padding: '20px 24px',
          textAlign: 'left',
        }}
      >
        <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' }}>
          GET {r.path}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, color: r.ok ? '#86efac' : '#fca5a5' }}>
          {r.msg}
        </p>
      </motion.div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        background: 'linear-gradient(135deg, #0f172a, #312e81 55%, #0f172a)',
        color: '#fff',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}
      >
        <motion.h1
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ margin: '0 0 6px', fontSize: 34 }}
        >
          Frontend ↔ Backend
        </motion.h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
          Live data from {API_URL}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ margin: 0 }}
              >
                Contacting server...
              </motion.p>
            ) : (
              <motion.div
                key="results"
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                {cards}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={load}
          disabled={loading}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            marginTop: 28,
            padding: '14px 32px',
            borderRadius: 999,
            border: 'none',
            background: '#f5c518',
            color: '#1f1f1f',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Refresh
        </motion.button>
      </motion.div>
    </div>
  )
}