type Listener = (online: boolean) => void;

class NetworkService {
  private listeners: Listener[] = [];
  private _isOnline: boolean = navigator.onLine;

  constructor() {
    window.addEventListener("online", () => this.setOnline(true));
    window.addEventListener("offline", () => this.setOnline(false));
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  private setOnline(online: boolean) {
    this._isOnline = online;
    this.listeners.forEach((fn) => fn(online));
  }

  onStatusChange(fn: Listener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  destroy() {
    this.listeners = [];
  }
}

export const networkService = new NetworkService();
