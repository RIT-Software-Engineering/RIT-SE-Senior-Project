import React from "react";

function Footer() {
    return (
        <footer>
            <div style={{ minHeight: "8em", width: "100%", backgroundColor: "#747474" }} className="ui basic segment">
                <br />
                <div className="ui container stackable grid">
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
                                <i className="ui mail icon"></i> contact@seniorproject.se.rit.edu
                            </h4>
                        </div>
                    </div>
                    <div className="centered row">
                        <h5>
                            <i className="ui icon copyright"></i> 2020 All Rights Reserved
                        </h5>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
