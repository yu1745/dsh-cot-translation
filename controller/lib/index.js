var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __using = (stack, value, async) => {
  if (value != null) {
    if (typeof value !== "object" && typeof value !== "function") __typeError("Object expected");
    var dispose, inner;
    if (async) dispose = value[__knownSymbol("asyncDispose")];
    if (dispose === void 0) {
      dispose = value[__knownSymbol("dispose")];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") __typeError("Object not disposable");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    stack.push([async, dispose, value]);
  } else if (async) {
    stack.push([async]);
  }
  return value;
};
var __callDispose = (stack, error, hasError) => {
  var E = typeof SuppressedError === "function" ? SuppressedError : function(e, s, m, _) {
    return _ = Error(m), _.name = "SuppressedError", _.error = e, _.suppressed = s, _;
  };
  var fail = (e) => error = hasError ? new E(e, error, "An error was suppressed during disposal") : (hasError = true, e);
  var next = (it) => {
    while (it = stack.pop()) {
      try {
        var result = it[1] && it[1].call(it[2]);
        if (it[0]) return Promise.resolve(result).then(next, (e) => (fail(e), next()));
      } catch (e) {
        fail(e);
      }
    }
    if (hasError) throw error;
  };
  return next();
};

// controller/src/index.ts
import { addAbortListener } from "node:events";
import z from "@deepseek-ai/schemastery";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { TranslationError } from "../../translator/lib/index.js";

// controller/src/preferences.ts
var LANGUAGE_PREFERENCE_PATTERN = /^(?:auto|[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*)$/;
var PROVIDER_PREFERENCES = [
  "bing",
  "google",
  "deepseek-account",
  "deepseek-official",
  "configured-model"
];
function canonicalModelRoute(value) {
  try {
    const route = JSON.parse(value);
    if (Array.isArray(route) && route.length === 2 && route.every((id) => typeof id === "string" && id.trim() !== "")) {
      return JSON.stringify(route);
    }
  } catch {
    return void 0;
  }
  return void 0;
}

// controller/src/index.ts
var _translate_dec, _limits_dec, _a, _init;
var CotTranslationController = class extends (_a = TypertRemoteService, _limits_dec = [Remote], _translate_dec = [Remote], _a) {
  constructor(ctx, config) {
    super(ctx, "cotTranslation", { namespace: "cotTranslation" });
    this.config = config;
    __runInitializers(_init, 5, this);
    ctx.inject(["settings"], (child) => {
      child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
    });
  }
  config;
  async limits(signal) {
    signal.throwIfAborted();
    const [availableProviders, modelRoutes] = await Promise.all([
      this.ctx.translator.availableProviders(signal),
      this.listModelRoutes(signal)
    ]);
    signal.throwIfAborted();
    return {
      maxTextChars: this.ctx.translator.maxTextChars,
      preferences: this.selectedPreferences(),
      availableProviders: modelRoutes.length > 0 ? [...availableProviders, "configured-model"] : availableProviders,
      modelRoutes
    };
  }
  selectedPreferences() {
    const modelRoute = this.config.modelRoute.get();
    return {
      provider: this.config.provider.get(),
      targetLanguage: this.config.targetLanguage.get(),
      modelRoute: canonicalModelRoute(modelRoute) ?? modelRoute
    };
  }
  async listModelRoutes(signal) {
    const results = await Promise.allSettled(this.ctx.llm.listProviders().map(async (provider) => {
      const models = await this.ctx.llm.listModels(provider.id);
      return models.flatMap((model) => model.provider === provider.id && (model.inputModalities?.includes("text") ?? true) ? [{ route: JSON.stringify([provider.id, model.id]), providerName: provider.name, modelName: model.name }] : []);
    }));
    signal.throwIfAborted();
    const unique = /* @__PURE__ */ new Map();
    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      for (const choice of result.value) unique.set(choice.route, choice);
    }
    return [...unique.values()];
  }
  async translate(request, signal) {
    signal.throwIfAborted();
    let stage = "resolve-selection";
    try {
      var _stack = [];
      try {
        const spec = this.resolveSelected(request);
        stage = "translate";
        try {
          return await this.ctx.translator.translate(spec, signal);
        } catch (error) {
          if (!(error instanceof TranslationError) || error.code !== "TRANSLATION_SESSION_INACTIVE" || spec.sessionId === void 0) throw error;
        }
        signal.throwIfAborted();
        stage = "activate-session";
        const activation = this.ctx.sessionController.resolveAgent(spec.sessionId).then((result) => {
          if ("error" in result) throw result.error;
        }).catch((error) => {
          if (signal.aborted) this.ctx.logger.warn("Reasoning translation Session activation failed after cancellation");
          throw error;
        });
        const cancelled = Promise.withResolvers();
        const _listener = __using(_stack, addAbortListener(signal, () => {
          cancelled.reject(signal.reason);
        }));
        await Promise.race([activation, cancelled.promise]);
        signal.throwIfAborted();
        stage = "resolve-selection-after-activation";
        const retry = this.resolveSelected({ ...request, provider: spec.provider });
        stage = "translate-after-activation";
        return await this.ctx.translator.translate(retry, signal);
      } catch (_) {
        var _error = _, _hasError = true;
      } finally {
        __callDispose(_stack, _error, _hasError);
      }
    } catch (error) {
      signal.throwIfAborted();
      const provider = this.config.provider.get();
      const code = error instanceof TranslationError ? error.code : "UNEXPECTED_ERROR";
      this.ctx.logger.warn(`Reasoning translation failed (stage=${stage}, provider=${provider}, code=${code})`);
      throw new RemoteError("cotTranslation/failed", "Translation failed", { stage, code });
    }
  }
  resolveSelected(request) {
    const accepted = this.selectedPreferences();
    const provider = request.provider ?? accepted.provider;
    if (provider !== accepted.provider) throw new Error("Translation provider is not selected");
    if (accepted.targetLanguage !== "auto" && request.targetLanguage !== accepted.targetLanguage) throw new Error("Translation language is not selected");
    const modelRoute = provider === "configured-model" ? canonicalModelRoute(accepted.modelRoute) : void 0;
    if (provider === "configured-model" && (modelRoute === void 0 || request.modelRoute !== modelRoute)) {
      throw new Error("Translation model route is not selected");
    }
    return this.ctx.translator.resolve({ ...request, provider, modelRoute });
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "limits", _limits_dec, CotTranslationController);
__decorateElement(_init, 1, "translate", _translate_dec, CotTranslationController);
__decoratorMetadata(_init, CotTranslationController);
__publicField(CotTranslationController, "inject", ["translator", "typert", "sessionController", "llm"]);
__publicField(CotTranslationController, "Config", z.object({
  modelRoute: z.string().default("").volatile(),
  provider: z.union(PROVIDER_PREFERENCES).default("bing").volatile(),
  targetLanguage: z.string().pattern(LANGUAGE_PREFERENCE_PATTERN).default("auto").volatile()
}));
export {
  CotTranslationController as default
};
