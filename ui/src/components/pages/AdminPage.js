import React, { useEffect } from 'react'

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
                    <div className="ui top attached blue tabular menu">
                        <button className="item active" data-tab="dashboard">
                            Dashboard
                        </button>
                        <button className="item" data-tab="proposals">
                            Proposals
                        </button>
                        <button className="item" data-tab="sponsorInfo">
                            Sponsor Info
                        </button>
                        <button className="item" data-tab="students">
                            Students
                        </button>
                        <button className="item" data-tab="coaches">
                            Coaches
                        </button>
                        <button className="item" data-tab="teamFiles">
                            Team Files
                        </button>
                    </div>
                    <div id="dashboard" className="ui bottom attached segment tab active" data-tab="dashboard" >
                        
                        
                    </div>
                    <div id="proposals" className="ui bottom attached segment tab" data-tab="proposals">
                        <table id="proposalTable">
                            <tbody>
                                <tr><th>Proposal</th><th>Attachments</th></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="ui bottom attached segment tab" data-tab="sponsorInfo">
                        <p>sponsor info</p>
                    </div>
                    <div className="ui bottom attached segment tab" data-tab="students">
                        <p>Students table</p>
                    </div>
                    <div className="ui bottom attached segment tab" data-tab="coaches">
                        <p>Coaches</p>
                    </div>
                    <div className="ui bottom attached segment tab" data-tab="teamFiles">
                        <h2>Semester X</h2>
                        <div style={{border: "1px solid black", width: "100%", height: "30px"}}>
                            <h3>Test Team 1</h3>
                            <h4>Files</h4>
                            <div ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
