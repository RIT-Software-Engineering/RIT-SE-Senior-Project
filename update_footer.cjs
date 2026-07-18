const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const path = resolve("ui/src/components/shared/allPages/Footer.js");
let text = readFileSync(path, "utf8");

const importLine = 'import React, { useContext, useEffect, useState } from "react";';
const newImportLine = 'import React, { useContext, useEffect, useMemo, useState } from "react";';

if (text.includes(importLine)) {
  text = text.replace(importLine, newImportLine);
} else if (!text.includes(newImportLine)) {
  throw new Error("Expected React import line not found");
}

const oldBlock = [
  "  useEffect(() => {",
  "    const footerName = signedIn ? \"loggedInFooter\" : \"loggedOutFooter\";",
  "    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)",
  "      .then((r) => r.json())",
  "      .then((data) => {",
  "        const html = data?.[0]?.html || \"\";",
  "        setFooterHtml(html);",
  "      })",
  "      .catch(() => setFooterHtml(\"\"));",
  "  }, [signedIn]);",
  ""
].join("\n");

const newBlock = [
  "  const footerName = useMemo(() => {",
  "    if (!user || Object.keys(user).length === 0) {",
  "      return \"loggedOutFooter\";",
  "    }",
  "    return signedIn ? \"loggedInFooter\" : \"loggedOutFooter\";",
  "  }, [user, signedIn]);",
  "",
  "  useEffect(() => {",
  "    let isCancelled = false;",
  "",
  "    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)",
  "      .then((r) => r.json())",
  "      .then((data) => {",
  "        if (!isCancelled) {",
  "          const html = data?.[0]?.html || \"\";",
  "          setFooterHtml(html);",
  "        }",
  "      })",
  "      .catch(() => {",
  "        if (!isCancelled) {",
  "          setFooterHtml(\"\");",
  "        }",
  "      });",
  "",
  "    return () => {",
  "      isCancelled = true;",
  "    };",
  "  }, [footerName]);",
  ""
].join("\n");

if (!text.includes(oldBlock)) {
  throw new Error("Expected footer effect block not found");
}

text = text.replace(oldBlock, newBlock);
writeFileSync(path, text);
