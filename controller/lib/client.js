window.__ModuleLoader__.load({id:"@yu1745/dsh-cot-translation",factory(require){
const module={exports:{}};
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

// controller/src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// controller/src/remote.js
var import_zod = require("zod");

// node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
function createTypertRemoteInfo(spec, zod) {
  return new RemoteInfo(spec, zod);
}
var RemoteInfo = class {
  spec;
  zod;
  index;
  constructor(spec, zod) {
    this.spec = spec;
    this.zod = zod;
  }
  get package() {
    return this.spec.package;
  }
  get descriptors() {
    return this.resolve().descriptors;
  }
  get methods() {
    return this.resolve().methods;
  }
  resolve() {
    if (this.index !== void 0)
      return this.index;
    const zod = this.zod;
    const descriptors = [];
    const methods = /* @__PURE__ */ Object.create(null);
    for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
      const separator = endpoint.indexOf("/");
      const namespace = endpoint.slice(0, separator);
      const method = endpoint.slice(separator + 1);
      const parameters = definition.parameters.map((parameter) => ({ ...parameter, wire: parameter.wire ?? parameter.name }));
      const descriptor = {
        ...definition,
        id: `${this.spec.package}#${endpoint}`,
        namespace,
        method,
        parameters,
        result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
      };
      if (definition.invocation.kind === "direct") {
        const inputs = [];
        const direct = Object.assign(descriptor, {
          input(options) {
            const strict = options?.strict === true;
            return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
          },
          invoke(remote, input, signal) {
            const named = input;
            const values = parameters.map((parameter) => named[parameter.wire]);
            if (definition.cancellation !== void 0)
              values.push(signal);
            const receiver = Reflect.get(remote, namespace);
            const call = Reflect.get(receiver, method);
            return call.apply(receiver, values);
          }
        });
        methods[endpoint] = direct;
      }
      descriptors.push(descriptor);
    }
    return this.index = { descriptors, methods };
  }
};
function optional(parameter) {
  return parameter.source === "json" && parameter.acceptsUndefined === true;
}
var NamedInput = class {
  parameters;
  strict;
  zod;
  schema;
  projection;
  constructor(parameters, strict, zod) {
    this.parameters = parameters;
    this.strict = strict;
    this.zod = zod;
  }
  codec(parameter) {
    return this.strict ? parameter.strictCodec : parameter.codec;
  }
  create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
    const value = this.codec(parameter).create();
    return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
  })));
  get jsonSchema() {
    return this.project().jsonSchema;
  }
  get jsonSchemaError() {
    return this.project().jsonSchemaError;
  }
  project() {
    if (this.projection !== void 0)
      return this.projection;
    const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
    if (unavailable !== void 0) {
      return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
    }
    return this.projection = {
      jsonSchema: {
        type: "object",
        properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
          ...this.codec(parameter).jsonSchema,
          ...parameter.description === void 0 ? {} : { description: parameter.description }
        }])),
        required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
        additionalProperties: false
      }
    };
  }
};
var ResultValue = class {
  spec;
  projection;
  constructor(spec) {
    this.spec = spec;
  }
  get mode() {
    return this.spec.mode;
  }
  get typeSymbol() {
    return this.spec.typeSymbol;
  }
  get create() {
    return this.spec.create;
  }
  get decode() {
    return this.spec.decode;
  }
  get encode() {
    return this.spec.encode;
  }
  get description() {
    return this.spec.description;
  }
  get jsonSchemaError() {
    return this.spec.jsonSchemaError;
  }
  get jsonSchema() {
    if (this.projection === void 0) {
      const schema = this.spec.jsonSchema;
      this.projection = { value: schema === void 0 ? void 0 : { ...schema, description: this.spec.description } };
    }
    return this.projection.value;
  }
};

// controller/src/remote.js
var provider = import_zod.z.enum(["bing", "google", "deepseek-account", "deepseek-official", "configured-model"]);
var limits = import_zod.z.object({
  maxTextChars: import_zod.z.number(),
  preferences: import_zod.z.object({ provider, targetLanguage: import_zod.z.string(), modelRoute: import_zod.z.string() }),
  availableProviders: import_zod.z.array(provider),
  modelRoutes: import_zod.z.array(import_zod.z.object({ route: import_zod.z.string(), providerName: import_zod.z.string(), modelName: import_zod.z.string() }))
});
var fields = {
  text: import_zod.z.string(),
  targetLanguage: import_zod.z.string(),
  sourceLanguage: import_zod.z.string().optional(),
  provider: provider.optional(),
  sessionId: import_zod.z.string().optional(),
  modelRoute: import_zod.z.string().optional()
};
var codec = (schema, type) => ({
  mode: "strict",
  typeSymbol: `@yu1745/dsh-cot-translation#${type}`,
  create: () => schema,
  get jsonSchema() {
    return import_zod.z.toJSONSchema(schema);
  }
});
var requestCodec = codec(import_zod.z.object(fields), "TranslationRequest");
var strictRequestCodec = codec(import_zod.z.strictObject(fields), "TranslationRequest");
var common = { service: "cotTranslation", invocation: { kind: "direct" }, cancellation: { parameter: "signal" } };
var TYPERT_REMOTE = createTypertRemoteInfo({
  package: "@yu1745/dsh-cot-translation",
  methods: {
    "cotTranslation/limits": { ...common, parameters: [], result: codec(limits, "CotTranslationSnapshot") },
    "cotTranslation/translate": { ...common, parameters: [{ name: "request", source: "json", codec: requestCodec, strictCodec: strictRequestCodec }], result: codec(import_zod.z.string(), "translate:result") }
  }
}, import_zod.z);
var remote_default = TYPERT_REMOTE;

// controller/src/client/mount.ts
var import_dsh_client_store = require("@deepseek-ai/dsh-client-store");

// controller/src/client/TranslationBody.tsx
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// controller/src/client/translation.ts
function reasoningFragments(text, running, maxTextChars) {
  const result = [];
  const separator = /\r?\n(?:[\t ]*\r?\n)+/g;
  let start = 0;
  while (true) {
    const match = separator.exec(text);
    let remaining = text.slice(start, match?.index ?? text.length);
    while (remaining.length > maxTextChars) {
      let cut = maxTextChars;
      if (/[\uD800-\uDBFF]/.test(remaining.charAt(cut - 1))) cut -= 1;
      const whitespace = remaining.slice(0, cut).search(/\s+\S*$/);
      if (whitespace > 0) cut = whitespace;
      const source = remaining.slice(0, cut);
      remaining = remaining.slice(cut);
      const suffix = remaining.match(/^\s+/)?.[0] ?? "";
      remaining = remaining.slice(suffix.length);
      result.push({ text: source, suffix, complete: true });
    }
    result.push({ text: remaining, suffix: match?.[0] ?? "", complete: match !== null || !running });
    if (match === null) return result;
    start = match.index + match[0].length;
  }
}
var ReasoningTranslation = class {
  /**
   * @param selection - explicit provider and resolved target language.
   * @param maxTextChars - configured translator request limit.
   * @param translate - one cancellation-aware Remote request.
   * @param publish - component-local display state update.
   */
  constructor(selection, maxTextChars, translate, publish) {
    this.selection = selection;
    this.maxTextChars = maxTextChars;
    this.translate = translate;
    this.publish = publish;
  }
  selection;
  maxTextChars;
  translate;
  publish;
  controller = new AbortController();
  cache = /* @__PURE__ */ new Map();
  fragments = [];
  pending = false;
  failed = false;
  /**
   * Adopt the current source and enqueue newly completed fragments.
   * @param text - current original reasoning.
   * @param running - whether its tail is still streaming.
   */
  update(text, running) {
    this.fragments = reasoningFragments(text, running, this.maxTextChars);
    this.emit();
    void this.run();
  }
  /** Retry untranslated fragments after a failed request. */
  retry() {
    this.failed = false;
    void this.run();
  }
  /** Abort the disclosure's requests and suppress all later publications. */
  dispose() {
    this.controller.abort();
  }
  isDisposed() {
    return this.controller.signal.aborted;
  }
  emit() {
    if (this.isDisposed()) return;
    const text = this.fragments.map((fragment) => {
      const content = fragment.complete ? this.cache.get(fragment.text) ?? fragment.text : fragment.text;
      return content + fragment.suffix;
    }).join("");
    this.publish({ text, pending: this.pending, failed: this.failed });
  }
  async run() {
    if (this.pending || this.failed || this.isDisposed()) return;
    let next = this.fragments.find((fragment) => fragment.complete && fragment.text.trim() !== "" && !this.cache.has(fragment.text));
    if (next === void 0) return;
    this.pending = true;
    this.emit();
    try {
      while (next !== void 0) {
        const translated = await this.translate({ ...this.selection, text: next.text }, this.controller.signal);
        if (this.isDisposed()) return;
        this.cache.set(next.text, translated);
        this.emit();
        next = this.fragments.find((fragment) => fragment.complete && fragment.text.trim() !== "" && !this.cache.has(fragment.text));
      }
    } catch (_error) {
      if (!this.isDisposed()) this.failed = true;
    } finally {
      this.pending = false;
      this.emit();
    }
  }
};

// controller/src/client/Translation.module.css
var Translation_default = {
  toolbar: "Translation_toolbar",
  viewToggle: "Translation_viewToggle",
  failure: "Translation_failure",
  field: "Translation_field",
  notice: "Translation_notice",
  spinner: "Translation_spinner",
  "cot-translation-spin": "Translation_cot-translation-spin"
};

// controller/src/client/TranslationBody.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function TranslationBody(props) {
  const preferences = props.usePreferences((value) => value);
  const locale = props.useTranslationLocale((value) => value.active);
  const maxTextChars = props.useTranslationLimit((value) => value);
  const targetLanguage = preferences.targetLanguage === "auto" ? locale : preferences.targetLanguage;
  const modelRoute = preferences.provider === "configured-model" ? preferences.modelRoute : void 0;
  const selection = (0, import_react.useMemo)(
    () => ({ provider: preferences.provider, targetLanguage, modelRoute }),
    [preferences.provider, targetLanguage, modelRoute]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    TranslationView,
    {
      ...props,
      selection,
      maxTextChars
    },
    JSON.stringify([selection.provider, selection.targetLanguage, selection.modelRoute, maxTextChars])
  );
}
function TranslationView(props) {
  const { text, running, translate, t, renderFactorySlot, selection, maxTextChars } = props;
  const [state, setState] = (0, import_react.useState)({ text, pending: false, failed: false });
  const [original, setOriginal] = (0, import_react.useState)(false);
  const translation = (0, import_react.useRef)();
  (0, import_react.useEffect)(() => {
    const controller = new ReasoningTranslation(selection, maxTextChars, translate, setState);
    translation.current = controller;
    return () => {
      controller.dispose();
      translation.current = void 0;
    };
  }, [selection, maxTextChars, translate]);
  (0, import_react.useEffect)(
    () => {
      translation.current?.update(text, running);
    },
    [text, running, selection, maxTextChars, translate]
  );
  const labels = (0, import_react.useMemo)(() => ({ code: {
    copyLabel: t("copy"),
    copiedLabel: t("copied"),
    toolbarLabels: { codeLabel: t("codeTitle"), wrapLabel: t("wrap"), unwrapLabel: t("unwrap") }
  }, footnotes: t("footnotes") }), [t]);
  const showOriginal = original || state.failed;
  const actionLabel = t(showOriginal ? "translation" : "original");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      "data-cot-translation": "true",
      "data-translation-state": state.failed ? "failed" : state.pending ? "pending" : "ready",
      "data-translation-view": showOriginal ? "original" : "translated",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: Translation_default.toolbar, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_dsh_client_ui_primitives.Button,
            {
              className: Translation_default.viewToggle,
              size: "sm",
              variant: "ghost",
              disabled: state.failed,
              onClick: () => {
                setOriginal(!showOriginal);
              },
              children: actionLabel
            }
          ),
          state.pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { role: "status", "aria-label": t("translating"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconLoadingOutlineRegular, { size: 14, className: Translation_default.spinner }) }),
          state.failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Translation_default.failure, role: "status", children: t("failed") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { size: "sm", variant: "ghost", onClick: () => {
              translation.current?.retry();
            }, children: t("retry") })
          ] })
        ] }),
        renderFactorySlot("conversation.chat.reasoning.content", { text: showOriginal ? text : state.text, running, labels })
      ]
    }
  );
}

// controller/src/client/TranslationSettings.tsx
var import_react2 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

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

// controller/src/client/locales.ts
var NS = "cotTranslation";
var en = {
  configuredModel: "Configured model",
  configuredModelNotice: "Each uncached fragment is sent to the selected model. Your provider may charge for these requests.",
  modelRoute: "Translation model",
  selectModelRoute: "Choose a configured model",
  unavailableModelRoute: "Selected model \u2014 unavailable",
  modelRouteUnavailable: "This model is unavailable. Configure a text model or choose an available one.",
  modelRouteHint: "Choose the provider and model used to translate reasoning.",
  modelRouteOption: "{provider} \u2014 {model}",
  provider: "Translation service",
  google: "Google",
  bing: "Bing",
  deepseekAccount: "DeepSeek Flash \u2014 account (paid)",
  deepseekOfficial: "DeepSeek Flash \u2014 official API (paid)",
  providerUnavailableOption: "{provider} \u2014 unavailable",
  providerUnavailable: "This provider is unavailable. Configure your DeepSeek account or official API provider, or choose an available service.",
  paidNotice: "Each uncached fragment sends a separate paid DeepSeek Flash request through the selected account or official API credentials. Reopening reasoning reuses saved results; changing the provider, language, source text, or request settings may send a new paid request.",
  anonymousNotice: "Bing and Google need no translation login or API key. Their anonymous endpoints may reject or limit requests.",
  targetLanguage: "Target language",
  targetLanguageHint: "auto follows the UI language; language codes such as zh, en, and ja also work.",
  privacy: "Expanded reasoning is sent to the selected service. It may contain private code or conversation details.",
  translation: "View translation",
  original: "View original",
  retry: "Retry",
  failed: "Translation failed. Showing the original.",
  translating: "Translating reasoning",
  invalidProvider: "Choose a translation service.",
  invalidLanguage: "Enter auto or a language code, such as zh, en, or ja.",
  overridden: "Overridden",
  reset: "Reset to default",
  unavailable: "Translation preferences are unavailable.",
  readOnly: "This deployment stores settings read-only.",
  saveFailed: "The deployment did not accept these values; they were left for you to correct.",
  save: "Save",
  saving: "Saving\u2026",
  copy: "Copy",
  copied: "Copied",
  codeTitle: "Code block",
  wrap: "Wrap lines",
  unwrap: "Unwrap lines",
  footnotes: "Footnotes"
};
var zh = {
  configuredModel: "\u5DF2\u914D\u7F6E\u7684\u6A21\u578B",
  configuredModelNotice: "\u6BCF\u4E2A\u672A\u7F13\u5B58\u7247\u6BB5\u90FD\u4F1A\u53D1\u9001\u7ED9\u6240\u9009\u6A21\u578B\uFF0C\u6A21\u578B\u63D0\u4F9B\u5546\u53EF\u80FD\u4F1A\u6536\u53D6\u8D39\u7528\u3002",
  modelRoute: "\u7FFB\u8BD1\u6A21\u578B",
  selectModelRoute: "\u8BF7\u9009\u62E9\u5DF2\u914D\u7F6E\u7684\u6A21\u578B",
  unavailableModelRoute: "\u6240\u9009\u6A21\u578B \u2014 \u4E0D\u53EF\u7528",
  modelRouteUnavailable: "\u6B64\u6A21\u578B\u4E0D\u53EF\u7528\uFF0C\u8BF7\u914D\u7F6E\u6587\u672C\u6A21\u578B\u6216\u9009\u62E9\u53EF\u7528\u7684\u6A21\u578B\u3002",
  modelRouteHint: "\u9009\u62E9\u7528\u4E8E\u7FFB\u8BD1\u601D\u8003\u5185\u5BB9\u7684\u670D\u52A1\u5546\u548C\u6A21\u578B\u3002",
  modelRouteOption: "{provider} \xB7 {model}",
  provider: "\u7FFB\u8BD1\u670D\u52A1",
  google: "Google",
  bing: "Bing",
  deepseekAccount: "DeepSeek Flash \xB7 \u8D26\u53F7\uFF08\u4ED8\u8D39\uFF09",
  deepseekOfficial: "DeepSeek Flash \xB7 \u5B98\u65B9 API\uFF08\u4ED8\u8D39\uFF09",
  providerUnavailableOption: "{provider} \u2014 \u4E0D\u53EF\u7528",
  providerUnavailable: "\u6B64\u670D\u52A1\u6682\u4E0D\u53EF\u7528\uFF0C\u8BF7\u914D\u7F6E DeepSeek \u8D26\u53F7\u6216\u5B98\u65B9 API \u670D\u52A1\uFF0C\u6216\u9009\u62E9\u53EF\u7528\u7684\u7FFB\u8BD1\u670D\u52A1",
  paidNotice: "\u6BCF\u4E2A\u672A\u7F13\u5B58\u7247\u6BB5\u90FD\u4F1A\u901A\u8FC7\u6240\u9009\u8D26\u53F7\u6216\u5B98\u65B9 API \u51ED\u636E\u5355\u72EC\u53D1\u9001\u4E00\u6B21\u4ED8\u8D39\u7684 DeepSeek Flash \u8BF7\u6C42\uFF1B\u91CD\u65B0\u5C55\u5F00\u4F1A\u590D\u7528\u5DF2\u4FDD\u5B58\u7684\u8BD1\u6587\uFF0C\u66F4\u6539\u670D\u52A1\u3001\u8BED\u8A00\u3001\u539F\u6587\u6216\u8BF7\u6C42\u8BBE\u7F6E\u53EF\u80FD\u53D1\u9001\u65B0\u7684\u4ED8\u8D39\u8BF7\u6C42",
  anonymousNotice: "Bing \u548C Google \u7FFB\u8BD1\u65E0\u9700\u989D\u5916\u767B\u5F55\u6216 API key\uFF0C\u4F46\u533F\u540D\u63A5\u53E3\u53EF\u80FD\u62D2\u7EDD\u6216\u9650\u5236\u8BF7\u6C42",
  targetLanguage: "\u76EE\u6807\u8BED\u8A00",
  targetLanguageHint: "auto \u4F7F\u7528\u754C\u9762\u8BED\u8A00\uFF1B\u4E5F\u53EF\u586B\u5199\u8BED\u8A00\u4EE3\u7801\uFF0C\u4F8B\u5982 zh\u3001en\u3001ja",
  privacy: "\u5C55\u5F00\u7684\u601D\u8003\u5185\u5BB9\u4F1A\u53D1\u9001\u7ED9\u6240\u9009\u7FFB\u8BD1\u670D\u52A1\uFF0C\u53EF\u80FD\u5305\u542B\u79C1\u6709\u4EE3\u7801\u6216\u5BF9\u8BDD\u7EC6\u8282\u3002",
  translation: "\u67E5\u770B\u8BD1\u6587",
  original: "\u67E5\u770B\u539F\u6587",
  retry: "\u91CD\u8BD5",
  failed: "\u7FFB\u8BD1\u6682\u4E0D\u53EF\u7528\uFF0C\u5DF2\u663E\u793A\u539F\u6587",
  translating: "\u6B63\u5728\u7FFB\u8BD1\u601D\u8003\u5185\u5BB9",
  invalidProvider: "\u8BF7\u9009\u62E9\u7FFB\u8BD1\u670D\u52A1",
  invalidLanguage: "\u8BF7\u586B\u5199 auto \u6216\u8BED\u8A00\u4EE3\u7801\uFF0C\u4F8B\u5982 zh\u3001en\u3001ja",
  overridden: "\u5DF2\u8986\u76D6",
  reset: "\u6062\u590D\u9ED8\u8BA4",
  unavailable: "\u7FFB\u8BD1\u8BBE\u7F6E\u6682\u4E0D\u53EF\u7528",
  readOnly: "\u672C\u90E8\u7F72\u7684\u8BBE\u7F6E\u4E3A\u53EA\u8BFB",
  saveFailed: "\u672C\u90E8\u7F72\u6CA1\u6709\u63A5\u53D7\u8FD9\u4E9B\u503C\uFF0C\u5DF2\u4FDD\u7559\u4F9B\u4F60\u4FEE\u6539",
  save: "\u4FDD\u5B58",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  copy: "\u590D\u5236",
  copied: "\u5DF2\u590D\u5236",
  codeTitle: "\u4EE3\u7801\u5757",
  wrap: "\u81EA\u52A8\u6362\u884C",
  unwrap: "\u4E0D\u6362\u884C",
  footnotes: "\u811A\u6CE8"
};
function formLabels(t) {
  return { unavailable: t("unavailable"), readOnly: t("readOnly"), saveFailed: t("saveFailed"), save: t("save"), saving: t("saving") };
}
var ja = {
  configuredModel: "\u8A2D\u5B9A\u6E08\u307F\u30E2\u30C7\u30EB",
  configuredModelNotice: "\u672A\u30AD\u30E3\u30C3\u30B7\u30E5\u306E\u5404\u65AD\u7247\u306F\u9078\u629E\u3057\u305F\u30E2\u30C7\u30EB\u306B\u9001\u4FE1\u3055\u308C\u307E\u3059\u3002\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u304C\u6599\u91D1\u3092\u8ACB\u6C42\u3059\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",
  modelRoute: "\u7FFB\u8A33\u30E2\u30C7\u30EB",
  selectModelRoute: "\u8A2D\u5B9A\u6E08\u307F\u30E2\u30C7\u30EB\u3092\u9078\u629E",
  unavailableModelRoute: "\u9078\u629E\u3057\u305F\u30E2\u30C7\u30EB \u2014 \u5229\u7528\u4E0D\u53EF",
  modelRouteUnavailable: "\u3053\u306E\u30E2\u30C7\u30EB\u306F\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u30C6\u30AD\u30B9\u30C8\u30E2\u30C7\u30EB\u3092\u8A2D\u5B9A\u3059\u308B\u304B\u3001\u5229\u7528\u3067\u304D\u308B\u30E2\u30C7\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  modelRouteHint: "\u63A8\u8AD6\u306E\u7FFB\u8A33\u306B\u4F7F\u3046\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3068\u30E2\u30C7\u30EB\u3092\u9078\u629E\u3057\u307E\u3059\u3002",
  modelRouteOption: "{provider} \u2014 {model}",
  "provider": "\u7FFB\u8A33\u30B5\u30FC\u30D3\u30B9",
  "google": "Google",
  "bing": "Bing",
  "deepseekAccount": "DeepSeek Flash \u2014 \u30A2\u30AB\u30A6\u30F3\u30C8 (\u6709\u6599)",
  "deepseekOfficial": "DeepSeek Flash \u2014 \u516C\u5F0F API (\u6709\u6599)",
  "providerUnavailableOption": "{provider} \u2014 \u5229\u7528\u4E0D\u53EF",
  "providerUnavailable": "\u3053\u306E\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u306F\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002DeepSeek \u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306F\u516C\u5F0F API \u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3092\u8A2D\u5B9A\u3059\u308B\u304B\u3001\u5229\u7528\u53EF\u80FD\u306A\u30B5\u30FC\u30D3\u30B9\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "paidNotice": "\u30AD\u30E3\u30C3\u30B7\u30E5\u3055\u308C\u3066\u3044\u306A\u3044\u30D5\u30E9\u30B0\u30E1\u30F3\u30C8\u3054\u3068\u306B\u3001\u9078\u629E\u3057\u305F\u30A2\u30AB\u30A6\u30F3\u30C8\u307E\u305F\u306F\u516C\u5F0F API \u306E\u8A8D\u8A3C\u60C5\u5831\u3092\u901A\u3058\u3066\u3001\u500B\u5225\u306E\u6709\u6599 DeepSeek Flash \u30EA\u30AF\u30A8\u30B9\u30C8\u304C\u9001\u4FE1\u3055\u308C\u307E\u3059\u3002\u63A8\u8AD6\u3092\u518D\u5EA6\u958B\u304F\u3068\u4FDD\u5B58\u6E08\u307F\u306E\u7D50\u679C\u304C\u518D\u5229\u7528\u3055\u308C\u307E\u3059\u304C\u3001\u30D7\u30ED\u30D0\u30A4\u30C0\u30FC\u3001\u8A00\u8A9E\u3001\u30BD\u30FC\u30B9\u30C6\u30AD\u30B9\u30C8\u3001\u307E\u305F\u306F\u30EA\u30AF\u30A8\u30B9\u30C8\u8A2D\u5B9A\u3092\u5909\u66F4\u3059\u308B\u3068\u3001\u65B0\u305F\u306A\u6709\u6599\u30EA\u30AF\u30A8\u30B9\u30C8\u304C\u9001\u4FE1\u3055\u308C\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",
  "anonymousNotice": "Bing \u3068 Google \u306F\u7FFB\u8A33\u306E\u30ED\u30B0\u30A4\u30F3\u3084 API \u30AD\u30FC\u304C\u4E0D\u8981\u3067\u3059\u3002\u3053\u308C\u3089\u306E\u533F\u540D\u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\u306F\u30EA\u30AF\u30A8\u30B9\u30C8\u3092\u62D2\u5426\u3057\u305F\u308A\u5236\u9650\u3057\u305F\u308A\u3059\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002",
  "targetLanguage": "\u7FFB\u8A33\u5148\u306E\u8A00\u8A9E",
  "targetLanguageHint": "auto \u306F UI \u306E\u8A00\u8A9E\u306B\u5F93\u3044\u307E\u3059\u3002zh\u3001en\u3001ja \u306A\u3069\u306E\u8A00\u8A9E\u30B3\u30FC\u30C9\u3082\u4F7F\u7528\u3067\u304D\u307E\u3059\u3002",
  "privacy": "\u5C55\u958B\u3055\u308C\u305F\u63A8\u8AD6\u306F\u9078\u629E\u3057\u305F\u30B5\u30FC\u30D3\u30B9\u306B\u9001\u4FE1\u3055\u308C\u307E\u3059\u3002\u975E\u516C\u958B\u306E\u30B3\u30FC\u30C9\u3084\u4F1A\u8A71\u306E\u8A73\u7D30\u304C\u542B\u307E\u308C\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002",
  "translation": "\u7FFB\u8A33\u3092\u8868\u793A",
  "original": "\u539F\u6587\u3092\u8868\u793A",
  "retry": "\u518D\u8A66\u884C",
  "failed": "\u7FFB\u8A33\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u539F\u6587\u3092\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002",
  "translating": "\u63A8\u8AD6\u3092\u7FFB\u8A33\u4E2D",
  "invalidProvider": "\u7FFB\u8A33\u30B5\u30FC\u30D3\u30B9\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "invalidLanguage": "auto \u307E\u305F\u306F zh\u3001en\u3001ja \u306A\u3069\u306E\u8A00\u8A9E\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  "overridden": "\u4E0A\u66F8\u304D\u6E08\u307F",
  "reset": "\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059",
  "unavailable": "\u7FFB\u8A33\u8A2D\u5B9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002",
  "readOnly": "\u3053\u306E\u30C7\u30D7\u30ED\u30A4\u3067\u306F\u8A2D\u5B9A\u306F\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u3067\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002",
  "saveFailed": "\u3053\u306E\u30C7\u30D7\u30ED\u30A4\u3067\u306F\u5024\u304C\u53D7\u3051\u5165\u308C\u3089\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u4FEE\u6B63\u306E\u305F\u3081\u306B\u5024\u306F\u305D\u306E\u307E\u307E\u6B8B\u3055\u308C\u3066\u3044\u307E\u3059\u3002",
  "save": "\u4FDD\u5B58",
  "saving": "\u4FDD\u5B58\u4E2D\u2026",
  "copy": "\u30B3\u30D4\u30FC",
  "copied": "\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F",
  "codeTitle": "\u30B3\u30FC\u30C9\u30D6\u30ED\u30C3\u30AF",
  "wrap": "\u6298\u308A\u8FD4\u3057",
  "unwrap": "\u6298\u308A\u8FD4\u3057\u3092\u89E3\u9664",
  "footnotes": "\u811A\u6CE8"
};
var es = {
  configuredModel: "Modelo configurado",
  configuredModelNotice: "Cada fragmento sin cach\xE9 se env\xEDa al modelo elegido. El proveedor puede cobrar por estas solicitudes.",
  modelRoute: "Modelo de traducci\xF3n",
  selectModelRoute: "Elige un modelo configurado",
  unavailableModelRoute: "Modelo seleccionado \u2014 no disponible",
  modelRouteUnavailable: "Este modelo no est\xE1 disponible. Configura un modelo de texto o elige uno disponible.",
  modelRouteHint: "Elige el proveedor y el modelo con los que se traducir\xE1 el razonamiento.",
  modelRouteOption: "{provider} \u2014 {model}",
  provider: "Servicio de traducci\xF3n",
  google: "google",
  bing: "Bing",
  deepseekAccount: "DeepSeek Flash \u2014 cuenta (pago)",
  deepseekOfficial: "Flash DeepSeek: API oficial (de pago)",
  providerUnavailableOption: "{provider} \u2014 no disponible",
  providerUnavailable: "Este proveedor no est\xE1 disponible. Configura tu cuenta DeepSeek o proveedor oficial de API, o elige un servicio disponible.",
  paidNotice: "Cada fragmento no almacenado en cach\xE9 env\xEDa una solicitud Flash DeepSeek paga por separado a trav\xE9s de la cuenta seleccionada o las credenciales oficiales de API. El razonamiento de reapertura reutiliza los resultados guardados; cambiar el proveedor, el idioma, el texto fuente o la configuraci\xF3n de la solicitud puede enviar una nueva solicitud paga.",
  anonymousNotice: "Bing y Google no necesitan inicio de sesi\xF3n de traducci\xF3n ni clave API. Sus puntos finales an\xF3nimos pueden rechazar o limitar solicitudes.",
  targetLanguage: "Idioma de destino",
  targetLanguageHint: "auto sigue el idioma de la interfaz de usuario; Los c\xF3digos de idioma como zh, en y ja tambi\xE9n funcionan.",
  privacy: "Se env\xEDa el razonamiento ampliado al servicio seleccionado. Puede contener c\xF3digo privado o detalles de la conversaci\xF3n.",
  translation: "Ver traducci\xF3n",
  original: "Ver original",
  retry: "Reintentar",
  failed: "La traducci\xF3n fall\xF3. Mostrando el original.",
  translating: "Traducir razonamiento",
  invalidProvider: "Elija un servicio de traducci\xF3n.",
  invalidLanguage: "Ingrese auto o un c\xF3digo de idioma, como zh, en o ja.",
  overridden: "Anulado",
  reset: "Restablecer los valores predeterminados",
  unavailable: "Las preferencias de traducci\xF3n no est\xE1n disponibles.",
  readOnly: "Esta implementaci\xF3n almacena configuraciones de solo lectura.",
  saveFailed: "El despliegue no acept\xF3 estos valores; quedaron para que usted los corrigiera.",
  save: "Guardar",
  saving: "Guardando\u2026",
  copy: "Copiar",
  copied: "Copiado",
  codeTitle: "Bloque de c\xF3digo",
  wrap: "Ajustar l\xEDneas",
  unwrap: "Desenvolver l\xEDneas",
  footnotes: "Notas a pie de p\xE1gina"
};
var fr = {
  configuredModel: "Mod\xE8le configur\xE9",
  configuredModelNotice: "Chaque fragment non mis en cache est envoy\xE9 au mod\xE8le choisi. Le fournisseur peut facturer ces requ\xEAtes.",
  modelRoute: "Mod\xE8le de traduction",
  selectModelRoute: "Choisir un mod\xE8le configur\xE9",
  unavailableModelRoute: "Mod\xE8le s\xE9lectionn\xE9 \u2014 indisponible",
  modelRouteUnavailable: "Ce mod\xE8le est indisponible. Configurez un mod\xE8le de texte ou choisissez un mod\xE8le disponible.",
  modelRouteHint: "Choisissez le fournisseur et le mod\xE8le utilis\xE9s pour traduire le raisonnement.",
  modelRouteOption: "{provider} \u2014 {model}",
  provider: "Service de traduction",
  google: "Google",
  bing: "Bing",
  deepseekAccount: "DeepSeek Flash \u2014 compte (payant)",
  deepseekOfficial: "DeepSeek Flash \u2014 API officiel (payant)",
  providerUnavailableOption: "{provider} \u2014 indisponible",
  providerUnavailable: "Ce fournisseur n'est pas disponible. Configurez votre compte DeepSeek ou votre fournisseur officiel API, ou choisissez un service disponible.",
  paidNotice: "Chaque fragment non mis en cache envoie une demande Flash DeepSeek payante distincte via le compte s\xE9lectionn\xE9 ou les informations d'identification officielles API. La r\xE9ouverture du raisonnement r\xE9utilise les r\xE9sultats enregistr\xE9s\xA0; la modification du fournisseur, de la langue, du texte source ou des param\xE8tres de la demande peut envoyer une nouvelle demande payante.",
  anonymousNotice: "Bing et Google n'ont pas besoin de connexion de traduction ni de cl\xE9 API. Leurs points de terminaison anonymes peuvent rejeter ou limiter les demandes.",
  targetLanguage: "Langue cible",
  targetLanguageHint: "auto suit la langue de l'interface utilisateur\xA0; les codes de langue tels que zh, en et ja fonctionnent \xE9galement.",
  privacy: "Le raisonnement \xE9tendu est envoy\xE9 au service s\xE9lectionn\xE9. Il peut contenir du code priv\xE9 ou des d\xE9tails de conversation.",
  translation: "Voir la traduction",
  original: "Voir l'original",
  retry: "R\xE9essayer",
  failed: "La traduction a \xE9chou\xE9. Montrant l'original.",
  translating: "Traduire le raisonnement",
  invalidProvider: "Choisissez un service de traduction.",
  invalidLanguage: "Saisissez auto ou un code de langue, tel que zh, en ou ja.",
  overridden: "Remplac\xE9",
  reset: "R\xE9initialiser aux valeurs par d\xE9faut",
  unavailable: "Les pr\xE9f\xE9rences de traduction ne sont pas disponibles.",
  readOnly: "Ce d\xE9ploiement stocke les param\xE8tres en lecture seule.",
  saveFailed: "Le d\xE9ploiement n'a pas accept\xE9 ces valeurs ; ils vous ont \xE9t\xE9 laiss\xE9s \xE0 corriger.",
  save: "Enregistrer",
  saving: "Sauvegarde\u2026",
  copy: "Copier",
  copied: "Copi\xE9",
  codeTitle: "Bloc de code",
  wrap: "Activer le retour \xE0 la ligne",
  unwrap: "D\xE9rouler les lignes",
  footnotes: "Notes de bas de page"
};
var de = {
  configuredModel: "Konfiguriertes Modell",
  configuredModelNotice: "Jedes nicht zwischengespeicherte Fragment wird an das ausgew\xE4hlte Modell gesendet. Der Anbieter kann daf\xFCr Geb\xFChren berechnen.",
  modelRoute: "\xDCbersetzungsmodell",
  selectModelRoute: "Konfiguriertes Modell ausw\xE4hlen",
  unavailableModelRoute: "Ausgew\xE4hltes Modell \u2013 nicht verf\xFCgbar",
  modelRouteUnavailable: "Dieses Modell ist nicht verf\xFCgbar. Konfigurieren Sie ein Textmodell oder w\xE4hlen Sie ein verf\xFCgbares Modell.",
  modelRouteHint: "W\xE4hlen Sie den Anbieter und das Modell f\xFCr die \xDCbersetzung der \xDCberlegungen.",
  modelRouteOption: "{provider} \u2013 {model}",
  provider: "\xDCbersetzungsdienst",
  google: "Google",
  bing: "Bing",
  deepseekAccount: "DeepSeek Flash \u2013 Konto (kostenpflichtig)",
  deepseekOfficial: "DeepSeek Flash \u2013 offizieller API (kostenpflichtig)",
  providerUnavailableOption: "{provider} \u2013 nicht verf\xFCgbar",
  providerUnavailable: "Dieser Anbieter ist nicht verf\xFCgbar. Konfigurieren Sie Ihr DeepSeek-Konto oder Ihren offiziellen API-Anbieter oder w\xE4hlen Sie einen verf\xFCgbaren Dienst.",
  paidNotice: "Jedes nicht zwischengespeicherte Fragment sendet eine separate kostenpflichtige DeepSeek-Flash-Anfrage \xFCber das ausgew\xE4hlte Konto oder die offiziellen API-Anmeldeinformationen. Beim erneuten \xD6ffnen der Argumentation werden gespeicherte Ergebnisse wiederverwendet. Wenn Sie den Anbieter, die Sprache, den Quelltext oder die Anfrageeinstellungen \xE4ndern, wird m\xF6glicherweise eine neue kostenpflichtige Anfrage gesendet.",
  anonymousNotice: "F\xFCr Bing und Google ist weder ein \xDCbersetzungs-Login noch ein API-Schl\xFCssel erforderlich. Ihre anonymen Endpunkte k\xF6nnen Anfragen ablehnen oder einschr\xE4nken.",
  targetLanguage: "Zielsprache",
  targetLanguageHint: "folgt automatisch der UI-Sprache; Sprachcodes wie zh, en und ja funktionieren ebenfalls.",
  privacy: "Die erweiterte Begr\xFCndung wird an den ausgew\xE4hlten Dienst gesendet. Es kann private Code- oder Konversationsdetails enthalten.",
  translation: "\xDCbersetzung ansehen",
  original: "Original ansehen",
  retry: "Erneut versuchen",
  failed: "Die \xDCbersetzung ist fehlgeschlagen. Zeigt das Original.",
  translating: "Argumentation \xFCbersetzen",
  invalidProvider: "W\xE4hlen Sie einen \xDCbersetzungsdienst.",
  invalidLanguage: "Geben Sie auto oder einen Sprachcode ein, z. B. zh, en oder ja.",
  overridden: "\xDCberschrieben",
  reset: "Auf Standard zur\xFCcksetzen",
  unavailable: "\xDCbersetzungseinstellungen sind nicht verf\xFCgbar.",
  readOnly: "Diese Bereitstellung speichert Einstellungen schreibgesch\xFCtzt.",
  saveFailed: "Die Bereitstellung hat diese Werte nicht akzeptiert. Sie mussten sie korrigieren.",
  save: "Speichern",
  saving: "Speichern\u2026",
  copy: "Kopieren",
  copied: "Kopiert",
  codeTitle: "Codeblock",
  wrap: "Zeilen umbrechen",
  unwrap: "Zeilen abwickeln",
  footnotes: "Fu\xDFnoten"
};
var ru = {
  configuredModel: "\u041D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C",
  configuredModelNotice: "\u041A\u0430\u0436\u0434\u044B\u0439 \u0444\u0440\u0430\u0433\u043C\u0435\u043D\u0442, \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u043D\u0435\u0442 \u0432 \u043A\u044D\u0448\u0435, \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u043C\u043E\u0434\u0435\u043B\u0438. \u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043C\u043E\u0436\u0435\u0442 \u0432\u0437\u0438\u043C\u0430\u0442\u044C \u043F\u043B\u0430\u0442\u0443 \u0437\u0430 \u0437\u0430\u043F\u0440\u043E\u0441\u044B.",
  modelRoute: "\u041C\u043E\u0434\u0435\u043B\u044C \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430",
  selectModelRoute: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u0443\u044E \u043C\u043E\u0434\u0435\u043B\u044C",
  unavailableModelRoute: "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C \u2014 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430",
  modelRouteUnavailable: "\u042D\u0442\u0430 \u043C\u043E\u0434\u0435\u043B\u044C \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430. \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u0443\u044E \u043C\u043E\u0434\u0435\u043B\u044C \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0443\u044E.",
  modelRouteHint: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u0438 \u043C\u043E\u0434\u0435\u043B\u044C \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430 \u0440\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0439.",
  modelRouteOption: "{provider} \u2014 {model}",
  provider: "\u0423\u0441\u043B\u0443\u0433\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430",
  google: "\u0413\u0443\u0433\u043B",
  bing: "\u0411\u0438\u043D\u0433",
  deepseekAccount: "DeepSeek Flash \u2014 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 (\u043F\u043B\u0430\u0442\u043D\u044B\u0439)",
  deepseekOfficial: "DeepSeek Flash \u2014 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 API (\u043F\u043B\u0430\u0442\u043D\u044B\u0439)",
  providerUnavailableOption: "{provider} \u2014 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D",
  providerUnavailable: "\u042D\u0442\u043E\u0442 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0441\u0432\u043E\u044E \u0443\u0447\u0435\u0442\u043D\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C DeepSeek \u0438\u043B\u0438 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 API \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0443\u044E \u0443\u0441\u043B\u0443\u0433\u0443.",
  paidNotice: "\u041A\u0430\u0436\u0434\u044B\u0439 \u043D\u0435\u043A\u044D\u0448\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0444\u0440\u0430\u0433\u043C\u0435\u043D\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441 DeepSeek Flash \u0447\u0435\u0440\u0435\u0437 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0443\u044E \u0443\u0447\u0435\u0442\u043D\u0443\u044E \u0437\u0430\u043F\u0438\u0441\u044C \u0438\u043B\u0438 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0447\u0435\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 API. \u041F\u0440\u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u043C \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u0440\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0439 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043D\u044B\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B; \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430, \u044F\u0437\u044B\u043A\u0430, \u0438\u0441\u0445\u043E\u0434\u043D\u043E\u0433\u043E \u0442\u0435\u043A\u0441\u0442\u0430 \u0438\u043B\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u0437\u0430\u043F\u0440\u043E\u0441\u0430 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u0438\u0432\u0435\u0441\u0442\u0438 \u043A \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0430.",
  anonymousNotice: "Bing \u0438 Google \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u044E\u0442 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430 \u0438\u043B\u0438 \u043A\u043B\u044E\u0447\u0430 API. \u0418\u0445 \u0430\u043D\u043E\u043D\u0438\u043C\u043D\u044B\u0435 \u043A\u043E\u043D\u0435\u0447\u043D\u044B\u0435 \u0442\u043E\u0447\u043A\u0438 \u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u043A\u043B\u043E\u043D\u044F\u0442\u044C \u0438\u043B\u0438 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0432\u0430\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441\u044B.",
  targetLanguage: "\u0426\u0435\u043B\u0435\u0432\u043E\u0439 \u044F\u0437\u044B\u043A",
  targetLanguageHint: "\u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0441\u043B\u0435\u0434\u0443\u0435\u0442 \u044F\u0437\u044B\u043A\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0433\u043E \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430; \u043A\u043E\u0434\u044B \u044F\u0437\u044B\u043A\u043E\u0432, \u0442\u0430\u043A\u0438\u0435 \u043A\u0430\u043A zh, en \u0438 ja, \u0442\u0430\u043A\u0436\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442.",
  privacy: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u043E\u0435 \u043E\u0431\u043E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u0443\u044E \u0441\u043B\u0443\u0436\u0431\u0443. \u041E\u043D \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043B\u0438\u0447\u043D\u044B\u0439 \u043A\u043E\u0434 \u0438\u043B\u0438 \u0434\u0435\u0442\u0430\u043B\u0438 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u0430.",
  translation: "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043F\u0435\u0440\u0435\u0432\u043E\u0434",
  original: "\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B",
  retry: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C",
  failed: "\u041F\u0435\u0440\u0435\u0432\u043E\u0434 \u043D\u0435 \u0443\u0434\u0430\u043B\u0441\u044F. \u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B.",
  translating: "\u041F\u0435\u0440\u0435\u0432\u043E\u0434 \u0440\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0439",
  invalidProvider: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0441\u043B\u0443\u0433\u0443 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430.",
  invalidLanguage: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 auto \u0438\u043B\u0438 \u043A\u043E\u0434 \u044F\u0437\u044B\u043A\u0430, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 zh, en \u0438\u043B\u0438 ja.",
  overridden: "\u041F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043E",
  reset: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
  unavailable: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B.",
  readOnly: "\u0412 \u044D\u0442\u043E\u043C \u0440\u0430\u0437\u0432\u0435\u0440\u0442\u044B\u0432\u0430\u043D\u0438\u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F.",
  saveFailed: "\u0420\u0430\u0437\u0432\u0435\u0440\u0442\u044B\u0432\u0430\u043D\u0438\u0435 \u043D\u0435 \u043F\u0440\u0438\u043D\u044F\u043B\u043E \u044D\u0442\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F; \u0438\u0445 \u043E\u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0432\u0430\u043C \u043D\u0430 \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435.",
  save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
  saving: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u2026",
  copy: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
  copied: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
  codeTitle: "\u0411\u043B\u043E\u043A \u043A\u043E\u0434\u0430",
  wrap: "\u041F\u0435\u0440\u0435\u043D\u043E\u0441\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0438",
  unwrap: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043B\u0438\u043D\u0438\u0438",
  footnotes: "\u0421\u043D\u043E\u0441\u043A\u0438"
};
var pt = {
  configuredModel: "Modelo configurado",
  configuredModelNotice: "Cada trecho fora do cache \xE9 enviado ao modelo selecionado. O provedor pode cobrar por essas solicita\xE7\xF5es.",
  modelRoute: "Modelo de tradu\xE7\xE3o",
  selectModelRoute: "Escolha um modelo configurado",
  unavailableModelRoute: "Modelo selecionado \u2014 indispon\xEDvel",
  modelRouteUnavailable: "Este modelo est\xE1 indispon\xEDvel. Configure um modelo de texto ou escolha um dispon\xEDvel.",
  modelRouteHint: "Escolha o provedor e o modelo usados para traduzir o racioc\xEDnio.",
  modelRouteOption: "{provider} \u2014 {model}",
  provider: "Servi\xE7o de tradu\xE7\xE3o",
  google: "Google",
  bing: "Google",
  deepseekAccount: "DeepSeek Flash \u2014 conta (paga)",
  deepseekOfficial: "DeepSeek Flash \u2014 oficial API (pago)",
  providerUnavailableOption: "{provider} \u2014 indispon\xEDvel",
  providerUnavailable: "Este provedor n\xE3o est\xE1 dispon\xEDvel. Configure sua conta DeepSeek ou provedor API oficial ou escolha um servi\xE7o dispon\xEDvel.",
  paidNotice: "Cada fragmento n\xE3o armazenado em cache envia uma solicita\xE7\xE3o Flash DeepSeek paga separada por meio da conta selecionada ou das credenciais API oficiais. A reabertura do racioc\xEDnio reutiliza resultados salvos; alterar o provedor, o idioma, o texto fonte ou as configura\xE7\xF5es da solicita\xE7\xE3o pode enviar uma nova solicita\xE7\xE3o paga.",
  anonymousNotice: "O Bing e o Google n\xE3o precisam de login de tradu\xE7\xE3o ou chave API. Seus endpoints an\xF4nimos podem rejeitar ou limitar solicita\xE7\xF5es.",
  targetLanguage: "Idioma alvo",
  targetLanguageHint: "auto segue o idioma da UI; c\xF3digos de idioma como zh, en e ja tamb\xE9m funcionam.",
  privacy: "O racioc\xEDnio expandido \xE9 enviado ao servi\xE7o selecionado. Pode conter c\xF3digo privado ou detalhes da conversa.",
  translation: "Ver tradu\xE7\xE3o",
  original: "Ver original",
  retry: "Tentar novamente",
  failed: "A tradu\xE7\xE3o falhou. Mostrando o original.",
  translating: "Traduzindo o racioc\xEDnio",
  invalidProvider: "Escolha um servi\xE7o de tradu\xE7\xE3o.",
  invalidLanguage: "Insira auto ou um c\xF3digo de idioma, como zh, en ou ja.",
  overridden: "Substitu\xEDdo",
  reset: "Redefinir para o padr\xE3o",
  unavailable: "As prefer\xEAncias de tradu\xE7\xE3o n\xE3o est\xE3o dispon\xEDveis.",
  readOnly: "Esta implanta\xE7\xE3o armazena configura\xE7\xF5es somente leitura.",
  saveFailed: "A implanta\xE7\xE3o n\xE3o aceitou esses valores; eles foram deixados para voc\xEA corrigir.",
  save: "Salvar",
  saving: "Salvando\u2026",
  copy: "Copiar",
  copied: "Copiado",
  codeTitle: "Bloco de c\xF3digo",
  wrap: "Quebrar linhas",
  unwrap: "Desembrulhar linhas",
  footnotes: "Notas de rodap\xE9"
};

// controller/src/client/TranslationSettings.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function providerLabel(provider2, t) {
  switch (provider2) {
    case "bing":
      return t("bing");
    case "google":
      return t("google");
    case "deepseek-account":
      return t("deepseekAccount");
    case "deepseek-official":
      return t("deepseekOfficial");
    case "configured-model":
      return t("configuredModel");
    default:
      return provider2;
  }
}
function TranslationSettings(props) {
  const { t } = props;
  const providerId = (0, import_react2.useId)(), languageId = (0, import_react2.useId)(), routeId = (0, import_react2.useId)(), routeHelpId = (0, import_react2.useId)();
  const state = props.useTranslationForm((value) => value);
  const availableProviders = props.useAvailableProviders((value) => value);
  const modelRoutes = props.useModelRoutes((value) => value);
  (0, import_react2.useEffect)(() => {
    props.refreshProviders();
  }, [props.refreshProviders]);
  const missingProvider = state.provider.text !== "" && !availableProviders.some((provider2) => provider2 === state.provider.text);
  const paid = state.provider.text === "deepseek-account" || state.provider.text === "deepseek-official";
  const configured = state.provider.text === "configured-model";
  const route = canonicalModelRoute(state.modelRoute.text) ?? state.modelRoute.text;
  const missingRoute = route !== "" && !modelRoutes.some((choice) => choice.route === route);
  const routeNotice = missingRoute || modelRoutes.length === 0 ? t("modelRouteUnavailable") : t("modelRouteHint");
  const disabled = !state.writable || state.saving;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_dsh_client_ui_primitives2.SettingsForm, { labels: formLabels(t), state, onSave: props.save, onDiscard: props.discard, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Translation_default.notice, children: t("privacy") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: Translation_default.notice, children: t(configured ? "configuredModelNotice" : paid ? "paidNotice" : "anonymousNotice") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Translation_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Translation_default.toolbar, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: providerId, children: t("provider") }),
        state.provider.overridden && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Tag, { tone: "neutral", children: t("overridden") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Button, { size: "sm", disabled, onClick: () => {
            props.resetField("provider");
          }, children: t("reset") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "select",
        {
          id: providerId,
          name: "provider",
          value: state.provider.text,
          disabled,
          "aria-invalid": state.provider.invalid || void 0,
          onChange: (event) => {
            props.edit("provider", event.target.value);
          },
          children: [
            missingProvider && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: state.provider.text, disabled: true, children: t("providerUnavailableOption", {
              provider: providerLabel(state.provider.text, t)
            }) }),
            availableProviders.map((provider2) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: provider2, children: providerLabel(provider2, t) }, provider2))
          ]
        }
      ),
      state.provider.invalid && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "status", children: t("invalidProvider") }),
      missingProvider && !state.provider.invalid && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { role: "status", className: Translation_default.notice, children: t("providerUnavailable") })
    ] }),
    configured && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Translation_default.field, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: Translation_default.toolbar, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("label", { htmlFor: routeId, children: t("modelRoute") }),
        state.modelRoute.overridden && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Tag, { tone: "neutral", children: t("overridden") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_dsh_client_ui_primitives2.Button, { type: "button", size: "sm", disabled, onClick: () => {
            props.resetField("modelRoute");
          }, children: t("reset") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "select",
        {
          id: routeId,
          name: "modelRoute",
          value: route,
          disabled,
          "aria-describedby": routeHelpId,
          "aria-invalid": state.modelRoute.invalid || missingRoute || void 0,
          onChange: (event) => {
            props.edit("modelRoute", event.target.value);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: "", disabled: true, children: t("selectModelRoute") }),
            missingRoute && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: route, disabled: true, children: t("unavailableModelRoute") }),
            modelRoutes.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: choice.route, children: t("modelRouteOption", { provider: choice.providerName, model: choice.modelName }) }, choice.route))
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { id: routeHelpId, className: Translation_default.notice, role: "status", children: routeNotice })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_dsh_client_ui_primitives2.SettingsValueField,
      {
        id: languageId,
        label: t("targetLanguage"),
        hint: t("targetLanguageHint"),
        ...state.targetLanguage,
        overriddenLabel: t("overridden"),
        resetLabel: t("reset"),
        invalidLabel: t("invalidLanguage"),
        disabled,
        onEdit: (value) => {
          props.edit("targetLanguage", value);
        },
        onReset: () => {
          props.resetField("targetLanguage");
        }
      }
    )
  ] });
}

// controller/src/client/preferences-form.ts
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");
var TranslationPreferencesForm = class {
  form;
  state;
  /** @param scope - Host-backed configuration form for this plugin. */
  constructor(scope) {
    this.form = new import_dsh_client_ui_primitives3.SettingsFormModel(scope, [{
      ...(0, import_dsh_client_ui_primitives3.settingsTextField)("provider"),
      parse: (text) => {
        const provider2 = text.trim();
        return provider2 === "" ? { kind: "clear" } : PROVIDER_PREFERENCES.some((choice) => choice === provider2) ? { kind: "set", value: provider2 } : void 0;
      }
    }, {
      ...(0, import_dsh_client_ui_primitives3.settingsTextField)("modelRoute"),
      parse: (text) => {
        if (text === "") return { kind: "clear" };
        const route = canonicalModelRoute(text);
        return route === void 0 ? void 0 : { kind: "set", value: route };
      }
    }, {
      ...(0, import_dsh_client_ui_primitives3.settingsTextField)("targetLanguage"),
      parse: (text) => LANGUAGE_PREFERENCE_PATTERN.test(text.trim()) ? { kind: "set", value: text.trim() } : void 0
    }]);
    this.state = this.form.bind(() => ({
      ...this.form.shell(),
      provider: this.form.field("provider"),
      targetLanguage: this.form.field("targetLanguage"),
      modelRoute: this.form.field("modelRoute")
    }));
  }
  /**
   * Build the registration face for the preferences form.
   * @returns draft observable and shared edit/save actions.
   */
  inject() {
    return { hooks: { translationForm: this.state }, ...this.form.actions() };
  }
  /** Release the accepted-preference subscription. */
  dispose() {
    this.form.dispose();
  }
};

// controller/src/client/mount.ts
var inject = ["remote", "slots", "locale", "configForms"];
async function registerUi(ctx, lifetime) {
  let readTask;
  let updating;
  let revision = 0, lastReadRevision = -1, acceptedRevision = -1;
  const isDisposed = () => lifetime.signal.aborted || ctx.fiber.uid === null;
  ctx.effect(() => async () => {
    lifetime.abort();
    await Promise.allSettled([readTask, updating]);
  }, "cot-translation: metadata queries");
  const invalidate = () => {
    revision += 1;
    refresh();
  };
  ctx.effect(() => [
    ctx.remote.$on("settings/document-updated", invalidate),
    ctx.remote.$on("llm/adapters-updated", invalidate),
    ctx.remote.$on("llm/models-updated", invalidate),
    ctx.remote.$on("deepseek-account/session-expired", invalidate),
    ctx.remote.$on("deepseek-account/model-sign-in-required", invalidate),
    ctx.remote.$on("credentials/record-updated", invalidate),
    ctx.remote.$on("credentials/reference-updated", invalidate)
  ]);
  ctx.on("connection/reset", invalidate);
  const read = async () => {
    while (true) {
      const observed = revision;
      lastReadRevision = observed;
      readTask = ctx.remote.cotTranslation.limits(lifetime.signal);
      const result = await readTask;
      if (isDisposed()) return void 0;
      if (observed === revision) return result;
    }
  };
  let initial;
  try {
    initial = await read();
  } catch (error) {
    if (isDisposed()) return;
    throw error;
  }
  if (initial === void 0) return;
  if (!initial.ok) throw initial.error;
  const preferences = (0, import_dsh_client_store.createSnapshotStore)(initial.value.preferences);
  const translationLimit = (0, import_dsh_client_store.createSnapshotStore)(initial.value.maxTextChars);
  const availableProviders = (0, import_dsh_client_store.createSnapshotStore)(initial.value.availableProviders);
  const modelRoutes = (0, import_dsh_client_store.createSnapshotStore)(initial.value.modelRoutes);
  acceptedRevision = lastReadRevision;
  function refresh() {
    if (updating !== void 0 || acceptedRevision < 0 || isDisposed()) return;
    updating = (async () => {
      try {
        const result = await read();
        if (result?.ok) {
          preferences.set(result.value.preferences);
          translationLimit.set(result.value.maxTextChars);
          availableProviders.set(result.value.availableProviders);
          modelRoutes.set(result.value.modelRoutes);
          acceptedRevision = lastReadRevision;
        }
      } catch (_error) {
        if (!isDisposed()) ctx.logger.warn("cot-translation: could not refresh Host preferences and request limits");
      }
    })().finally(() => {
      updating = void 0;
      if (revision !== lastReadRevision && !isDisposed()) refresh();
    });
  }
  const scope = ctx.configForms.get("yu1745-cot-translation");
  ctx.effect(() => scope.subscribe(invalidate));
  ctx.effect(() => ctx.locale.register(NS, { en, zh, ja, es, fr, de, ru, pt }));
  const form = new TranslationPreferencesForm(scope);
  ctx.effect(() => () => {
    form.dispose();
  });
  const injected = (sessionId) => ({
    hooks: { preferences, translationLocale: ctx.locale, translationLimit },
    translate: async (request, signal) => {
      const assertCurrent = async () => {
        if (acceptedRevision !== revision) refresh();
        while (updating !== void 0) await updating;
        signal.throwIfAborted();
        const accepted = preferences.getSnapshot();
        if (isDisposed() || acceptedRevision !== revision || request.provider !== accepted.provider || accepted.provider === "configured-model" && request.modelRoute !== accepted.modelRoute || accepted.targetLanguage !== "auto" && request.targetLanguage !== accepted.targetLanguage || request.text.length > translationLimit.getSnapshot()) throw new Error("Translation preferences or limits changed");
      };
      await assertCurrent();
      const result = await ctx.remote.cotTranslation.translate({ ...request, sessionId }, signal);
      await assertCurrent();
      if (!result.ok) throw result.error;
      return result.value;
    }
  });
  ctx.slots.inject("conversation.chat.reasoning.body", () => ctx.slots.register({
    name: "conversation.chat.reasoning.body",
    locale: NS,
    inject: injected
  }, TranslationBody));
  ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
    name: "plugins.bundle.config",
    key: "@yu1745/dsh-cot-translation",
    locale: NS,
    inject: () => {
      const face = form.inject();
      return { ...face, hooks: { ...face.hooks, availableProviders, modelRoutes }, refreshProviders: invalidate };
    }
  }, TranslationSettings));
}
async function mountTranslation(ctx, contribution) {
  const lifetime = new AbortController();
  ctx.on("internal/plugin", (fiber) => {
    if (fiber === ctx.fiber && fiber.uid === null) lifetime.abort();
  });
  ctx.effect(() => () => {
    lifetime.abort();
  }, "cot-translation: query cancellation");
  const unmountRemote = await ctx.remote.$mount(contribution);
  const ui = ctx.inject(["remote.cotTranslation", ...inject.slice(1)], (child) => registerUi(child, lifetime));
  try {
    await ui;
  } catch (error) {
    await ui.dispose();
    await unmountRemote();
    throw error;
  }
  return async () => {
    await ui.dispose();
    await unmountRemote();
  };
}

// controller/src/client/index.ts
async function apply(ctx) {
  return await mountTranslation(ctx, remote_default);
}

const plugin=module.exports;
return {...plugin,apply(ctx){
ctx.effect(()=>{const style=document.createElement('style');style.textContent="/* controller/src/client/Translation.module.css */\n.Translation_toolbar {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 4px;\n  min-height: 28px;\n  margin-bottom: 4px;\n}\n.Translation_toolbar > .Translation_viewToggle {\n  margin-inline-start: -10px;\n  color: var(--dsw-alias-label-tertiary);\n}\n.Translation_toolbar > .Translation_viewToggle:active:not(:disabled),\n.Translation_toolbar > .Translation_viewToggle:focus-visible:not(:disabled) {\n  color: var(--dsw-alias-label-secondary);\n}\n@media (hover: hover) {\n  .Translation_toolbar > .Translation_viewToggle:hover:not(:disabled) {\n    color: var(--dsw-alias-label-secondary);\n  }\n}\n.Translation_failure {\n  color: var(--dsw-alias-label-primary);\n  font-size: var(--dsh-content-font-size-secondary, 13px);\n}\n.Translation_field {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.Translation_field label {\n  font-size: 13px;\n  color: var(--dsw-alias-label-primary);\n}\n.Translation_field select {\n  min-height: 32px;\n  border: 0.5px solid var(--dsw-alias-border-l4);\n  border-radius: var(--dsw-radius-md);\n  background: var(--dsw-alias-bg-base);\n  color: var(--dsw-alias-label-primary);\n  padding: 0 8px;\n  font: inherit;\n}\n.Translation_notice {\n  margin: 0;\n  font-size: 13px;\n  line-height: 20px;\n  color: var(--dsw-alias-label-secondary);\n}\n.Translation_spinner {\n  animation: Translation_cot-translation-spin 1s linear infinite;\n}\n@keyframes Translation_cot-translation-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .Translation_spinner {\n    animation: none;\n  }\n}\n";document.head.append(style);return ()=>style.remove();});
return plugin.apply(ctx);
}};
}});
