"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var session_exports = {};
__export(session_exports, {
  RequestContext: () => RequestContext,
  buildSessionObject: () => buildSessionObject,
  extractSession: () => extractSession,
  getClientSession: () => getClientSession,
  getSession: () => getSession,
  setClientSession: () => setClientSession,
  setSession: () => setSession
});
module.exports = __toCommonJS(session_exports);
var import_scalars = require("$houdini/runtime/lib/scalars");
var import_kit = require("@sveltejs/kit");
var import_store = require("svelte/store");
var import_adapter = require("./adapter");
const sessionKeyName = "__houdini__session__";
class RequestContext {
  loadEvent;
  continue = true;
  returnValue = {};
  constructor(ctx) {
    this.loadEvent = ctx;
  }
  error(status, message) {
    throw (0, import_kit.error)(status, typeof message === "string" ? message : message.message);
  }
  redirect(status, location) {
    throw (0, import_kit.redirect)(status, location);
  }
  fetch(input, init) {
    const fetch = typeof window !== "undefined" ? this.loadEvent.fetch.bind(window) : this.loadEvent.fetch;
    return fetch(input, init);
  }
  graphqlErrors(payload) {
    if (payload.errors) {
      return this.error(500, payload.errors.map(({ message }) => message).join("\n"));
    }
    return this.error(500, "Encountered invalid response: " + JSON.stringify(payload));
  }
  async invokeLoadHook({
    variant,
    hookFn,
    input,
    data,
    error: error2
  }) {
    let hookCall;
    if (variant === "before") {
      hookCall = hookFn.call(this, this.loadEvent);
    } else if (variant === "after") {
      hookCall = hookFn.call(this, {
        event: this.loadEvent,
        input,
        data: Object.fromEntries(
          Object.entries(data).map(([key, store]) => [
            key,
            (0, import_store.get)(store).data
          ])
        )
      });
    } else if (variant === "error") {
      hookCall = hookFn.call(this, {
        event: this.loadEvent,
        input,
        error: error2
      });
    }
    let result = await hookCall;
    if (!this.continue) {
      return;
    }
    if (result == null || typeof result !== "object") {
      return;
    }
    this.returnValue = result;
  }
  async computeInput({
    variableFunction,
    artifact
  }) {
    let input = await variableFunction.call(this, this.loadEvent);
    return await (0, import_scalars.marshalInputs)({ artifact, input });
  }
}
const sessionSentinel = {};
let session = sessionSentinel;
function extractSession(val) {
  return val[sessionKeyName];
}
function buildSessionObject(event) {
  return {
    [sessionKeyName]: extractSession(event.locals)
  };
}
function setClientSession(val) {
  if (!import_adapter.isBrowser) {
    return;
  }
  session = val;
}
function getClientSession() {
  return session;
}
function setSession(event, session2) {
  ;
  event.locals[sessionKeyName] = session2;
}
async function getSession(event) {
  if (event) {
    if ("locals" in event) {
      return extractSession(event.locals) || sessionSentinel;
    } else if ("data" in event && event.data && sessionKeyName in event.data) {
      return extractSession(event.data) || sessionSentinel;
    } else {
      return extractSession(await event.parent()) || sessionSentinel;
    }
  }
  return session;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RequestContext,
  buildSessionObject,
  extractSession,
  getClientSession,
  getSession,
  setClientSession,
  setSession
});
