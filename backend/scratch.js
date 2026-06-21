const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const schema = z.object({
  foo: z.string()
});

console.log(JSON.stringify(zodToJsonSchema(schema), null, 2));
console.log("WITH NAME:");
console.log(JSON.stringify(zodToJsonSchema(schema, "mySchema"), null, 2));
