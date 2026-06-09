import fs from "fs";

const filePath = "D:/WebstormProjects/openscreen/electron/ipc/handlers.ts";
let content = fs.readFileSync(filePath, "utf8");

// The broken files have literal newlines inside single-quoted strings in split/join calls.
// We need to find: .split('\n\t').slice(-5).join('\n\t')
// where \n is a literal newline and \t is a literal tab
// and replace with: .split('\\n').slice(-5).join('\\n')
// where \\n is the actual two characters backslash + n

// Match the broken pattern across lines
const brokenRegex = /\.split\('[\r\n]+\t+'\)\.slice\(-5\)\.join\('[\r\n]+\t+'\)/gs;

const fixed = ".split('\\n').slice(-5).join('\\n')";

content = content.replace(brokenRegex, fixed);

// Verify
const idx = content.indexOf("stderrTail");
if (idx >= 0) {
  const snippet = content.substring(idx, idx + 70);
  console.log("Fixed snippet:", JSON.stringify(snippet));
  console.log("Has literal newline:", snippet.includes("'\n'"));
  console.log("Has escaped n:", snippet.includes("'\\n'"));
}

fs.writeFileSync(filePath, content);
console.log("Done");
