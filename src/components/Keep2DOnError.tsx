"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary for lazy WebGL objects: if the 3D chunk fails to load or WebGL throws,
 * render nothing and tell the parent, which brings its flat SVG fallback back.
 */
export default class Keep2DOnError extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
