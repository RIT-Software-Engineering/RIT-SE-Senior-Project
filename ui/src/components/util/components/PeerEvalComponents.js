import { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import ProfileCircle from "./ProfileCircle";
import {
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Header,
  HeaderContent,
  Icon,
  Radio,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TextArea,
} from "semantic-ui-react";

import "./../../../css/utils/peer.css";

const sentenceToCamelCase = (string = "") =>
  string.replaceAll(
    /(\w+).?/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).trim(),
  );

export const QuestionComponentsMap = {
  QuestionFeedback: QuestionFeedback,
  QuestionTable: QuestionTable,
  QuestionMoodRating: QuestionMoodRating,
  QuestionPeerFeedback: QuestionPeerFeedback,
};

// noinspection JSUnusedLocalSymbols
export function QuestionFeedback({
  title = "Feedback",
  questions = [""],
  ordered = false,
  students = [""],
  required = false,
  errorFields = new Set(),
  includeStudents = false,
  selfFeedback = false,
  isInline = false,
}) {
  const [feedback, setFeedback] = useState({});
  const hasStudents = students.length > 1 || students[0] !== "";
  const hasQuestions = questions.length > 1 || questions[0] !== "";
  const hasTitle = title !== "";

  const handleFeedbackChange = (question, student, newFeedback) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [question]: {
        ...prevFeedback[question],
        [student]: newFeedback,
      },
    }));
  };

  return (
    <div>
      {!isInline && hasTitle && (
        <Header
          textAlign="left"
          as="h2"
          content={title}
          dividing
          className="peer-header"
        />
      )}
      {questions.map((question, index) => (
        <div key={index} className="peer-header">
          {!isInline && hasQuestions && (
            <Header
              textAlign="left"
              as="h3"
              dividing={hasStudents}
              className="peer-header"
            >
              {ordered ? `${index + 1}. ${question}` : question}
              {required && (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {"\u00A0"}*
                </span>
              )}
            </Header>
          )}
          {students.map((student, students_index) => {
            const name = `Feedback-${sentenceToCamelCase(question)}-${hasStudents ? student : "Anon"}`;
            const isErrored = errorFields.has(name);
            return (
              <div key={`${index}:${students_index}`} className="peer-header">
                {!isInline && (
                  <Header textAlign="left" as={hasQuestions ? "h4" : "h3"}>
                    <ProfileCircle name={student} size="tiny" showFullName />
                  </Header>
                )}
                <FormInput
                  name={name}
                  placeholder={`${student}${hasStudents ? " - " : ""}${question}`}
                  value={
                    !!feedback[question] ? feedback[question][student] : ""
                  }
                  onChange={(e) =>
                    handleFeedbackChange(question, student, e.target.value)
                  }
                  required={required}
                  error={isErrored}
                  control={TextArea}
                />
                <br />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function QuestionPeerFeedback({
  title = "Individual Feedback",
  questions,
  students,
  required,
  errorFields,
  includeStudents = true,
  selfFeedback = false,
  isInline = false,
}) {
  return (
    <QuestionFeedback
      title={title}
      questions={questions}
      students={students}
      required={required}
      errorFields={errorFields}
      includeStudents={includeStudents}
      isInline={isInline}
      selfFeedback={selfFeedback}
    />
  );
}

// noinspection JSUnusedLocalSymbols
export function QuestionTable({
  questions,
  students,
  scale = 5,
  required = false,
  icon = true,
  errorFields = new Set(),
  feedback = false,
  includeStudents = true,
  selfFeedback = false,
}) {
  const questionRatings = {};
  questions.forEach((question) => (questionRatings[question] = {}));
  const [selections, setSelections] = useState(questionRatings);

  const pixelWidth = Math.floor(900 / questions.length);

  const handleRate = (student, question, rating) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [question]: {
        ...prevSelections[question],
        [student]: rating,
      },
    }));
  };

  return (
    <div>
      {required && (
        <Icon
          size={"small"}
          fitted
          content="*"
          color={"red"}
          floated="left"
          name={"asterisk"}
        />
      )}
      <div className="peer-table">
        <Table basic="very" celled collapsing unstackable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell />
              {questions.map((question) => {
                const name = `${sentenceToCamelCase(question)}`;
                const isErrored = errorFields.has(name);
                return (
                  <TableHeaderCell
                    collapsing
                    className="peer-table-header-cell"
                    style={{ width: pixelWidth + "px" }}
                    key={question}
                  >
                    <Header as={"h4"}>
                      <HeaderContent as={isErrored ? "i" : null}>
                        {isErrored && (
                          <Icon fitted name={"warning circle"} color={"red"} />
                        )}{" "}
                        {question}
                      </HeaderContent>
                    </Header>
                  </TableHeaderCell>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => (
              <>
                <TableRow key={student}>
                  <TableCell>
                    <ProfileCircle name={student} size="tiny" showFullName />
                    {/* <Label size='large' basic>{student}</Label> */}
                  </TableCell>
                  {questions.map((question) => (
                    <TableCell key={student + question} textAlign="center">
                      <Rating
                        maxRating={scale}
                        defaultRating={selections[question][student] || ""}
                        clearable
                        icon={icon}
                        onRate={(_, data) =>
                          handleRate(student, question, data.rating)
                        }
                      />
                      <input
                        type="hidden"
                        name={`Table-${sentenceToCamelCase(question)}-${student}`}
                        value={selections[question][student] || 0}
                        required={required}
                      />
                      {scale === 3 && (
                        <input
                          type="hidden"
                          name={`Scale-${sentenceToCamelCase(question)}-${student}`}
                          value={1}
                          required={required}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {feedback && (
                  <TableRow key={student + "feedback"}>
                    <TableCell />
                    {questions.map((question) => (
                      <TableCell
                        key={student + question + "feedback"}
                        textAlign="center"
                      >
                        <QuestionPeerFeedback
                          isInline={true}
                          questions={[question]}
                          required={required}
                          errorFields={errorFields}
                          students={[student]}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// noinspection JSUnusedLocalSymbols
export function QuestionMoodRating({
  question,
  students,
  levels = [
    "Extremely Dissatisfied",
    "Dissatisfied",
    "Neutral",
    "Satisfied",
    "Extremely Satisfied",
  ],
  required = false,
  errorFields = new Set(),
  feedback = false,
  includeStudents = true,
  selfFeedback = false,
}) {
  const [selections, setSelections] = useState({});

  const handleSelection = (student, rating) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [student]: rating,
    }));
  };

  return (
    <div className="peer-question">
      <Header as="h2" textAlign="left" dividing>
        {question}
        {required && (
          <span style={{ color: "red", fontWeight: "bold" }}>{"\u00A0"}*</span>
        )}
      </Header>
      <br />
      <Grid divided="vertically">
        {students.map((student) => {
          const name = `Mood-${sentenceToCamelCase(question)}-${student}`;
          const isErrored = errorFields.has(name);

          return (
            <div
              key={student}
              className="peer-student"
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border-color, #ddd)",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                overflowX: "auto",
              }}
            >
              {/* Student Name */}
              <div
                className="peer-name"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingBottom: "4px",
                }}
              >
                <ProfileCircle name={student} size="tiny" showFullName />
                {isErrored && (
                  <Icon
                    className="peer-error"
                    name="exclamation circle"
                    color="red"
                    size="large"
                    style={{ margin: 0, position: "relative" }}
                  />
                )}
              </div>

              {/* Rating Levels */}
              <div
                className="peer-rating"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${levels.length}, minmax(0, 1fr))`,
                  gap: "8px",
                  width: "100%",
                }}
              >
                {levels.map((level, index) => (
                  <div
                    key={`col-${student}-${index}`}
                    className="peer-levels"
                    onClick={() => handleSelection(student, index)}
                    style={{
                      minWidth: 0,
                      minHeight: "58px",
                      padding: "8px",
                      fontSize: "0.90rem",
                      border: "1px solid var(--border-color, #ddd)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: "22px 1fr",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    <Radio
                      className="peer-radio"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        height: "100%",
                      }}
                      name={name}
                      value={index}
                      checked={selections[student] === index}
                      onChange={(e, data) => {
                        e.stopPropagation();
                        handleSelection(student, data.value);
                      }}
                      required={required}
                      aria-label={level}
                    />

                    <span
                      style={{
                        lineHeight: "1.15",
                        textAlign: "center",
                      }}
                    >
                      {level}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feedback Section */}
              {feedback && (
                <div className="peer-feedback">
                  <QuestionPeerFeedback
                    isInline={true}
                    questions={[question]}
                    required={required}
                    students={[student]}
                    errorFields={errorFields}
                  />
                </div>
              )}
            </div>
          );
        })}
      </Grid>
    </div>
  );
}
