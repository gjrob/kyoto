import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
