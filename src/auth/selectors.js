export const errorsList = ({ errors }) =>
  Object.entries(errors).map(
    ([key, values]) => `${key} ${values.join(" and ")}`
  );
