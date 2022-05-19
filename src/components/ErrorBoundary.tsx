import { Component } from "react";
export class ErrorBoundary extends Component {
    constructor(props: any) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.log(error);
        console.log(errorInfo);
        // You can also log error messages to an error reporting service here
    }

    render() {
        if ((this.state as any).errorInfo) {
            // Error path
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        {(this.state as any).error && (this.state as any).error.toString()}
                        <br />
                        {(this.state as any).errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Normally, just render children
        return (this.props as any).children;
    }
}
