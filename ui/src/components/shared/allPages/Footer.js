import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../util/functions/UserContext";
import { config } from "../../util/functions/constants";
import { SecureFetch } from "../../util/functions/secureFetch";
import InnerHTML from "dangerously-set-html-content";
import "./../../../css/containers/footer.css";
import "semantic-ui-css/semantic.min.css"

function Footer() {
  const { user } = useContext(UserContext);
  const [footerHtml, setFooterHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const signedIn = user && Object.keys(user).length > 0 && user.user;
    
    const footerName = signedIn ? "loggedInFooter" : "loggedOutFooter";
    
    setIsLoading(true);
    SecureFetch(`${config.url.API_GET_HTML}?name=${footerName}`)
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        const html = data?.[0]?.html || "";
        setFooterHtml(html);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching footer:", error);
        setFooterHtml("");
        setIsLoading(false);
      });
  }, [user]); 
  if (isLoading) {
    return (
      <div id="footer">
        <div style={{ padding: "10px", textAlign: "center" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div id="footer">
      {footerHtml ? <InnerHTML html={footerHtml} /> : null}
    </div>
  );
}

export default Footer;  