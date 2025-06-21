// converter.js
function compileGrandma(content) {
  const lines = content.split('\n');
  let target = null;

  // Identify target language
  for (const line of lines) {
    if (line.startsWith("Grandma for")) {
      const match = line.match(/Grandma for "(.*?)"/);
      if (match) {
        target = match[1];
        break;
      }
    }
  }

  if (!target) {
    throw new Error("Missing 'Grandma for \"...\"' line.");
  }

  const output = [];
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("Grandma for")) continue;

    const parts = line.split(" ");
    const keyword = parts.shift();
    const args = parts.join(" ").match(/"[^"]*"|\S+/g) || [];

    if (target === "HTML") {
      if (keyword === "Header") {
        output.push(`<h1>${args.join(" ").replace(/"/g, "")}</h1>`);
      } else if (keyword === "Text") {
        output.push(`<p>${args.join(" ").replace(/"/g, "")}</p>`);
      }
      // Add more rules as needed
    } else if (target === "CSS") {
      if (keyword === "Rule") {
        output.push(`${args[0].replace(/"/g, "")} { ${args.slice(1).join(" ").replace(/"/g, "")} }`);
      }
    } else if (target === "JavaScript") {
      if (keyword === "Log") {
        output.push(`console.log(${args.join(" ")});`);
      }
    }
  }

  return output.join("\n");
}
