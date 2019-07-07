export const targetValue = event => event.target.value;

const preventDefaultEffect = (dispatch, props, event) => {
    event.preventDefault();
};

export const preventDefault = [preventDefaultEffect];