/**
 * Manages page visibility state and handles background/foreground transitions
 */
export class VisibilityManager {
  private isVisible = true;
  private callbacks: Array<(visible: boolean) => void> = [];
  private reconnectTimeouts: Set<NodeJS.Timeout> = new Set();

  constructor() {
    this.setupVisibilityListener();
    this.isVisible = !document.hidden;
  }

  /**
   * Setup page visibility change listener
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      console.log(`Page visibility changed: ${this.isVisible ? 'visible' : 'hidden'}`);
      this.notifyCallbacks();
    });

    // Also listen for focus/blur events as backup
    window.addEventListener('focus', () => {
      if (!this.isVisible) {
        this.isVisible = true;
        this.notifyCallbacks();
      }
    });

    window.addEventListener('blur', () => {
      if (this.isVisible) {
        this.isVisible = false;
        this.notifyCallbacks();
      }
    });
  }

  /**
   * Register callback for visibility changes
   */
  onVisibilityChange(callback: (visible: boolean) => void): void {
    this.callbacks.push(callback);
    // Immediately call with current state
    callback(this.isVisible);
  }

  /**
   * Remove callback for visibility changes
   */
  removeVisibilityCallback(callback: (visible: boolean) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback(this.isVisible);
      } catch (error) {
        console.error('Error in visibility callback:', error);
      }
    });
  }

  /**
   * Check if page is currently visible
   */
  get visible(): boolean {
    return this.isVisible;
  }

  /**
   * Clear all pending reconnect timeouts
   */
  clearReconnectTimeouts(): void {
    this.reconnectTimeouts.forEach(timeout => clearTimeout(timeout));
    this.reconnectTimeouts.clear();
  }

  /**
   * Add a reconnect timeout to track
   */
  addReconnectTimeout(timeout: NodeJS.Timeout): void {
    this.reconnectTimeouts.add(timeout);
  }

  /**
   * Remove a reconnect timeout from tracking
   */
  removeReconnectTimeout(timeout: NodeJS.Timeout): void {
    this.reconnectTimeouts.delete(timeout);
  }

  /**
   * Cleanup all listeners and timeouts
   */
  destroy(): void {
    this.clearReconnectTimeouts();
    this.callbacks = [];
    // Note: We don't remove event listeners as they're on document/window
    // and will be cleaned up when the page unloads
  }
}

// Export singleton instance
export const visibilityManager = new VisibilityManager();