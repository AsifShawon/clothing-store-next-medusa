import { DemoStoreState } from "./types"
import { createInitialSeedState } from "./seed-catalog"
import { validateAndSanitizeState } from "./storage-validator"

export const STORAGE_KEY = "london-boy:portfolio-demo:v1"

type StateListener = (state: DemoStoreState) => void

class StorageRepository {
  private inMemoryState: DemoStoreState | null = null
  private listeners: Set<StateListener> = new Set()
  private isListeningToStorage = false
  private lastSerializedPayload = ""

  constructor() {
    this.setupCrossTabSync()
  }

  /**
   * Check whether localStorage is accessible without throwing
   */
  public isStorageAvailable(): boolean {
    if (typeof window === "undefined" || !window.localStorage) {
      return false
    }
    try {
      const testKey = "__lb_storage_test__"
      window.localStorage.setItem(testKey, "1")
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Initialize state from storage or seed
   */
  public initializeState(): DemoStoreState {
    if (this.inMemoryState) {
      return this.inMemoryState
    }

    if (!this.isStorageAvailable()) {
      const seed = createInitialSeedState()
      this.inMemoryState = seed
      return seed
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        const seed = createInitialSeedState()
        this.saveState(seed)
        return seed
      }

      const parsed = JSON.parse(raw)
      const validation = validateAndSanitizeState(parsed)

      if (validation.repaired || validation.migrated) {
        this.saveState(validation.state)
      }

      this.inMemoryState = validation.state
      this.lastSerializedPayload = raw
      return validation.state
    } catch (error) {
      console.warn("Storage state corruption detected, recovering to initial seed state:", error)
      const seed = createInitialSeedState()
      this.saveState(seed)
      return seed
    }
  }

  /**
   * Get current state (cached in-memory or loaded from storage)
   */
  public getState(): DemoStoreState {
    if (!this.inMemoryState) {
      return this.initializeState()
    }
    return this.inMemoryState
  }

  /**
   * Save state with atomicity and QuotaExceeded recovery
   */
  public saveState(state: DemoStoreState): boolean {
    // Update timestamp
    const updatedState: DemoStoreState = {
      ...state,
      updatedAt: new Date().toISOString(),
    }

    let serialized: string
    try {
      serialized = JSON.stringify(updatedState)
    } catch (err) {
      console.error("Failed to serialize demo state, aborting save:", err)
      return false
    }

    this.inMemoryState = updatedState
    this.lastSerializedPayload = serialized

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, serialized)
      } catch (err: any) {
        if (err.name === "QuotaExceededError" || err.code === 22) {
          console.warn("LocalStorage quota exceeded, trimming event logs and retrying...")
          try {
            const prunedState: DemoStoreState = {
              ...updatedState,
              inventoryEvents: updatedState.inventoryEvents.slice(0, 10),
              activityEvents: updatedState.activityEvents.slice(0, 10),
            }
            const prunedSerialized = JSON.stringify(prunedState)
            window.localStorage.setItem(STORAGE_KEY, prunedSerialized)
            this.inMemoryState = prunedState
            this.lastSerializedPayload = prunedSerialized
          } catch (retryErr) {
            console.error("LocalStorage quota still exceeded after pruning, retaining in-memory state:", retryErr)
            return false
          }
        } else {
          console.error("Failed to write state to localStorage:", err)
          return false
        }
      }
    }

    this.notifyListeners(updatedState)
    return true
  }

  /**
   * Execute transactional atomic update
   */
  public updateState(transaction: (currentState: DemoStoreState) => DemoStoreState): DemoStoreState {
    const current = this.getState()
    const nextState = transaction(JSON.parse(JSON.stringify(current)))
    this.saveState(nextState)
    return nextState
  }

  /**
   * Reset store to initial seed state
   */
  public resetState(): DemoStoreState {
    const fresh = createInitialSeedState()
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.warn("Failed to remove storage item on reset:", e)
      }
    }
    this.saveState(fresh)
    return fresh
  }

  /**
   * Subscribe to state updates (internal or cross-tab)
   */
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Export serialized JSON string of store state
   */
  public exportState(): string {
    const current = this.getState()
    return JSON.stringify(current, null, 2)
  }

  /**
   * Import and validate external JSON state
   */
  public importState(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString)
      const validation = validateAndSanitizeState(parsed)
      this.saveState(validation.state)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Invalid JSON formatted state",
      }
    }
  }

  /**
   * Setup cross-tab synchronization listener
   */
  private setupCrossTabSync(): void {
    if (typeof window === "undefined" || this.isListeningToStorage) {
      return
    }

    const handler = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return
      }

      // Avoid infinite loop if this tab originated the serialized state
      if (event.newValue === this.lastSerializedPayload) {
        return
      }

      try {
        const parsed = JSON.parse(event.newValue)
        const validation = validateAndSanitizeState(parsed)
        this.inMemoryState = validation.state
        this.lastSerializedPayload = event.newValue
        this.notifyListeners(validation.state)
      } catch (e) {
        console.warn("Error parsing cross-tab storage event:", e)
      }
    }

    try {
      window.addEventListener("storage", handler)
      this.isListeningToStorage = true
    } catch {
      // Ignore if event listener cannot be attached
    }
  }

  private notifyListeners(state: DemoStoreState): void {
    this.listeners.forEach((listener) => {
      try {
        listener(state)
      } catch (err) {
        console.error("Error executing state listener:", err)
      }
    })
  }
}

// Singleton repository instance
export const demoStorage = new StorageRepository()
