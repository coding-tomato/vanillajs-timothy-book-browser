/*
  Usage:
  - We retrieve and set data that publishes through a custom Event emitter.
    Example:
    stateManager.subscribe()
  - Components keep a subscription that stays notified of any changes in state.

  Notes:
  - Ideally, a state manager would streamline the sharing of these
  search terms.
*/

/**
 * @typedef {Object} State
 * @property {string} search - Search terms to search for books
 */

/**
 * StateManager class for managing application state and notifying subscribers of changes.
 * @extends EventTarget
 */
class StateManager extends EventTarget {
  constructor() {
    super();

    this.state = {
      search: "",
    };
  }

  /**
   * Subscribe to state changes.
   * @param {State} newState - new application state
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.emit("stateChange", this.state);
  }

  getState() {
    return this.state;
  }

  /**
   * Subscribe to state changes.
   * @param {string} eventName - custom event identifier
   * @param {State} state - application state to be emitted
   */
  emit(eventName, state) {
    const event = new CustomEvent(eventName, { detail: state });
    this.dispatchEvent(event);
  }

  /**
   * Subscribes to state changes and returns an unsubscribe function.
   * @param {function(State): void} callback -
   * A function to be called when the state changes.
   * It receives the new state as an argument.
   * @returns {function(): void} A function that, when called, will unsubscribe from state changes.
   */
  subscribe(callback) {
    const eventFunction = (event) => {
      const customEvent = /** @type {CustomEvent<State>} */ (event);
      callback(customEvent.detail);
    };
    this.addEventListener("stateChange", eventFunction);

    return () => {
      this.removeEventListener("stateChange", eventFunction);
    };
  }
}

const stateManager = new StateManager();

export default stateManager;
