export const keyCode = (event) => event.keyCode;

const OnKeyCode = (code) => (action) => [
  (state, keyCode) => {
    if (keyCode === code) {
      return action(state);
    }
    return state;
  },
  keyCode,
];

export const eventWith = (props) => (e) => Object.assign(e, props);

export const OnEnter = OnKeyCode(13);
