import Header from '../renovision/_components/Header'
import BathroomQuiz from './_components/BathroomQuiz'

export default function RenovisionBathroomStyle() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--rv-bg)' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1.5rem 1rem 3rem' }}>
        <BathroomQuiz />
      </main>
      <footer style={{ padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#888' }}>
          © 2024 Renovision Design and Build. All rights reserved. Licensed & Insured.
        </p>
      </footer>
    </div>
  )
}
