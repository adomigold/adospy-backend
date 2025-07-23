/* eslint-disable @typescript-eslint/no-explicit-any */
import ServerError from "@/pages/ServerError";
import React from "react";

type State = {
    hasError: boolean;
    error: any;
};

export default class StandardErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        // to keep track of when an error occurs
        // and the error itself
        this.state = {
            hasError: false,
            error: undefined
        };
    }

    // update the component state when an error occurs
    static getDerivedStateFromError(error: any) {
        // specify that the error boundary has caught an error
        return {
            hasError: true,
            error: error
        };
    }

    // defines what to do when an error gets caught
    componentDidCatch(error: any, errorInfo: any) {
        // log the error
        console.log("Error caught!");
        console.error(error);
        console.error(errorInfo);

        // record the error in an APM tool...
    }

    render() {
        // if an error occurred
        if (this.state.hasError) {
            return <ServerError />;
        } else {
            // default behavior
            return this.props.children;
        }
    }
}
