import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          minHeight: '100vh',
          backgroundColor: '#071026',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#dc2626' }}>
            ⚠️ Something went wrong
          </h1>
          <div style={{ 
            backgroundColor: '#0a1220', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 20px'
          }}>
            <p style={{ marginBottom: '10px' }}><strong>Error:</strong></p>
            <pre style={{ 
              backgroundColor: '#1a1a2e', 
              padding: '15px', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.message || 'Unknown error'}
            </pre>
            {this.state.error?.stack && (
              <details style={{ marginTop: '15px' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Stack Trace</summary>
                <pre style={{ 
                  backgroundColor: '#1a1a2e', 
                  padding: '15px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '11px',
                  maxHeight: '300px'
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#5227FF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

