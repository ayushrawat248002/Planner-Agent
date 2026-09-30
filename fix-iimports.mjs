import fs from "fs";
import path from "path";

const ROOT = "./server";

function walk(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, file.name);

    if (file.isDirectory()) {
      walk(full);
    } else if (file.name.endsWith(".ts")) {
      fixFile(full);
    }
  }
}

function fixFile(file) {
  let code = fs.readFileSync(file, "utf8");

  code = code.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (_, start, p, end) => {
      if (
        p.endsWith(".js") ||
        p.endsWith(".ts") ||
        p.endsWith(".json")
      ) {
        return start + p + end;
      }

      return start + p + ".js" + end;
    }
  );

  code = code.replace(
    /(import\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g,
    (_, start, p, end) => {
      if (
        p.endsWith(".js") ||
        p.endsWith(".ts") ||
        p.endsWith(".json")
      ) {
        return start + p + end;
      }

      return start + p + ".js" + end;
    }
  );

  fs.writeFileSync(file, code);
  console.log("✓", file);
}

walk(ROOT);
console.log("Done!");