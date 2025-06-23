import history from '../utils/history';

// Little helper function to abstract going to different pages
export function forwardTo(location) {
  history.push(location);
}

export function replaceTo(location) {
  history.replace(location);
}
