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
var mutation_exports = {};
__export(mutation_exports, {
  MutationStore: () => MutationStore
});
module.exports = __toCommonJS(mutation_exports);
var import_runtime = require("$houdini/runtime");
var import_network = require("$houdini/runtime/lib/network");
var import_scalars = require("$houdini/runtime/lib/scalars");
var import_store2 = require("svelte/store");
var import_network2 = require("../network");
var import_session = require("../session");
var import_store3 = require("./store");
class MutationStore extends import_store3.BaseStore {
  artifact;
  kind = "HoudiniMutation";
  store;
  setFetching(isFetching) {
    this.store?.update((s) => ({ ...s, isFetching }));
  }
  constructor({ artifact }) {
    super();
    this.artifact = artifact;
    this.store = (0, import_store2.writable)(this.initialState);
  }
  async mutate(variables, {
    metadata,
    fetch,
    ...mutationConfig
  } = {}) {
    const cache = (0, import_runtime.getCache)();
    const config = await this.getConfig();
    this.store.update((c) => {
      return { ...c, isFetching: true };
    });
    const layer = cache._internal_unstable.storage.createLayer(true);
    const optimisticResponse = mutationConfig?.optimisticResponse;
    let toNotify = [];
    if (optimisticResponse) {
      toNotify = cache.write({
        selection: this.artifact.selection,
        data: await (0, import_scalars.marshalSelection)({
          selection: this.artifact.selection,
          data: optimisticResponse
        }),
        variables,
        layer: layer.id
      });
    }
    const newVariables = await (0, import_scalars.marshalInputs)({
      input: variables,
      artifact: this.artifact
    });
    try {
      const { result } = await (0, import_network.executeQuery)({
        client: await (0, import_network2.getCurrentClient)(),
        config,
        artifact: this.artifact,
        variables: newVariables,
        session: await (0, import_session.getSession)(),
        setFetching: (val) => this.setFetching(val),
        cached: false,
        metadata,
        fetch
      });
      if (result.errors && result.errors.length > 0) {
        this.store.update((s) => ({
          ...s,
          errors: result.errors,
          isFetching: false,
          isOptimisticResponse: false,
          data: result.data,
          variables: newVariables || {}
        }));
        throw result.errors;
      }
      layer.clear();
      cache.write({
        selection: this.artifact.selection,
        data: result.data,
        variables: newVariables,
        layer: layer.id,
        notifySubscribers: toNotify,
        forceNotify: true
      });
      cache._internal_unstable.storage.resolveLayer(layer.id);
      const storeData = {
        data: (0, import_scalars.unmarshalSelection)(config, this.artifact.selection, result.data),
        errors: result.errors ?? null,
        isFetching: false,
        isOptimisticResponse: false,
        variables: newVariables
      };
      this.store.set(storeData);
      return storeData.data ?? {};
    } catch (error) {
      this.store.update((s) => ({
        ...s,
        errors: error,
        isFetching: false,
        isOptimisticResponse: false,
        data: null,
        variables: newVariables
      }));
      layer.clear();
      cache._internal_unstable.storage.resolveLayer(layer.id);
      throw error;
    }
  }
  subscribe(...args) {
    return this.store.subscribe(...args);
  }
  get initialState() {
    return {
      data: null,
      errors: null,
      isFetching: false,
      isOptimisticResponse: false,
      variables: null
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MutationStore
});
