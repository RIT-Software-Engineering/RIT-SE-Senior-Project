import React from "react";

function Header() {

    return (
        <div className="two column row">
            <div className="column" style={{paddingLeft: "0em"}}>
                <h1 id="mainHeader" className="ui header">
                    Senior Project
                    <div id="subHeader" className="sub header">Department of Software Engineering, RIT</div>
                </h1>
            </div>

            <div className="column" style={{paddingRight: "0em"}}>
                <div id="navButtons" className="ui right floated buttons">
                    <button className="ui button" onClick={() => {window.location.href = '/'}}>Home</button>
                    <button className="ui button" onClick={() => {window.location.href = '/sponsor'}}>Sponsor a Project</button>
                </div>
            </div>
        </div>
    );
}

export default Header;