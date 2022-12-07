const captureSchema = {
  $id: "/capture",
  type: "object",
  properties: {
    orderID: { type: "integer" },
  },
  required: ["orderID"],
};
export { captureSchema, test };
