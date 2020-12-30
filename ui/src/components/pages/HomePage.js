import React, {useState, useEffect} from 'react';
import ExemplaryProject from './ExemplaryProject';
import Header from './../shared/Header';
import Footer from './../shared/Footer';

function HomePage() {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/db/selectExemplary')
            .then(response => response.json())
            .then(data => {
                setProjects(data);
            })
    }, [setProjects])

    return (
        <div id="page">
        
        <div className="ui inverted basic blue segment" style={{height: "6em", width: "100%", position: "absolute", left: 0, top: 0,  zIndex: "-1"}}>
            
        </div>
        <br/>
        <div id="contentGrid" className="ui stackable grid container">
            <Header />
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
                {projects.map((project, idx) => {
                    return <ExemplaryProject project={project} key={idx}/>
                })}
            </div>
        </div>
        <br/>
        <Footer />

    </div>
    )
}

export default HomePage
