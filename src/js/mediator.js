export class Mediator {
  constructor() {
    this.events = {};
  }

  publish(eventName, data) {
    if (!this.events[eventName]) {
      return;
    }

    console.log(eventName, data);

    this.events[eventName].forEach(callback => callback(data));
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }
}

export const mediator = new Mediator();
