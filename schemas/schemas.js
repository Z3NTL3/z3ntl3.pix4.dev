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

// schemas/params.js
var params_exports = {};
__export(params_exports, {
  captureSchema: () => captureSchema,
  test: () => test
});
module.exports = __toCommonJS(params_exports);
var captureSchema = {
  $id: "/capture",
  type: "object",
  properties: {
    orderID: { type: "integer" }
  },
  required: ["orderID"]
};
var test = "ok";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  captureSchema,
  test
});
