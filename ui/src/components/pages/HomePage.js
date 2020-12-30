import React, {useState, useEffect} from 'react'

function HomePage() {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/db/selectExemplary')
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log(data);
            })
    })

    return (
        <div id="page">
        
        <div className="ui inverted basic blue segment" style={{height: "6em", width: "100%", position: "absolute", left: 0, top: 0,  zIndex: "-1"}}>
            
        </div>
        <br/>
        <div id="contentGrid" className="ui stackable grid container">
            <div className="two column row">
                <div className="column" style={{paddingLeft: "0em"}}>
                    <h1 id="mainHeader" className="ui header" >
                        
                        Senior Project
                        <div className="sub header" style={{color:"rgb(218, 218, 218)", fontWeight: 600}}>Department of Software Engineering, RIT</div>
                    </h1>
                </div>
                
                <div className="column" style={{paddingRight: "0em"}}>
                    <div id="navButtons" className="ui right floated buttons">
                        <button className="ui button" onClick={() => {window.location.href = '/'}}>Home</button>
                        <button className="ui button" onClick={() => {window.location.href = '/sponsor'}}>Sponsor a Project</button>
                    </div>
                </div>
                
            </div>
            <div className="row">
                <h2>Overview</h2>
            </div>
            <div className="row">
                <p className="overviewText" >Senior Project is a capstone course completed by every Software Engineering senior. 
                    Small teams of students are assigned to solve challenging, real-world software issues 
                    for companies and organizations. External corporate and non-profit sponsors submit proposals 
                    for projects that teams of 4 or 5 students will work on.</p>
                <p className="overviewText" >Over the course of two terms, each team works with a project sponsor, applying the software engineering 
                    skills that the students learned in class and on co-op. They carry the project from inception through an entire software 
                    development lifecycle. The end result is a functional software tool ready for use by the sponsor's organization.</p>
            </div>
            
            <div className="ui divider"></div>
            
            <div className="row">
                <h2>Exemplary Projects</h2>
            </div>
            <div className="ui hidden divider"></div>
            
            <div id="exemplaryProjectsDiv">
                {/* <!-- Attach exemplary project elements here --> */}
                
            </div>
        </div>
        <br/>
        <footer>
            <div style={{minHeight: "8em", width: "100%", backgroundColor: "#747474"}} className="ui basic segment">
                <br/>
                <div className="ui container stackable grid">
                    <div className="three column row">
                        <div className="column">
                            <h3>B. THOMAS GOLISANO <br/>
                                COLLEGE OF COMPUTING & <br/>
                                INFORMATION SCIENCES    
                            </h3>
                        </div>
                        <div className="column">
                            <h4>Department of Software Engineering<br/>
                                Golisano Building 70, Room 1690<br/>
                                134 Lomb Memorial Drive<br/>
                                Rochester, NY 14623-5608</h4>
                        </div>
                        <div className="column">
                            <h4><i className="ui mail icon"></i> contact@seniorproject.se.rit.edu</h4>
                        </div>
                    </div>
                    <div className="centered row">
                        <h5><i className="ui icon copyright"></i> 2020 All Rights Reserved</h5>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    )
}

export default HomePage
