from pathlib import Path
from textwrap import dedent

path = Path(r"ui\src\components\shared\allPages\Footer.js")
text = path.read_text()

import_line = 'import React, { useContext, useEffect, useState } from "react";'
new_import_line = 'import React, { useContext, useEffect, useMemo, useState } from "react";'
if import_line in text:
    text = text.replace(import_line, new_import_line, 1)
elif new_import_line not in text:
    raise SystemExit("Expected React import line not found")

old_block = dedent("""\
  useEffect(() => {
    const footerName = signedIn ? "loggedInFooter" : "loggedOutFooter";
    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)
      .then((r) => r.json())
      .then((data) => {
        const html = data?.[0]?.html || "";
        setFooterHtml(html);
      })
      .catch(() => setFooterHtml(""));
  }, [signedIn]);
""")

new_block = dedent("""\
  const footerName = useMemo(() => {
    if (!user || Object.keys(user).length === 0) {
      return "loggedOutFooter";
    }
    return signedIn ? "loggedInFooter" : "loggedOutFooter";
  }, [user, signedIn]);

  useEffect(() => {
    let isCancelled = false;

    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isCancelled) {
          const html = data?.[0]?.html || "";
          setFooterHtml(html);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setFooterHtml("");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [footerName]);
""")

if old_block not in text:
    raise SystemExit("Expected footer effect block not found")

text = text.replace(old_block, new_block, 1)
path.write_text(text)
