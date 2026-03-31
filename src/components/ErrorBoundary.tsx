import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary] caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <p style={{ padding: '16px', color: '#dc2626' }}>
          Something went wrong. Please refresh the page.
        </p>
      )
    }
    return this.props.children
  }
}
