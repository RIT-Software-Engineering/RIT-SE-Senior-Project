import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import SemesterPanel from "./SemesterPanel";
import SemesterTable from "./SemesterTable";
import DuplicateSemesterPanel from "../ActionEditor/DuplicateSemesterPanel";

export default function SemesterEditor() {
  const [semesters, setSemestersData] = useState([]);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const getSemesters = () => {
    SecureFetch(config.url.API_GET_SEMESTERS)
      .then((response) => response.json())
      .then((semestersData) => {
        setSemestersData(semestersData);
      })
      .catch((error) => {
        alert("Failed to get semesters data" + error);
      });
  };

  useEffect(() => {
    getSemesters();
  }, []);

  let semestersToEdit = (
    <SemesterTable
      semesters={semesters}
      semesterData={semesters}
      callback={getSemesters}
    />
  );

  return (
    <div className="accordion-button-group">
      <Accordion
        fluid
        styled
        panels={[
          {
            key: "semesterEditor",
            title: "Semester Editor",
            content: { content: semestersToEdit },
          },
        ]}
      />
      <div className="accordion-buttons-container">
        <SemesterPanel
          header="Create Semester"
          callback={getSemesters}
          semester={null} // for semester creation
          semesterData={semesters}
        />
        <button
          className="ui icon button"
          title="Copy Semester Actions"
          onClick={() => setCopyModalOpen(true)}
        >
          <i className="clone outline icon" />
        </button>

        <DuplicateSemesterPanel
          open={copyModalOpen}
          onClose={() => setCopyModalOpen(false)}
          semesterData={semesters}
          callback={getSemesters}
        />
      </div>
    </div>
  );
}
