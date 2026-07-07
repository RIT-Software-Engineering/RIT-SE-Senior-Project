import React from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { Form, Icon, Input, Modal } from "semantic-ui-react";
import {
  formatDateNoOffset,
  humanFileSize,
  formatDateTime,
} from "../functions/utils";
import {
  ACTION_TARGETS,
  DEFAULT_UPLOAD_LIMIT,
  config,
} from "../functions/constants";
import Announcements from "../../Tabs/DashboardTab/TimelinesView/Announcements";
import { SecureFetch } from "../functions/secureFetch";
import { useState, useEffect } from "react";
import { QuestionComponentsMap } from "./PeerEvalComponents";
import ParsedInnerHTML from "./ParsedInnerHtml";
import SubmissionViewerModal from "../../Tabs/DashboardTab/TimelinesView/Timeline/SubmissionViewerModal";

export default function PreviewHtml(props) {
  const [open, setOpen] = React.useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  const submissionTypeMap = {
    [ACTION_TARGETS.individual]: "Individual",
    [ACTION_TARGETS.peer_evaluation]: "Individual",
    [ACTION_TARGETS.team]: "Team",
    [ACTION_TARGETS.coach]: "Coach",
    [ACTION_TARGETS.admin]: "Admin",
  };

  // Get action submissions data
  const loadActionSubmissions = (projectId, actionId) => {
    setLoadingSubmission(true);
    SecureFetch(
      `${config.url.API_GET_ACTION_LOGS}?project_id=${projectId}&action_id=${actionId}`,
    )
      .then((response) => response.json())
      .then((actionLogs) => {
        setSubmissions(actionLogs);
        setLoadingSubmission(false);
      })
      .catch((err) => {
        console.error("FAILED TO GET SUBMISSIONS: ", err);
      });
  };

  // auto load submssions when there are changes
  useEffect(() => {
    if (props.autoLoadSubmissions) {
      loadActionSubmissions(props.projectId, props.action?.action_id);
    }
  }, [props.autoLoadSubmissions, props.projectId, props.action?.action_id]);

  function modalContent(props) {
    const isStudentAnnouncement =
      props.action.action_target === ACTION_TARGETS.student_announcement;
    const isCoachAnnouncement =
      props.action.action_target === ACTION_TARGETS.coach_announcement;
    const isPeerEvaluation =
      props.action.action_target === ACTION_TARGETS.peer_evaluation;

    if (isStudentAnnouncement || isCoachAnnouncement) {
      return (
        <Announcements
          announcements={[props.action]}
          semesterName={props.semesterName}
        />
      );
    }

    return (
      <div>
        {preActionContent()}
        <br />
        {isPeerEvaluation ? (
          <ParsedInnerHTML
            html={props.action.page_html}
            components={QuestionComponentsMap}
          />
        ) : (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: props.action.page_html }}
          />
        )}
        <br />
        {fileUpload(props.action.file_types, props.action.file_size)}
      </div>
    );
  }

  const renderSubmissionsList = () => {
    if (loadingSubmission) {
      return <Icon name="spinner" size="large"></Icon>;
    }

    if (submissions === null) {
      return (
        <p
          className="fake-a"
          onClick={() =>
            loadActionSubmissions(props.projectId, props.action?.action_id)
          }
        >
          Load submissions
        </p>
      );
    }
    if (submissions?.length === 0) {
      return (
        <p>
          <b>No submissions for this action</b>
        </p>
      );
    } else {
      return (
        <div className="submission-list">
          {submissions.map((submission) => (
            <SubmissionViewerModal
              key={submission.action_log_id}
              action={submission}
              title={props.action?.action_title}
              target={props.action?.action_target}
              semesterName={props.semesterName}
              projectName={props.projectName}
              isOpenCallback={() => {}}
              trigger={
                <div className="fake-a">
                  <span>
                    {submission.name} ({submission.system_id}) -{" "}
                  </span>
                  <i>{formatDateTime(submission.submission_datetime)}</i>{" "}
                  Submission
                  {submission.mock_id && ` (Mock: ${submission.mock_name})`}
                </div>
              }
            />
          ))}
        </div>
      );
    }
  };

  function preActionContent() {
    return (
      <>
        <p>{props.action?.short_desc}</p>
        <p>Starts: {formatDateNoOffset(props.action?.start_date)}</p>
        <p>Due: {formatDateNoOffset(props.action?.due_date)}</p>
        <p>Project Title: {props.projectName}</p>
        <p>Submission Type: {submissionTypeMap[props.action?.action_target]}</p>
        <div>
          Submissons:
          {renderSubmissionsList()}
        </div>
      </>
    );
  }

  function fileUpload(fileTypes, fileSize) {
    return (
      fileTypes && (
        <Form>
          <Form.Field required>
            <label className="file-submission-required">
              File Submission (Accepted: {fileTypes.split(",").join(", ")}) (Max
              size of each file:{" "}
              {humanFileSize(fileSize || DEFAULT_UPLOAD_LIMIT, false, 0)})
            </label>
            <Input fluid required type="file" accept={fileTypes} multiple />
          </Form.Field>
        </Form>
      )
    );
  }

  if (props.isOpenCallback) {
    return (
      <Modal
        closeOnDimmerClick={false}
        className={"sticky"}
        trigger={props.trigger || <Button icon={<Icon name="eye" />} />}
        onClose={() => {
          setOpen(false);
          props.isOpenCallback(false);
        }}
        onOpen={() => {
          setOpen(true);
          props.isOpenCallback(true);
        }}
        open={open}
        header={props.header}
        content={{
          content: modalContent(props),
        }}
        actions={[
          {
            key: "Close",
            content: "Close",
          },
        ]}
      />
    );
  } else {
    return (
      <Modal
        closeOnDimmerClick={false}
        className={"sticky"}
        trigger={props.trigger || <Button icon={<Icon name="eye" />} />}
        header={props.header}
        content={{
          content: modalContent(props),
        }}
        actions={[
          {
            key: "Close",
            content: "Close",
          },
        ]}
      />
    );
  }
}
