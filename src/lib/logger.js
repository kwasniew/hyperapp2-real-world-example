const isArray = Array.isArray;
const isFunction = param => typeof param === "function";

export const logger = (output = console.debug) =>
  (dispatch => (action, props) => {
    if (isFunction(action)) {
      output("Action", action.name, props);
    } else if (isArray(action)) {
      output("State", action[0]);
      if (isArray(action[1])) {
        for(let i = 1; i < action.length; i++) {
          output("Effect", action[i][0].name, action[i][1]);
        }
      }
    } else {
      output("State", action);
    }
    return dispatch(action, props);
  });
export default logger;
