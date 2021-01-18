import React, { useEffect, useState } from 'react'
import { Tab } from 'semantic-ui-react'
import Proposals from '../shared/Proposals';
import TimeLines from '../shared/TimeLines';
import './../../css/admin.css'
import SemesterEditor from "../shared/SemesterEditor";
import ActionEditor from "../shared/ActionEditor";

export default function AdminPage() {

    const panes = [
        { menuItem: 'Dashboard', render: () => <Tab.Pane><TimeLines/></Tab.Pane> },
        { menuItem: 'Proposals', render: () => <Tab.Pane><Proposals/></Tab.Pane> },
        { menuItem: 'Sponsor Info', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Students', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Coaches', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Team Files', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
        { menuItem: 'Admin', render: () => <Tab.Pane>
                <SemesterEditor />
                <ActionEditor />
        </Tab.Pane> },
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
                    <Tab panes={panes} className="admin-menu"/>
                </div>
            </div>
        </div>
    )
}
