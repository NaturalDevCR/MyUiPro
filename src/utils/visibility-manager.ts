/**
 * Manages page visibility state and handles background/foreground transitions
 */
export class VisibilityManager {
  private isVisible = true;
  private callbacks: Array<(visible: boolean, options?: { forceReconnect?: boolean }) => void> = [];
  private reconnectTimeouts: Set<NodeJS.Timeout> = new Set();
  private hiddenStartTime: number | null = null;
  private readonly MAX_HIDDEN_TIME = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.setupVisibilityListener();
    this.isVisible = !document.hidden;
  }

  /**
   * Setup page visibility change listener
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      const wasVisible = this.isVisible;
      this.isVisible = !document.hidden;
      
      if (!wasVisible && this.isVisible) {
        // Página se volvió visible
        const hiddenDuration = this.hiddenStartTime ? Date.now() - this.hiddenStartTime : 0;
        console.log(`Page visible after ${hiddenDuration}ms hidden`);
        this.hiddenStartTime = null;
        
        // Si estuvo oculta por mucho tiempo, marcar para reconexión forzada
        if (hiddenDuration > this.MAX_HIDDEN_TIME) {
          console.log('Page was hidden for too long, forcing reconnection');
          this.notifyCallbacks(true, { forceReconnect: true });
        } else {
          this.notifyCallbacks(true);
        }
      } else if (wasVisible && !this.isVisible) {
        // Página se ocultó
        this.hiddenStartTime = Date.now();
        console.log('Page hidden');
        this.notifyCallbacks(false);
      }
    });

    // También escuchar eventos de focus/blur como respaldo
    window.addEventListener('focus', () => {
      if (!this.isVisible) {
        this.isVisible = true;
        this.hiddenStartTime = null;
        this.notifyCallbacks(true);
      }
    });

    window.addEventListener('blur', () => {
      if (this.isVisible) {
        this.isVisible = false;
        this.hiddenStartTime = Date.now();
        this.notifyCallbacks(false);
      }
    });
  }

  /**
   * Register callback for visibility changes
   */
  onVisibilityChange(callback: (visible: boolean, options?: { forceReconnect?: boolean }) => void): void {
    this.callbacks.push(callback);
    // Immediately call with current state
    callback(this.isVisible);
  }

  /**
   * Remove callback for visibility changes
   */
  removeVisibilityCallback(callback: (visible: boolean, options?: { forceReconnect?: boolean }) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(visible: boolean, options?: { forceReconnect?: boolean }): void {
    this.callbacks.forEach(callback => {
      try {
        callback(visible, options);
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