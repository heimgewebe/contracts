import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addCustomFormats from "./ajv-formats.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const schemaDir = path.join(rootDir, "json");
const fixturesDir = path.join(rootDir, "fixtures");

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }
      return fullPath;
    }),
  );
  return files.flat();
}

async function loadJsonLines(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function main() {
  const schemaFiles = (await collectFiles(schemaDir)).filter((file) =>
    file.endsWith(".schema.json"),
  );

  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addCustomFormats(ajv);

  let hasErrors = false;

  for (const schemaFile of schemaFiles) {
    const schemaSource = await fs.readFile(schemaFile, "utf8");
    const schema = JSON.parse(schemaSource);
    const validate = ajv.compile(schema);

    const schemaName = path.basename(schemaFile, ".schema.json");
    const fixturePath = path.join(fixturesDir, `${schemaName}.jsonl`);

    let instances = [];
    try {
      instances = await loadJsonLines(fixturePath);
    } catch (error) {
      console.error(
        `::notice::No fixtures found for schema ${schemaName}: ${fixturePath}`,
      );
      continue;
    }

    for (const [index, instance] of instances.entries()) {
      const valid = validate(instance);
      if (!valid) {
        hasErrors = true;
        console.error(`Validation failed for ${schemaName} line ${index + 1}`);
        console.error(validate.errors);
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
