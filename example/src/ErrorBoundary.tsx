import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '1.5rem', maxWidth: '480px', margin: '2rem auto', background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
          <h2 style={{ margin: '0 0 0.5rem', color: '#c00' }}>오류 발생</h2>
          <pre style={{ margin: 0, fontSize: '0.875rem', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error.message}
          </pre>
          {this.state.error.stack && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.875rem' }}>스택 트레이스</summary>
              <pre style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', overflow: 'auto', maxHeight: 200 }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
