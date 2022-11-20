import React, {useEffect, useState} from "react";
import {SecureFetch} from "../util/functions/secureFetch";
import {config} from "../util/functions/constants";
import InnerHTML from 'dangerously-set-html-content';
import {Helmet} from "react-helmet";

function SponsorPage() {
    const [html, setHtml] = useState("")

    useEffect(() => {
        SecureFetch(`${config.url.API_GET_HTML}?name=sponsor`)
            .then((response) => response.json())
            .then((htmlData) => {
                setHtml(htmlData[0]?.html)
            })
    }, []);

    return (

        <div>
            {/* Open Graph Protocol */}
            <Helmet>
                <meta property="og:title" content="Sponsor a Senior Project - RIT Software Engineering"/>
                <meta property="og:type" content="website"/>
                <meta property="og:image" content="https://cdn.rit.edu/images/news/2020-09/aerial_drone_09-web.jpg"/>
                <meta property="og:url" content="https://seniorproject.se.rit.edu/sponsor"/>
                <meta property="og:description" content=
                    "Become a Senior Project Sponsor for the RIT Software Engineering Department"/>
            </Helmet>
            {html !== "" &&  <InnerHTML html={html} /> }
        </div>

    )
}
export default SponsorPage;
