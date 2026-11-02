import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

/** Contains render and lazy-chunk failures so one broken piece never blanks the whole site. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('LUNEVRA UI error:', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
