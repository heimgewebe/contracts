export default function addCustomFormats(ajv) {
  ajv.addFormat("date-time", {
    type: "string",
    validate(value) {
      return typeof value === "string" && !Number.isNaN(Date.parse(value));
    },
  });
}
