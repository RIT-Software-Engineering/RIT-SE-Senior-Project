import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Form, Radio, Divider } from "semantic-ui-react";
import "../../css/proposal.css";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

function ProposalPage() {
    const history = useHistory();
    const [formData, setActualFormData] = useState({ assignment_of_rights: "full_rights" });
    const [formFiles, setFormFiles] = useState(null);
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
                setFormFiles(target.files);
                return;
            default:
                console.error("Input type not handled...not setting data");
                return;
        }
        const name = target.name;

        setActualFormData({
            ...formData,
            [name]: value,
        });
    };

    // Semantic UI inputs pass data in a different format than regular HTML5 inputs so this function manipulates the
    // data before sending to setFormData()
    // TODO: Consider changing rest of inputs on this page to SemanticUI inputs and covert the setFormData function to
    // handle Semantic UI inputs instead of regular HTML5 inputs
    const setFormDataSemanticUI = (value, name) => {
        setFormData({ target: { type: "radio", value: value, name: name } });
    };

    const submitProposal = async (event) => {
        event.preventDefault();

        if (modalOpen) {
            console.warn("Trying to submit proposal form while modal is open.");
            return;
        }

        const body = new FormData();
        Object.keys(formData).forEach((key) => {
            body.append(key, formData[key]);
        });

        for (let i = 0; i < formFiles?.length || 0; i++) {
            body.append("attachments", formFiles[i]);
        }

        fetch("http://localhost:3001/db/submitProposal", {
            method: "post",
            body: body,
        })
            .then((response) => {
                if (response.status === 200) {
                    setModalOpen(MODAL_STATUS.SUCCESS);
                } else {
                    setModalOpen(MODAL_STATUS.FAIL);
                }
            })
            .catch((error) => {
                // TODO: Redirect to failed page or handle errors
                console.error(error);
            });
    };

    const generateModalFields = () => {
        switch (modalOpen) {
            case MODAL_STATUS.SUCCESS:
                return {
                    header: "Success",
                    content:
                        "Your proposal has been received. We will review it and get back to you if our students decide to move forward with it",
                    actions: [{ header: "Success!", content: "Done", positive: true, key: 0 }],
                };
            case MODAL_STATUS.FAIL:
                return {
                    header: "There was an issue...",
                    content:
                        "We were unable to submit your proposal. You can try again later or contact our support team that we don't have...",
                    actions: [{ header: "There was an issue", content: "Keep editing...", positive: true, key: 0 }],
                };
            default:
                return;
        }
    };

    const closeModal = () => {
        switch (modalOpen) {
            case MODAL_STATUS.SUCCESS:
                setActualFormData({});
                setFormFiles(null);
                setModalOpen(MODAL_STATUS.CLOSED);
                break;
            case MODAL_STATUS.FAIL:
                setModalOpen(MODAL_STATUS.CLOSED);
                break;
            default:
                console.error(`MODAL_STATUS of '${modalOpen}' not handled`);
        }
    };

    return (
        <>
            <Modal open={!!modalOpen} {...generateModalFields()} onClose={() => closeModal()} dimmer="blurring" />
            <div className="row">
                <h2>Submit A Project Proposal</h2>
            </div>
            <Form
                id="proposalForm"
                className="ui form"
                onSubmit={(e) => {
                    submitProposal(e);
                }}
            >
                <Form.Input
                    required
                    label="Project Title"
                    name="title"
                    value={formData.title || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                />
                <Form.Input
                    required
                    label="Organization Name"
                    name="organization"
                    value={formData.organization || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                />
                <Form.Input
                    required
                    label="Primary Contact Name"
                    name="primary_contact"
                    value={formData.primary_contact || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                />
                <div className="two fields">
                    <Form.Input
                        required
                        label="Email"
                        name="contact_email"
                        value={formData.contact_email || ""}
                        onChange={(e) => {
                            setFormData(e);
                        }}
                    />
                    <Form.Input
                        required
                        label="Phone"
                        name="contact_phone"
                        value={formData.contact_phone || ""}
                        onChange={(e) => {
                            setFormData(e);
                        }}
                    />
                </div>

                <Form.Field>
                    <label>Add additional PDF or image resources:</label>
                    {/* TODO: this filed does not get reset when a proposal is submitted */}
                    <input
                        name="attachments"
                        type="file"
                        accept=".pdf, .png, .jpg, .jpeg"
                        multiple
                        onChange={(e) => {
                            setFormData(e);
                        }}
                    />
                </Form.Field>

                <Form.TextArea
                    required
                    label="Project Background Information"
                    name="background_info"
                    value={formData.background_info || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    required
                    label="Project Description"
                    name="project_description"
                    value={formData.project_description || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    required
                    label="Project Scope"
                    name="project_scope"
                    value={formData.project_scope || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    required
                    label="Project Challenges"
                    name="project_challenges"
                    value={formData.project_challenges || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    required
                    label="Constraints & Assumptions"
                    name="constraints_assumptions"
                    value={formData.constraints_assumptions || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    label="Sponsor-Provided Resources"
                    name="sponsor_provided_resources"
                    value={formData.sponsor_provided_resources || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.Input
                    label="Project Search Keywords"
                    name="project_search_keywords"
                    value={formData.project_search_keywords || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                />
                <Form.TextArea
                    required
                    label="Sponsor and Project Specific Deliverables"
                    name="sponsor_deliverables"
                    value={formData.sponsor_deliverables || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>
                <Form.TextArea
                    label="Proprietary Information"
                    name="proprietary_info"
                    value={formData.proprietary_info || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                ></Form.TextArea>

                <Divider section />

                <h3>Sponsor Availability</h3>
                <p>
                    Sponsor personnel will be available to meet with the team once per week during the time set for
                    meeting with the sponsor which is Tuesday and Thursday (fall/spring) or Monday and Wednesday
                    (spring/summer) from 5:00 – 6:15pm Eastern US time. We will give a selection preference to proposals
                    whose sponsors are available during this time.
                </p>

                <Form.Field required>
                    <div className="ui checkbox">
                        <input
                            required
                            name="sponsor_avail_checked"
                            checked={formData.sponsor_avail_checked || false}
                            type="checkbox"
                            onChange={(e) => {
                                setFormData(e);
                            }}
                        />
                        <label>I agree</label>
                    </div>
                </Form.Field>
                <Form.Input
                    label="If you will not be available during the standard senior project meeting time above, please give your timing constraints."
                    name="sponsor_alternate_time"
                    value={formData.sponsor_alternate_time || ""}
                    onChange={(e) => {
                        setFormData(e);
                    }}
                />

                <Divider section />

                <h3>Project Agreements and Assignment of Rights</h3>
                <p>
                    RIT policy gives students full ownership of any work done as part of coursework which includes their
                    work on senior project. As the sponsor of a course project, you can select one of three approaches
                    for dealing with ownership of project artifacts and intellectual property, and the disclosure of
                    proprietary information. If you seek assignment of rights, the individual team members will sign a
                    project agreement based on the rights that you want.
                </p>
                <p>
                    Please get any corporate and legal clearances that you feel are needed to use the unmodified project
                    agreement, before submitting your project proposal. This is necessary to prevent any delays in
                    starting a project. A team will not be assigned to a project if the sponsor has not confirmed that
                    the project agreements are OK. Indicate that this has been done by checking box below.
                </p>
                <h4>Corporate and Legal Clearance of Project Agreement</h4>
                <p>
                    We have the necessary corporate or legal clearances to use the unmodified project agreement. (Note:
                    The project agreements are cleared for RIT internal projects.)
                </p>
                <Form.Field required>
                    <div className="ui checkbox">
                        <input
                            required
                            name="project_agreements_checked"
                            checked={formData.project_agreements_checked || false}
                            type="checkbox"
                            onChange={(e) => {
                                setFormData(e);
                            }}
                        />
                        <label>I agree</label>
                    </div>
                </Form.Field>

                <br />

                <Form.Field required>
                    <h3>Assignment of Rights</h3>
                    <p>
                        Select one of the following approaches for assignment of the rights to the project artifacts and
                        intellectual property, and the disclosure of proprietary information.
                    </p>
                    <Radio
                        label="Assignment of Full Rights"
                        name="assignment_of_rights"
                        checked={formData.assignment_of_rights === "full_rights"}
                        value="full_rights"
                        onChange={(e, { value }) => {
                            setFormDataSemanticUI(value, "assignment_of_rights");
                        }}
                    />
                    <p>
                        If a team is assigned to this project, all students on the team will sign a standard Student
                        Course Project Intellectual Property and Non-Disclosure Agreement. This agreement assigns the
                        rights to the team’s project work to the sponsor, and describes the process whereby the project
                        sponsor can reveal proprietary information to the team. For non-RIT projects, the faculty coach
                        will sign a standard Faculty Course Project Non-Disclosure Agreement which describes the same
                        process for revealing proprietary information.
                    </p>
                    <Divider hidden />
                    <br />
                    <Radio
                        label="Assignment of Limited Use Rights"
                        name="assignment_of_rights"
                        checked={formData.assignment_of_rights === "limited_use"}
                        value="limited_use"
                        onChange={(e, { value }) => {
                            setFormDataSemanticUI(value, "assignment_of_rights");
                        }}
                    />
                    <p>
                        If a team is assigned to this project, all students on the team will sign a standard Student
                        Course Project Limited Use and Non-Disclosure Agreement. This agreement assigns the sponsor
                        rights to the team’s project work for internal or non-commercial use by the sponsor. The sponsor
                        may maintain and extend the project but not transfer it to a third party or use it in a
                        commercial product. The project team will retain patent and commercialization rights. The
                        agreement also describes the process whereby the project sponsor can reveal proprietary
                        information to the team. For non-RIT projects, the faculty coach will sign a standard Faculty
                        Course Project Non-Disclosure Agreement which describes the same process for revealing
                        proprietary information.
                    </p>
                    <Divider hidden />
                    <br />
                    <Radio
                        label="Open Source Project"
                        name="assignment_of_rights"
                        checked={formData.assignment_of_rights === "open_source"}
                        value="open_source"
                        onChange={(e, { value }) => {
                            setFormDataSemanticUI(value, "assignment_of_rights");
                        }}
                    />
                    <p>
                        If a team is assigned to this project, all students on the team will sign a standard Student
                        Course Project Open Source Agreement. The team will develop this as an open source project and
                        will publish all artifacts via an open source mechanism agreed upon through discussions with the
                        project sponsor. The sponsor will gain access to project artifacts only through this open source
                        repository. No rights need to be assigned exclusively to the project sponsor, and there will be
                        no transfer of proprietary information.
                    </p>
                </Form.Field>
                <br />
                <div className="row">
                    <h3>The agreements and policies can be found at:</h3>
                </div>
                <div className="row">
                    <ul>
                        <li>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectAgreement.doc"
                            >
                                Student Course Project Intellectual Property and Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectLimitedAgreement.doc"
                            >
                                Student Course Project Limited Use and Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="http://www.se.rit.edu/~swen-561/CourseInformation/StudentCourseProjectOpenSourceAgreement.doc"
                            >
                                Student Course Project Open Source Agreement
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="http://www.se.rit.edu/~swen-561/CourseInformation/FacultyCourseProjectAgreement.doc"
                            >
                                Faculty Course Project Non-Disclosure Agreement
                            </a>
                        </li>
                        <li>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="http://www.rit.edu/academicaffairs/policiesmanual/c030"
                            >
                                RIT Intellectual Property Policy C03.0. The project agreements are consistent with
                                section C03.0 1.V.B.2
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="row">
                    <h3>Please review your answers before submitting.</h3>
                </div>

                <div className="row proposal-submit-buttons">
                    <div>
                        <button
                            className="ui deny left floated left labeled icon button"
                            onClick={() => {
                                history.push("/sponsor");
                            }}
                        >
                            Cancel
                            <i className="times icon"></i>
                        </button>
                    </div>
                    <div>
                        <button
                            id="formSubmit"
                            className="ui blue right floated left labeled icon button"
                            form="proposalForm"
                        >
                            Submit
                            <i className="checkmark icon"></i>
                        </button>
                    </div>
                </div>
            </Form>
        </>
    );
}

export default ProposalPage;
