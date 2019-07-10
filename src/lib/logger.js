// https://gist.github.com/sergey-shpak/29f1f5733715fedb265662d2f327ee8c
const isArray = Array.isArray;
const isFunction = param => typeof param === "function";

export const logger = (env, output = console.debug) =>
  env &&
  (dispatch => (action, props, obj) => {
    if (isFunction(action)) output("Action", action.name, props, obj);
    else if (isArray(action)) {
      // 'tuple action' logged with next dispatch iteration
      if (isArray(action[1])) output("Effect", action[1][0].name, action[1][1]);
    } else output("State", action);
    return dispatch(action, props, obj);
  });
export default logger;
