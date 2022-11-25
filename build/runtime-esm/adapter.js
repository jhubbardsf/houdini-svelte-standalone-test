const isBrowser = true;
let clientStarted = true;
let isPrerender = false;
const error = (code, message) => message;
function setClientStarted() {
  clientStarted = true;
}
export {
  clientStarted,
  error,
  isBrowser,
  isPrerender,
  setClientStarted
};
