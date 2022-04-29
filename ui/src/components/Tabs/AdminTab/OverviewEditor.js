import React, { useEffect, useState } from 'react';
import {Form, Button, Accordion} from 'semantic-ui-react';
import { config } from '../../util/functions/constants';
import { SecureFetch } from '../../util/functions/secureFetch';

const PAGE = {OVERVIEW: "Overview", SPONSOR: "Sponsor"};

export default function OverviewEditor(){

    //TODO: Add environment variables of the types of page that you could be editing.

    const [html, setHtml] = useState({})
    const [htmlChanges, setHtmlChanges] = useState({})
    const [response, setResponse] = useState(null)
    const [page, setPage] = useState("") //This is for which page is getting a html value added to it.

    useEffect(() => {
        //secure fetch whatever is stored inside the overview html file.
        SecureFetch(`${config.url.API_GET_HTML}`)
            .then((response) => response.json())
            .then((htmlData) => {
                console.log("This is the htmlData ", htmlData)
                let htmlMap = {};
                htmlData.forEach((table) => {
                    htmlMap[table.name] = table.html;
                })
                setHtml(htmlMap);
            })
            .catch((err) => console.log(err))
    },[]);

    //Send changed html inside the text area to the respective file or database.
    const uploadHtml = (event) => {
        event.preventDefault();
        if(html === {}){
            alert("Must contain data to submit")
            return
        }
        const body = new FormData();
        Object.keys(html).forEach((key) =>{
            body.append(key, html[key]);
        })
        SecureFetch(config.url.API_POST_EDIT_PAGE, {
            method: "post",
            body: body,
        })
            .then((response) => response.json())
            .then(response => {
                console.log(response);
                setResponse(response)
            })
            .catch((err) => {
                alert("didn't work bucko: " + err);
            })
    }



    const htmlTables = (tableName) => {
        return (
                <Form.TextArea
                    placeholder={"If you see this text, that means there is nothing being displayed in the Overview."}
                    label={tableName}
                    key={tableName}
                    value={html[tableName]}
                    style={{ minHeight: 200 }}
                    onChange={e => {
                        let htmlChange = {...html, [tableName]: e.target.value};
                        setHtml(htmlChange);
                    }}
                />
        )
    };

    const renderTables = () => {
        let tableList = []
        for(let key of Object.keys(html)){
            tableList.push(htmlTables(key));
        }
        return tableList;
    }


    //TODO: MAKE FUNCTION FOR TAKING IN JSON RESPONSE FROM DB AND CREATING HTMLTABLES FROM IT.
    const OverviewTest = () => {
        return (
            <>
                {html !== {} &&
                    renderTables()
                }
                <Form.Field>
                    {response && <>
                        <label>{response.msg}</label>
                        {response.error && JSON.stringify(response.error)}
                    </>}
                </Form.Field>
                <Button type="submit">Update Html</Button>
            </>
        )
    }

    // const Overview = () => {
    //     return (
    //         <>
    //             <Form.Field>
    //                 <Form.TextArea
    //                     placeholder={"If you see this text, that means there is nothing being displayed in the Overview."}
    //                     label={"Overview Html"}
    //                     name={"overviewValueKey"}
    //                     value={html}
    //                     id={"overview"}
    //                     style={{ minHeight: 200 }}
    //                     onChange={e => setHtml(e.target.value)}
    //                 />
    //             </Form.Field>
    //             <Form.Field>
    //                 {response && <>
    //                     <label>{response.msg}</label>
    //                     {response.error && JSON.stringify(response.error)}
    //                 </>}
    //             </Form.Field>
    //             <Button type="submit">Update Overview</Button>
    //         </>
    //     )
    // }
    
    return (
        <>
        <Form
            onSubmit={uploadHtml}
        >
            <div>
                <Accordion
                    fluid
                    styled
                    panels={[
                        {
                            key: "pageEditor",
                            title: "Page Editor",
                            content: { content: OverviewTest() },
                        },
                    ]}
                />
            </div>
        </Form>
        </>
    )
}




