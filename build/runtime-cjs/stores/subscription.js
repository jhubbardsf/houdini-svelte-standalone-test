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
var subscription_exports = {};
__export(subscription_exports, {
  SubscriptionStore: () => SubscriptionStore
});
module.exports = __toCommonJS(subscription_exports);
var import_runtime = require("$houdini/runtime");
var import_deepEquals = require("$houdini/runtime/lib/deepEquals");
var import_scalars = require("$houdini/runtime/lib/scalars");
var import_types = require("$houdini/runtime/lib/types");
var import_store = require("svelte/store");
var import_adapter = require("../adapter");
var import_network = require("../network");
var import_store2 = require("./store");
class SubscriptionStore extends import_store2.BaseStore {
  artifact;
  kind = import_types.CompiledSubscriptionKind;
  store;
  clearSubscription = () => {
  };
  lastVariables = null;
  constructor({ artifact }) {
    super();
    this.artifact = artifact;
    this.store = (0, import_store.writable)(null);
  }
  subscribe(...args) {
    return this.store?.subscribe(...args);
  }
  async listen(variables) {
    const { raw: text, selection } = this.artifact.default || this.artifact;
    if (!import_adapter.isBrowser) {
      return;
    }
    const config = await this.getConfig();
    const env = await (0, import_network.getCurrentClient)();
    if (!env.socket) {
      throw new Error(
        "The current Houdini Client is not configured to handle subscriptions. Make sure you passed a socketClient to HoudiniClient constructor."
      );
    }
    const marshaledVariables = await (0, import_scalars.marshalInputs)({
      input: variables || {},
      artifact: this.artifact
    });
    if ((0, import_deepEquals.deepEquals)(this.lastVariables, marshaledVariables)) {
      return;
    }
    this.clearSubscription();
    this.lastVariables = marshaledVariables;
    this.clearSubscription = env.socket.subscribe(
      {
        query: text,
        variables: marshaledVariables
      },
      {
        next: ({ data, errors }) => {
          if (errors) {
            throw errors;
          }
          if (data) {
            (0, import_runtime.getCache)().write({
              selection,
              data,
              variables: marshaledVariables
            });
            this.store.set(
              (0, import_scalars.unmarshalSelection)(config, this.artifact.selection, data)
            );
          }
        },
        error(data) {
        },
        complete() {
        }
      }
    );
  }
  unlisten() {
    this.clearSubscription();
    this.clearSubscription = () => {
    };
    this.lastVariables = null;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SubscriptionStore
});
