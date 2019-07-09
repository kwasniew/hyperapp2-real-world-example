export const targetValue = event => event.target.value;
export const keyCode = event => event.keyCode;

const preventDefaultEffect = (dispatch, props, event) => event.preventDefault();

export const preventDefault = [preventDefaultEffect];

const OnKeyCode = code => action => [
  (state, keyCode) => {
    if (keyCode === code) {
      return action(state);
    }
    return state;
  },
  keyCode
];

export const OnEnter = OnKeyCode(13);
