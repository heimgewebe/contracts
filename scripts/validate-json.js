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

function removeExtension(filePath, extension) {
  return filePath.endsWith(extension)
    ? filePath.slice(0, -extension.length)
    : filePath;
}

function normalizeRelativePath(filePath) {
  return filePath.split(path.sep).join("/");
}

async function main() {
  let hasErrors = false;

  const collectFilesOrEmpty = async (directory, label) => {
    try {
      return await collectFiles(directory);
    } catch (error) {
      if (error && error.code === "ENOENT") {
        hasErrors = true;
        console.error(`::error::Missing ${label} directory: ${directory}`);
        return [];
      }
      throw error;
    }
  };

  const schemaFiles = (await collectFilesOrEmpty(schemaDir, "schema")).filter(
    (file) => file.endsWith(".schema.json"),
  );
  const fixtureFiles = (
    await collectFilesOrEmpty(fixturesDir, "fixture")
  ).filter((file) => file.endsWith(".jsonl"));
  const fixtureNames = new Set(
    fixtureFiles.map((file) =>
      normalizeRelativePath(
        removeExtension(path.relative(fixturesDir, file), ".jsonl"),
      ),
    ),
  );

  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addCustomFormats(ajv);

  for (const schemaFile of schemaFiles) {
    const schemaSource = await fs.readFile(schemaFile, "utf8");
    const schema = JSON.parse(schemaSource);
    const validate = ajv.compile(schema);

    const schemaName = removeExtension(
      normalizeRelativePath(path.relative(schemaDir, schemaFile)),
      ".schema.json",
    );
    const fixturePath = path.join(fixturesDir, `${schemaName}.jsonl`);

    let instances = [];
    try {
      instances = await loadJsonLines(fixturePath);
    } catch (error) {
      if (error && error.code === "ENOENT") {
        hasErrors = true;
        console.error(
          `::error::No fixtures found for schema ${schemaName}: ${fixturePath}`,
        );
        continue;
      }
      hasErrors = true;
      console.error(
        `::error::Failed to load fixtures for schema ${schemaName}: ${fixturePath}`,
      );
      console.error(error);
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
    fixtureNames.delete(schemaName);
  }

  if (fixtureNames.size > 0) {
    hasErrors = true;
    for (const fixtureName of fixtureNames) {
      console.error(
        `::error::No schema found for fixture ${fixtureName}: ${path.join(
          fixturesDir,
          `${fixtureName}.jsonl`,
        )}`,
      );
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
