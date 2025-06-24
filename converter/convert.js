function compileGrandma(content) {
  const lines = content.split('\n');
  let target = null;

  const output = [];

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

  if (target === "HTML") {
    output.push(`<!DOCTYPE html>`);
    output.push(`<html>`);
    output.push(`<head>`);
    output.push(`</head>`);
    output.push(`<body>`);
  }

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("Grandma for")) continue;

    const parts = line.split(" ");
    const keyword = parts.shift();
    const id = parts.shift();
    const rest = parts.join(" ").match(/"[^"]*"|\S+/g) || [];
    const text = rest.join(" ").replace(/"/g, "");

    if (target === "HTML") {
      if (keyword === "PageName") {
        output.push(`<title>${text}</title>`);
      } else if (keyword === "Header") {
        output.push(`<h1 id="${id}">${text}</h1>`);
      } else if (keyword === "Text") {
        output.push(`<p id="${id}">${text}</p>`);
      } else if (keyword === "Button") {
        output.push(`<button id="${id}">${text}</button>`);
      } else if (keyword === "Space") {
        output.push(`<br>`);
      }
    } else if (target === "CSS") {
      if (keyword === "Rule") {
        output.push(`${id} { ${rest.join(" ").replace(/"/g, "")} }`);
      }
    } else if (target === "JavaScript") {
      if (keyword === "Log") {
        output.push(`console.log(${rest.join(" ")});`);
      }
    }
  }

  if (target === "HTML") {
    output.push(`</body>`);
    output.push(`</html>`);
  }

  return output.join("\n");
}
