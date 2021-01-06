import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'

export default function AdminPage() {

    useEffect(() => {
        fetch("http://localhost:3001/db/getActiveTimelines")
            .then((response) => response.json())
            .then((timelines) => {
                console.log(timelines);
            })
            .catch((error) => {
                alert("Failed to get data" + error);
            })
    }, [])

    const panes = [
        { menuItem: 'Dashboard', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Proposals', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Sponsor Info', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Students', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Coaches', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Team Files', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
    ]

    return (
        <div id="page">
            <div className="ui inverted basic blue segment" style={{height: "6em", width: "100%", position: "absolute", left: "0", top: "0",  zIndex: -1}}>
            </div>
            <br />
            <div className="ui container grid">
                <div className="row">
                    <h1 className="ui header">
                        Senior Project
                        <div className="sub header" style={{color:"rgb(218, 218, 218)", fontWeight: "400"}}>Administrative Interface</div>
                    </h1>
                </div>
                <div className="row">
                    <Tab panes={panes} className="menu"/>
                </div>
            </div>
        </div>
    )
}
