export const pages = ({ articlesCount, currentPageIndex }) =>
  Array.from({ length: Math.ceil(articlesCount / 10) }).map((e, i) => ({
    index: i,
    isCurrent: i === currentPageIndex,
    humanDisplay: i + 1
  }));

