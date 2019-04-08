export function eventEmitter() {
  const channels = {};

  function emit(channel, value) {
    if (channels[channel]) {
      channels[channel].subscribers.forEach(s => s(value));
    }
  }

  function on(channel, run) {
    channels[channel]
      ? ch.subscribers.push(run)
      : channels[channel] = { subscribers: [run] };
  }

  return { emit, on };
}

export const mailbox = eventEmitter();

export const Actor = {
  create(behavior, initialState = {}) {
    const channel = Symbol(behavior.name || '');

    //TODO probably want a better way for Actors
    //to know their own channel
    initialState.self = channel;

    let state = typeof behavior.init === "function" ? behavior.init(initialState) : { self };

    mailbox.on(channel, ([method, message]) => {
      state = behavior[method](state, message);
    });

    return channel;
  },

  /*
   *  channel: symbol
   *  message: [<command>, <optional data>]
   */
  send(channel, message) {
    const emit = () => mailbox.emit(channel, message);
    // enque microtask
    return Promise.resolve().then(emit);
  }
};
