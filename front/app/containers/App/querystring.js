function query() {
  const search = window.location && window.location.search;
  return new URLSearchParams(search);
}
export default { querystring: query() };
