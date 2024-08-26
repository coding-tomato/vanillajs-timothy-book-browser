/*
  Usage:
  - We retrieve and set data that publishes through a custom Event emitter.
    Example:
    stateManager.subscribe()
  - Components keep a subscription that stays notified of any changes in state.

  Notes:
  - Ideally, this state manager would streamline the sharing of these
  search terms.
*/

class StateManager extends EventTarget {
  constructor() {
    super();

    this.state = {
      searchQueryKey: [],
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    console.log("# State: ", this.state);
    this.emit("stateChange", this.state);
  }

  getState() {
    return this.state;
  }

  emit(eventName, state) {
    const event = new CustomEvent(eventName, { detail: state });
    this.dispatchEvent(event);
  }

  subscribe(callback) {
    const eventFunction = (event) => {
      callback(event.detail);
    };

    this.addEventListener("stateChange", eventFunction);
    this.emit("stateChange", this.state);

    return () => {
      this.removeEventListener("stateChange", eventFunction);
    };
  }
}

const stateManager = new StateManager();

export default stateManager;
