import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '../../molecules/StateView/StateView';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Last-resort "error" lifecycle state for every branch-scoped view. Catches
 * render-time failures (e.g. corrupted sessionStorage data) so the app never
 * shows a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="Ocurrió un error inesperado"
          description="Algo falló al mostrar esta pantalla. Podés reintentar o recargar la página."
          action={{ label: 'Reintentar', onClick: this.handleReset }}
        />
      );
    }
    return this.props.children;
  }
}
