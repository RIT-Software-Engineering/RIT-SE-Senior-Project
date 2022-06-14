import React, {useEffect, useState} from "react";
import {SecureFetch} from "../util/functions/secureFetch";
import {config} from "../util/functions/constants";
import InnerHTML from 'dangerously-set-html-content';

function SponsorPage() {
    const [html, setHtml] = useState("")

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_HTML}?name=sponsor`)
            .then((response) => response.json())
            .then((htmlData) => {
                setHtml(htmlData[0].html)
            })
    }, []);

    return (
        <div>
            {html !== "" &&  <InnerHTML html={html} /> }
        </div>

    )
}
export default SponsorPage;
