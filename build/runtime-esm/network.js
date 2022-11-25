async function getCurrentClient() {
  return (await import("HOUDINI_CLIENT_PATH")).default;
}
export {
  getCurrentClient
};
