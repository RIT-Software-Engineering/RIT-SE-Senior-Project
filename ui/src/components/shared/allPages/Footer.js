import React, {useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import "../../../css/footer.css";
import {UserContext} from "../../util/functions/UserContext";

function Footer() {
    const history = useHistory();
    const { user } = useContext(UserContext);
    const [signedIn, setSignedIn] = useState(false);
    useEffect(() => {
        // A user is considered signed in if the user object has a value
        // This is set when the /whoami endpoint gets hit (currently happening in the Dashboard.js).
        setSignedIn(Object.keys(user).length !== 0);
    }, [user]);

    //What is this???
    // if (history.location.pathname === "/dashboard") {
    //     return <></>;
    // }

    if(signedIn){
        return (
            <div id="footer">
                <div id= "bringMeDown" className="ui container stackable grid">
                    <div className="three column row">
                        <div className="column">
                            <h5>
                                <a>https://seniorproject-sandbox.se.rit.edu</a>
                            </h5>
                        </div>
                        <div className="column">
                            <h5 id="copyright">
                                <i className="ui icon copyright"></i> Rochester Institute of Technology, All Rights Reserved
                            </h5>
                        </div>
                        <div className="column">
                            <h4>
                                <i className="ui mail icon"></i> seniorprojects@se.rit.edu
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div id="footer">
                <div id= "bringMeDownSignedIn" className="ui container stackable grid">
                    <div className="three column row">
                        <div className="column">
                            <h3>
                                B. THOMAS GOLISANO <br />
                                COLLEGE OF COMPUTING & <br />
                                INFORMATION SCIENCES
                            </h3>
                        </div>
                        <div className="column">
                            <h4>
                                Department of Software Engineering
                                <br />
                                Golisano Building 70, Room 1690
                                <br />
                                134 Lomb Memorial Drive
                                <br />
                                Rochester, NY 14623-5608
                            </h4>
                        </div>
                        <div className="column">
                            <h4>
                                <i className="ui mail icon"></i> seniorprojects@se.rit.edu
                            </h4>
                        </div>
                    </div>
                    <div className="centered row">
                        <h5>
                            <i className="ui icon copyright"></i> Rochester Institute of Technology, All Rights Reserved
                        </h5>
                    </div>
                </div>
            </div>
        );
    }

}



export default Footer;
