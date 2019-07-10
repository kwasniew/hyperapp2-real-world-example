export const pages = ({ count, currentPageIndex }) =>
  Array.from({ length: Math.ceil(count / 10) }).map((e, i) => ({
    index: i,
    isCurrent: i === currentPageIndex,
    humanDisplay: i + 1
  }));
