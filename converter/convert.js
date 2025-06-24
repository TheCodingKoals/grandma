function compileGrandma(content) {
  const lines = content.split('\n');
  let currentTarget = null;

  const htmlOutput = [];
  const jsOutput = [];
  const cssOutput = [];
  const arduinoOutput = [];
  const csharpOutput = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Switch between modes
    if (line.startsWith("Grandma for")) {
      const match = line.match(/Grandma for "(.*?)"/);
      if (match) {
        currentTarget = match[1];
      }
      continue;
    }

    const parts = line.split(" ");
    const keyword = parts.shift();
    const id = parts.shift();
    const rest = parts.join(" ").match(/"[^"]*"|\S+/g) || [];
    const text = rest.join(" ").replace(/"/g, "").trim();

    switch (currentTarget) {
      case "HTML":
        switch (keyword) {
          case "PageName":
            htmlOutput.push(`<title>${text}</title>`);
            break;
          case "Header":
            htmlOutput.push(`<h1 id="${id}">${text}</h1>`);
            break;
          case "SubHeader":
            htmlOutput.push(`<h2 id="${id}">${text}</h2>`);
            break;
          case "Text":
            htmlOutput.push(`<p id="${id}">${text}</p>`);
            break;
          case "Button":
            htmlOutput.push(`<button id="${id}">${text}</button>`);
            break;
          case "Space":
            htmlOutput.push(`<br>`);
            break;
        }
        break;

      case "JavaScript":
        switch (keyword) {
          case "Log":
            jsOutput.push(`console.log("${text}");`);
            break;
          case "Alert":
            jsOutput.push(`alert("${text}");`);
            break;
        }
        break;

      case "CSS":
        if (keyword === "Rule") {
          cssOutput.push(`${id} { ${rest.join(" ").replace(/"/g, "")} }`);
        }
        break;

      case "Arduino":
        switch (keyword) {
          case "PinWrite":
            const [pin, state] = rest;
            arduinoOutput.push(`digitalWrite(${pin}, ${state.toUpperCase()});`);
            break;
          case "SerialPrint":
            arduinoOutput.push(`Serial.println("${text}");`);
            break;
        }
        break;

      case "C#":
        switch (keyword) {
          case "ConsoleWriteLine":
            csharpOutput.push(`Console.WriteLine("${text}");`);
            break;
        }
        break;

      default:
        break;
    }
  }

  // Final Output
  let finalOutput = '';

  if (htmlOutput.length) {
    finalOutput += `<!DOCTYPE html>\n<html>\n<head>\n${htmlOutput.filter(line => line.startsWith("<title>")).join("\n")}`;
    if (cssOutput.length) {
      finalOutput += `\n<style>\n${cssOutput.join("\n")}\n</style>`;
    }
    finalOutput += `\n</head>\n<body>\n${htmlOutput.filter(line => !line.startsWith("<title>")).join("\n")}`;
    if (jsOutput.length) {
      finalOutput += `\n<script>\n${jsOutput.join("\n")}\n</script>`;
    }
    finalOutput += `\n</body>\n</html>`;
  } else if (arduinoOutput.length) {
    finalOutput += `// Arduino Output\n${arduinoOutput.join("\n")}`;
  } else if (csharpOutput.length) {
    finalOutput += `// C# Output\n${csharpOutput.join("\n")}`;
  }

  return finalOutput.trim();
}
