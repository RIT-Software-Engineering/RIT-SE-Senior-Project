import React, { useEffect, useState } from 'react'
import { Tab } from 'semantic-ui-react'
import ActionModal from './../shared/ActionModal';
import TimelineElement from "../shared/TimelineElement";

export default function AdminPage() {

    let [timelines, setTimelines] = useState([]);
    let timelineData = [];

    useEffect(() => {
        fetch("http://localhost:3001/db/getActiveTimelines")
            .then((response) => response.json())
            .then((timelinesData) => {
                timelineData = timelinesData;
                let timelineElementArray = [];
                for(let i = 0; i < timelinesData.length; i++){
                    let data = timelinesData[i];
                    timelineElementArray.push(<TimelineElement {...data} />);
                }
                setTimelines(timelineElementArray);

            })
            .catch((error) => {
                alert("Failed to get data" + error);
            })
    }, [timelineData]);

    const panes = [
        //{ menuItem: 'Dashboard', render: () => <Tab.Pane><ActionModal action_title="H" page_html="<p>H</p>" id={42}/></Tab.Pane> },
        { menuItem: 'Dashboard', render: () => <Tab.Pane>{timelines}</Tab.Pane> },
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
