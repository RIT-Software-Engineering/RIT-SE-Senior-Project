import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Form, Radio } from 'semantic-ui-react'
import Header from './../shared/Header';
import Footer from './../shared/Footer';

const MODAL_STATUS = {SUCCESS: "success", FAIL: "fail", CLOSED: false};

function ProposalPage() {

    const history = useHistory();
    const [formData, setActualFormData] = useState({});
    const [modalOpen, setModalOpen] = useState(MODAL_STATUS.CLOSED);

    const setFormData = (event) => {
        const target = event.target;
        let value;
        switch (target.type) {
            case "textarea":
            case "text":
            case "radio":
                value = target.value;
                break;
            case "checkbox":
                value = target.checked;
                break;
            case "file":
                value = target.files[0];
                break;
            default:
                console.error("Input type not handled...not setting data");
                return;
        }
        const name = target.name;
    
        setActualFormData({
            ...formData,
            [name]: value
        });
    }

    // Semantic UI inputs pass data in a different format than regular HTML5 inputs so this function manipulates the 
    // data before sending to setFormData()
    // TODO: Consider changing rest of inputs on this page to SemanticUI inputs and covert the setFormData function to
    // handle Semantic UI inputs instead of regular HTML5 inputs 
    const setFormDataSemanticUI = (value, name) => {
        setFormData({target: {type: 'radio', value: value, name: name}})
    }

    const submitMockProposal = async (event) => {
        event.preventDefault();

        const body = new FormData();
        Object.keys(formData).forEach((key) => {
            body.append(key, formData[key]);
        })

        fetch('http://localhost:3001/db/submitProposal',{
            method: "post",
            body: body,
        }).then((response) => {
            if(response.status === 200) {
                setModalOpen(MODAL_STATUS.SUCCESS)
            } else {
                setModalOpen(MODAL_STATUS.FAIL)
            }
        }).catch((error) => {
            // TODO: Redirect to failed page or handle errors
            console.error(error);
        })
    }

    const generateModalContent = () => {
        switch (modalOpen) {
            case MODAL_STATUS.SUCCESS:
                return (
                    <h1>Success</h1>
                )
            case MODAL_STATUS.FAIL:
                return (
                    <h1>Submission failed</h1>
                )
            default:
                return;
        }
    }

    const generateModalActions = () => {
        switch (modalOpen) {
            case MODAL_STATUS.SUCCESS:
                return [{content:"Yay!", positive: true, key:0}];
            case MODAL_STATUS.FAIL:
                return [{content:"Keep editing...", positive: true, key:0}];
            default:
                return;
        }
    }

    const closeModal = () => {
        switch (modalOpen) {
            case MODAL_STATUS.SUCCESS:
                setActualFormData({})
                setModalOpen(MODAL_STATUS.CLOSED);
                break;
                case MODAL_STATUS.FAIL:
                setModalOpen(MODAL_STATUS.CLOSED);
                break; 
            default:
                console.error(`MODAL_STATUS of '${modalOpen}' not handled`);
        }
    }

    console.log("formData.sponsor_avail_checked", formData.sponsor_avail_checked);

    return (
        <div id="page">
            <Modal
                open={!!modalOpen}
                content={generateModalContent()}
                actions={generateModalActions()}
                onClose={() => closeModal()}
                dimmer="blurring"
            />
            <div className="ui inverted basic blue segment" style={{height: "6em", width: "100%", position: "absolute", left: 0, top: 0,  zIndex: -1}}>
            </div>
            <br />
            <div className="ui container grid">
                <Header/>
                <div className="row">
                    <h2>Submit A Project Proposal</h2>
                </div>
                <Form id="proposalForm" className="ui form" onSubmit={(e) => {submitMockProposal(e)}} >
                    <Form.Field>
                        <label>Project Title</label>
                        <input name="title" value={formData.title || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>

                    <Form.Field>
                        <label>Organization Name</label>
                        <input name="organization" value={formData.organization || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>

                    <Form.Field>
                        <label>Primary Contact Name</label>
                        <input name="primary_contact" value={formData.primary_contact || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>
                    <div className="two fields">
                        <Form.Field>
                            <label>Email</label>
                            <input name="contact_email" value={formData.contact_email || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                        </Form.Field>

                        <Form.Field>
                            <label>Phone</label>
                            <input name="contact_phone" value={formData.contact_phone || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                        </Form.Field>
                    </div>

                    <Form.Field>
                        <label>Add additional PDF or image resources:</label>
                        <input name="attachments" value={formData.attachments || ""} type="file" accept=".pdf, .png, .jpg, .jpeg" multiple onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>

                    <Form.Field>
                        <label>Project Background Information</label>
                        <textarea name="background_info" value={formData.background_info || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>
                    
                    <Form.Field>
                        <label>Project Description</label>
                        <textarea name="project_description" value={formData.project_description || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Project Scope</label>
                        <textarea name="project_scope" value={formData.project_scope || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Project Challenges</label>
                        <textarea name="project_challenges" value={formData.project_challenges || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Constraints & Assumptions</label>
                        <textarea name="constraints_assumptions" value={formData.constraints_assumptions || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Sponsor-Provided Resources</label>
                        <textarea name="sponsor_provided_resources" value={formData.sponsor_provided_resources || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Project Search Keywords</label>
                        <input name="project_search_keywords" value={formData.project_search_keywords || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>

                    <Form.Field>
                        <label>Sponsor and Project Specific Deliverables</label>
                        <textarea name="sponsor_deliverables" value={formData.sponsor_deliverables || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <Form.Field>
                        <label>Proprietary Information</label>
                        <textarea name="proprietary_info" value={formData.proprietary_info || ""} onChange={(e)=>{setFormData(e)}} ></textarea>
                    </Form.Field>

                    <br />
                    <div className="ui divider"></div>

                    <h3>Sponsor Availability</h3>
                    <p>Sponsor personnel will be available to meet with the team once per week during the time set for meeting with the sponsor which is 
                        Tuesday and Thursday (fall/spring) or Monday and Wednesday (spring/summer) from 5:00 – 6:15pm Eastern US time. We will give a selection 
                        preference to proposals whose sponsors are available during this time.
                    </p>
                    
                    <Form.Field>
                        <div className="ui checkbox">
                            <input name="sponsor_avail_checked" checked={formData.sponsor_avail_checked || false} type="checkbox" tabIndex="0" onChange={(e)=>{setFormData(e)}}/>
                            <label>I agree</label>
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <label>If you will not be available during the standard senior project meeting time above, please give your timing constraints.</label>
                        <input name="sponsor_alternate_time" value={formData.sponsor_alternate_time || ""} type="text" onChange={(e)=>{setFormData(e)}} />
                    </Form.Field>

                    <br />
                    <div className="ui divider"></div>

                    <h3>Project Agreements and Assignment of Rights</h3>
                    <p>RIT policy gives students full ownership of any work done as part of coursework which includes their work on senior project. 
                        As the sponsor of a course project, you can select one of three approaches for dealing with ownership of project artifacts 
                        and intellectual property, and the disclosure of proprietary information. If you seek assignment of rights, the individual 
                        team members will sign a project agreement based on the rights that you want.
                    </p>
                    <p>
                        Please get any corporate and legal clearances that you feel are needed to use the unmodified project agreement, before 
                        submitting your project proposal. This is necessary to prevent any delays in starting a project. A team will not be assigned 
                        to a project if the sponsor has not confirmed that the project agreements are OK. Indicate that this has been done by checking 
                        box below.
                    </p>
                    <h4>Corporate and Legal Clearance of Project Agreement</h4>
                            <p>
                                We have the necessary corporate or legal clearances to use the unmodified project agreement. 
                                (Note: The project agreements are cleared for RIT internal projects.)
                            </p>
                    <Form.Field>
                        <div className="ui checkbox">
                            <input name="project_agreements_checked" checked={formData.project_agreements_checked || false} type="checkbox" tabIndex="0" onChange={(e)=>{setFormData(e)}}/>
                            <label>I agree</label>
                        </div>
                    </Form.Field>
                    
                    <br /> 

                    <div className="grouped fields">
                        <h3>Assignment of Rights</h3>
                        <p>Select one of the following approaches for assignment of the rights to the project artifacts and intellectual property, 
                            and the disclosure of proprietary information. 
                        </p>
                        <Form.Field>
                            <div className="ui radio checkbox">
                                <Radio 
                                    label="Assignment of Full Rights"
                                    name="assignment_of_rights"
                                    checked={formData.assignment_of_rights === "full_rights"}
                                    value="full_rights"
                                    tabIndex="0"
                                    onChange={(e, {value})=>{setFormDataSemanticUI(value, 'assignment_of_rights')}}
                                />
                                <br />
                                <p>If a team is assigned to this project, all students on the team will sign a standard Student Course 
                                    Project Intellectual Property and Non-Disclosure Agreement.  This agreement assigns the rights to 
                                    the team’s project work to the sponsor, and describes the process whereby the project sponsor can 
                                    reveal proprietary information to the team. For non-RIT projects, the faculty coach will sign a 
                                    standard Faculty Course Project Non-Disclosure Agreement which describes the same process for 
                                    revealing proprietary information.
                                </p>
                            </div>
                        </Form.Field>
                        <div className="ui hidden divider"></div>
                        <Form.Field>
                            <div className="ui radio checkbox">
                                <Radio
                                    label="Assignment of Limited Use Rights"
                                    name="assignment_of_rights"
                                    checked={formData.assignment_of_rights === "limited_use"}
                                    value="limited_use"
                                    tabIndex="0"
                                    onChange={(e, {value})=>{setFormDataSemanticUI(value, 'assignment_of_rights')}}
                                />
                                <br />
                                <p>
                                    If a team is assigned to this project, all students on the team will sign a standard Student Course 
                                    Project Limited Use and Non-Disclosure Agreement.  This agreement assigns the sponsor rights to the 
                                    team’s project work for internal or non-commercial use by the sponsor. The sponsor may maintain and 
                                    extend the project but not transfer it to a third party or use it in a commercial product. The project 
                                    team will retain patent and commercialization rights. The agreement also describes the process 
                                    whereby the project sponsor can reveal proprietary information to the team. For non-RIT projects, 
                                    the faculty coach will sign a standard Faculty Course Project Non-Disclosure Agreement which describes 
                                    the same process for revealing proprietary information.
                                </p>
                            </div>
                        </Form.Field>
                        <div className="ui hidden divider"></div>
                        <Form.Field>
                        <div className="ui radio checkbox">
                            <Radio
                                label="Open Source Project"
                                name="assignment_of_rights"
                                checked={formData.assignment_of_rights === "open_source"}
                                value="open_source"
                                tabIndex="0"
                                onChange={(e, {value})=>{setFormDataSemanticUI(value, 'assignment_of_rights')}}
                            />
                            <br />
                            <p>
                                If a team is assigned to this project, all students on the team will sign a standard Student Course 
                                Project Open Source Agreement. The team will develop this as an open source project and will publish 
                                all artifacts via an open source mechanism agreed upon through discussions with the project sponsor. 
                                The sponsor will gain access to project artifacts only through this open source repository. No rights 
                                need to be assigned exclusively to the project sponsor, and there will be no transfer of proprietary 
                                information.
                            </p>
                        </div>
                        </Form.Field>
                    </div>
                </Form>
                <br />
                <div className="row">
                    <h3>The agreements and policies can be found at:</h3>
                </div>
                <div className="row">
                    <ul>
                        <li>
                            <a target="_blank" rel="noreferrer" href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectAgreement.doc">
                                Student Course Project Intellectual Property and Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noreferrer" href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectLimitedAgreement.doc">
                                Student Course Project Limited Use and Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noreferrer" href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectOpenSourceAgreement.doc">
                                Student Course Project Open Source Agreement
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noreferrer" href="http://www.se.rit.edu/~swen-561/CourseInformation/FacultyCourseProjectAgreement.doc">
                                Faculty Course Project Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a target="_blank" rel="noreferrer" href="http://www.rit.edu/academicaffairs/policiesmanual/c030">
                                RIT Intellectual Property Policy C03.0. The project agreements are consistent with section C03.0 1.V.B.2
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <h3>Please review your answers before submitting.</h3>
                </div>

                <div className="two column row">
                    <div className="column">
                        <button className="ui deny left floated left labeled icon button" onClick={() => {history.push('/sponsor')}}>
                            Cancel
                            <i className="times icon"></i>
                        </button>
                    </div>
                    <div className="column">
                        <button id="formSubmit" className="ui blue right floated left labeled icon button" form="proposalForm">
                            Submit
                            <i className="checkmark icon"></i>
                        </button>
                    </div>
                </div>

                <div className="row"></div>
            </div>
            <Footer/>
        </div>
    )
}

export default ProposalPage
