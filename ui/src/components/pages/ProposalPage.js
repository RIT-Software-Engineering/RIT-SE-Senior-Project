import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Form, Radio, Divider, Button } from "semantic-ui-react";
import { config } from "../util/functions/constants";
import { SecureFetch } from "../util/functions/secureFetch";
import "./../../css/components/proposal.css";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";

const MODAL_STATUS = { SUCCESS: "success", FAIL: "fail", CLOSED: false };

function ProposalPage() {
  const history = useHistory();
  const [formData, setActualFormData] = useState({
    assignment_of_rights: "full_rights",
  });
  const [formFiles, setFormFiles] = useState(null);
  const [modalOpen, setModalOpen] = useState(MODAL_STATUS.CLOSED);
  const [errors, setErrors] = useState({});
  const quill = useRef(null);

  const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

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

  // Function to strip HTML tags and check if content is empty
  const isContentEmpty = (htmlContent) => {
    if (!htmlContent) return true;
    const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
    return textContent === "";
  };

  // Update hidden inputs for HTML5 validation (keeping for other field validation)
  const updateHiddenInput = (fieldName, value) => {
    // This function is kept for compatibility but not used for QuillEditor validation
  };

  // Custom validation with proper positioning
  const validateAndShowTooltip = (fieldName) => {
    const quillContainer = document.querySelector(
      `#quill_${fieldName} .ql-editor`,
    );

    if (quillContainer) {
      // Remove any existing custom tooltips
      const existingTooltip = document.querySelector(
        ".custom-validation-tooltip",
      );
      if (existingTooltip) {
        existingTooltip.remove();
      }

      // Create custom tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "custom-validation-tooltip";
      tooltip.textContent = "Please fill out this field.";

      // Style the tooltip to look like native browser validation
      tooltip.style.cssText = `
        position: absolute;
        background: #323232;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        white-space: nowrap;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        pointer-events: none;
      `;

      // Add arrow to tooltip
      const arrow = document.createElement("div");
      arrow.style.cssText = `
        position: absolute;
        top: -5px;
        left: 20px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #323232;
      `;
      tooltip.appendChild(arrow);

      // Position the tooltip relative to the QuillEditor
      const rect = quillContainer.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

      document.body.appendChild(tooltip);

      // Focus the QuillEditor
      quillContainer.focus();

      // Scroll to the field
      quillContainer.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove tooltip after 5 seconds or when user interacts
      const removeTooltip = () => {
        if (tooltip && tooltip.parentNode) {
          tooltip.remove();
        }
      };

      setTimeout(removeTooltip, 5000);

      // Remove tooltip when user starts typing in any QuillEditor
      const quillEditors = document.querySelectorAll(".ql-editor");
      quillEditors.forEach((editor) => {
        editor.addEventListener("input", removeTooltip, { once: true });
        editor.addEventListener("focus", removeTooltip, { once: true });
      });

      // Remove tooltip when clicking elsewhere
      document.addEventListener("click", removeTooltip, { once: true });
    }
  };

  const submitProposal = async (event) => {
    event.preventDefault();

    if (modalOpen) {
      console.warn("Trying to submit proposal form while modal is open.");
      return;
    }

    // Check each required QuillEditor field and show tooltips
    const requiredFields = [
      "background_info",
      "project_description",
      "project_scope",
      "project_challenges",
      "constraints_assumptions",
      "sponsor_deliverables",
    ];

    for (const field of requiredFields) {
      if (isContentEmpty(formData[field])) {
        validateAndShowTooltip(field);
        return; // Stop at first empty field
      }
    }

    // Let HTML5 validation handle other fields
    const form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const body = new FormData();
    Object.keys(formData).forEach((key) => {
      body.append(key, formData[key]);
    });

    for (let i = 0; i < formFiles?.length || 0; i++) {
      body.append("attachments", formFiles[i]);
    }

    SecureFetch(config.url.API_POST_SUBMIT_PROJECT, {
      method: "post",
      body: body,
    })
      .then((response) => {
        if (response.status === 200) {
          setModalOpen(MODAL_STATUS.SUCCESS);
        } else {
          setModalOpen(MODAL_STATUS.FAIL);
          return response.json();
        }
      })
      .then((error) => {
        if (error?.errors) {
          let receivedErrors = {};
          error.errors?.forEach((error) => {
            receivedErrors[error.param] = error.msg;
          });
          setErrors(receivedErrors);
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
          actions: [
            { header: "Success!", content: "Close", positive: true, key: 0 },
          ],
        };
      case MODAL_STATUS.FAIL:
        return {
          header: "There was an issue...",
          content: "We were unable to submit your proposal.",
          actions: [
            {
              header: "There was an issue",
              content: "Cancel",
              positive: true,
              key: 0,
            },
          ],
        };
      default:
        return;
    }
  };

  const closeModal = () => {
    switch (modalOpen) {
      case MODAL_STATUS.SUCCESS:
        setActualFormData({
          assignment_of_rights: "full_rights",
        });
        setFormFiles(null);
        setModalOpen(MODAL_STATUS.CLOSED);
        setErrors({});
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
      <Modal
        open={!!modalOpen}
        {...generateModalFields()}
        onClose={() => closeModal()}
        dimmer="blurring"
        className={"sticky"}
      />
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
            console.log("tinymce api code: " + config.url.TINYMCE_API_KEY);
            setFormData(e);
          }}
          error={errors.title && { content: errors.title, pointing: "below" }}
        />
        <Form.Input
          required
          label="Organization Name"
          name="organization"
          value={formData.organization || ""}
          onChange={(e) => {
            setFormData(e);
          }}
          error={
            errors.organization && {
              content: errors.organization,
              pointing: "below",
            }
          }
        />
        <Form.Input
          required
          label="Primary Contact Name"
          name="primary_contact"
          value={formData.primary_contact || ""}
          onChange={(e) => {
            setFormData(e);
          }}
          error={
            errors.primary_contact && {
              content: errors.primary_contact,
              pointing: "below",
            }
          }
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
            error={
              errors.contact_email && {
                content: errors.contact_email,
                pointing: "below",
              }
            }
          />
          <Form.Input
            required
            label="Phone"
            name="contact_phone"
            value={formData.contact_phone || ""}
            onChange={(e) => {
              setFormData(e);
            }}
            error={
              errors.contact_phone && {
                content: errors.contact_phone,
                pointing: "below",
              }
            }
          />
        </div>

        <Form.Field>
          <label>Add additional PDF or image resources:</label>
          {/* TODO: this filed does not get reset when a proposal is submitted */}
          <Form.Input
            name="attachments"
            type="file"
            accept=".pdf, .png, .jpg, .jpeg"
            multiple
            onChange={(e) => {
              setFormData(e);
            }}
            error={errors.files && { content: errors.files, pointing: "below" }}
          />
        </Form.Field>

        <Form.Field
          required
          error={
            errors.background_info && {
              content: errors.background_info,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Project Background Information
          </label>
          <div id="quill_background_info">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.background_info || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  background_info: value,
                });
                updateHiddenInput("background_info", value);
                // Clear error when user starts typing
                if (errors.background_info) {
                  setErrors({ ...errors, background_info: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <Form.Field
          required
          error={
            errors.project_description && {
              content: errors.project_description,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Project Description
          </label>
          <div id="quill_project_description">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.project_description || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  project_description: value,
                });
                updateHiddenInput("project_description", value);
                // Clear error when user starts typing
                if (errors.project_description) {
                  setErrors({ ...errors, project_description: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <Form.Field
          required
          error={
            errors.project_scope && {
              content: errors.project_scope,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Project Scope
          </label>
          <div id="quill_project_scope">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.project_scope || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  project_scope: value,
                });
                updateHiddenInput("project_scope", value);
                // Clear error when user starts typing
                if (errors.project_scope) {
                  setErrors({ ...errors, project_scope: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <Form.Field
          required
          error={
            errors.project_challenges && {
              content: errors.project_challenges,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Project Challenges
          </label>
          <div id="quill_project_challenges">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.project_challenges || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  project_challenges: value,
                });
                updateHiddenInput("project_challenges", value);
                // Clear error when user starts typing
                if (errors.project_challenges) {
                  setErrors({ ...errors, project_challenges: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <Form.Field
          required
          error={
            errors.constraints_assumptions && {
              content: errors.constraints_assumptions,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Constraints & Assumptions
          </label>
          <div id="quill_constraints_assumptions">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.constraints_assumptions || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  constraints_assumptions: value,
                });
                updateHiddenInput("constraints_assumptions", value);
                // Clear error when user starts typing
                if (errors.constraints_assumptions) {
                  setErrors({ ...errors, constraints_assumptions: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <div style={{ fontWeight: "bold", fontSize: "13px" }}>
          Sponsor Provided Resources
        </div>
        <br />
        <QuillEditor
          ref={(el) => (quill.current = el)}
          value={formData.sponsor_provided_resources || ""}
          formats={formats}
          className="proposal-height"
          onChange={(value) => {
            setActualFormData({
              ...formData,
              sponsor_provided_resources: value,
            });
          }}
        />
        <br />
        <br />

        <br />
        <Form.Input
          label="Project Search Keywords"
          name="project_search_keywords"
          value={formData.project_search_keywords || ""}
          onChange={(e) => {
            setFormData(e);
          }}
          error={
            errors.project_search_keywords && {
              content: errors.project_search_keywords,
              pointing: "below",
            }
          }
        />

        <br />
        <Form.Field
          required
          error={
            errors.sponsor_deliverables && {
              content: errors.sponsor_deliverables,
              pointing: "below",
            }
          }
        >
          <label
            className="required-field"
            style={{ fontWeight: "bold", fontSize: "13px" }}
          >
            Sponsor and Project Specific Deliverables
          </label>
          <div id="quill_sponsor_deliverables">
            <QuillEditor
              ref={(el) => (quill.current = el)}
              value={formData.sponsor_deliverables || ""}
              formats={formats}
              className="proposal-height"
              onChange={(value) => {
                setActualFormData({
                  ...formData,
                  sponsor_deliverables: value,
                });
                updateHiddenInput("sponsor_deliverables", value);
                // Clear error when user starts typing
                if (errors.sponsor_deliverables) {
                  setErrors({ ...errors, sponsor_deliverables: undefined });
                }
              }}
            />
          </div>
        </Form.Field>
        <br />
        <br />

        <br />
        <div style={{ fontWeight: "bold", fontSize: "13px" }}>
          Proprietary Information
        </div>
        <br />
        <QuillEditor
          ref={(el) => (quill.current = el)}
          value={formData.proprietary_info || ""}
          formats={formats}
          className="proposal-height"
          onChange={(value) => {
            setActualFormData({
              ...formData,
              proprietary_info: value,
            });
          }}
        />
        <br />
        <br />

        <Divider section />

        <h3>Sponsor Availability</h3>
        <p>
          Sponsor personnel will be available to meet with the team once per
          week during the time set for meeting with the sponsor which is Tuesday
          and Thursday (fall/spring) or Monday and Wednesday (spring/summer)
          from 5:00 – 6:15pm Eastern US time. We will give a selection
          preference to proposals whose sponsors are available during this time.
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
              error={
                errors.sponsor_avail_checked && {
                  content: errors.sponsor_avail_checked,
                  pointing: "below",
                }
              }
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
          error={
            errors.sponsor_alternate_time && {
              content: errors.sponsor_alternate_time,
              pointing: "below",
            }
          }
        />

        <Divider section />

        <h3>Project Agreements and Assignment of Rights</h3>
        <p>
          RIT policy gives students full ownership of any work done as part of
          coursework which includes their work on senior project. As the sponsor
          of a course project, you can select one of three approaches for
          dealing with ownership of project artifacts and intellectual property,
          and the disclosure of proprietary information. If you seek assignment
          of rights, the individual team members will sign a project agreement
          based on the rights that you want.
        </p>
        <p>
          Please get any corporate and legal clearances that you feel are needed
          to use the unmodified project agreement, before submitting your
          project proposal. This is necessary to prevent any delays in starting
          a project. A team will not be assigned to a project if the sponsor has
          not confirmed that the project agreements are OK. Indicate that this
          has been done by checking box below.
        </p>
        <h4>Corporate and Legal Clearance of Project Agreement</h4>
        <p>
          We have the necessary corporate or legal clearances to use the
          unmodified project agreement. (Note: The project agreements are
          cleared for RIT internal projects.)
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
              error={
                errors.project_agreements_checked && {
                  content: errors.project_agreements_checked,
                  pointing: "below",
                }
              }
            />
            <label>I agree</label>
          </div>
        </Form.Field>

        <br />

        <Form.Field>
          <h3 className="required-field">Assignment of Rights</h3>
          <p>
            Select one of the following approaches for assignment of the rights
            to the project artifacts and intellectual property, and the
            disclosure of proprietary information.
          </p>
          <Radio
            label="Assignment of Full Rights"
            name="assignment_of_rights"
            checked={formData.assignment_of_rights === "full_rights"}
            value="full_rights"
            onChange={(e, { value }) => {
              setFormDataSemanticUI(value, "assignment_of_rights");
            }}
            error={
              errors.assignment_of_rights && {
                content: errors.assignment_of_rights,
                pointing: "below",
              }
            }
          />
          <p>
            If a team is assigned to this project, all students on the team will
            sign a standard Student Course Project Intellectual Property and
            Non-Disclosure Agreement. This agreement assigns the rights to the
            team’s project work to the sponsor, and describes the process
            whereby the project sponsor can reveal proprietary information to
            the team. For non-RIT projects, the faculty coach will sign a
            standard Faculty Course Project Non-Disclosure Agreement which
            describes the same process for revealing proprietary information.
          </p>
          <Divider invisible />
          <br />
          <Radio
            label="Assignment of Limited Use Rights"
            name="assignment_of_rights"
            checked={formData.assignment_of_rights === "limited_use"}
            value="limited_use"
            onChange={(e, { value }) => {
              setFormDataSemanticUI(value, "assignment_of_rights");
            }}
            error={
              errors.assignment_of_rights && {
                content: errors.assignment_of_rights,
                pointing: "below",
              }
            }
          />
          <p>
            If a team is assigned to this project, all students on the team will
            sign a standard Student Course Project Limited Use and
            Non-Disclosure Agreement. This agreement assigns the sponsor rights
            to the team’s project work for internal or non-commercial use by the
            sponsor. The sponsor may maintain and extend the project but not
            transfer it to a third party or use it in a commercial product. The
            project team will retain patent and commercialization rights. The
            agreement also describes the process whereby the project sponsor can
            reveal proprietary information to the team. For non-RIT projects,
            the faculty coach will sign a standard Faculty Course Project
            Non-Disclosure Agreement which describes the same process for
            revealing proprietary information.
          </p>
          <Divider invisible />
          <br />
          <Radio
            label="Open Source Project"
            name="assignment_of_rights"
            checked={formData.assignment_of_rights === "open_source"}
            value="open_source"
            onChange={(e, { value }) => {
              setFormDataSemanticUI(value, "assignment_of_rights");
            }}
            error={
              errors.assignment_of_rights && {
                content: errors.assignment_of_rights,
                pointing: "below",
              }
            }
          />
          <p>
            If a team is assigned to this project, all students on the team will
            sign a standard Student Course Project Open Source Agreement. The
            team will develop this as an open source project and will publish
            all artifacts via an open source mechanism agreed upon through
            discussions with the project sponsor. The sponsor will gain access
            to project artifacts only through this open source repository. No
            rights need to be assigned exclusively to the project sponsor, and
            there will be no transfer of proprietary information.
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
                Student Course Project Intellectual Property and Non-Disclosure
                Agreement
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
                RIT Intellectual Property Policy C03.0. The project agreements
                are consistent with section C03.0 1.V.B.2
              </a>
            </li>
          </ul>
        </div>

        <div className="row">
          <h3>Please review your answers before submitting.</h3>
        </div>

        <div className="row proposal-submit-buttons">
          <div>
            <Button
              className="ui deny left floated left labeled icon button"
              color="grey"
              onClick={() => {
                history.push("/sponsor");
              }}
            >
              Cancel
              <i className="times icon"></i>
            </Button>
          </div>
          <div>
            <Button
              positive
              labelPosition="right"
              icon="checkmark"
              id="formSubmit"
              form="proposalForm"
            >
              Submit
              <i className="checkmark icon"></i>
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default ProposalPage;
