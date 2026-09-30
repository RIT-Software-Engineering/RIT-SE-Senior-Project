import { useState } from "react";
import "semantic-ui-css/semantic.min.css";
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
          style={{ marginBottom: "30px" }}
        />
      )}
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: "30px" }}>
          {!isInline && hasQuestions && (
            <Header
              textAlign="left"
              as="h3"
              dividing={hasStudents}
              style={{ marginBottom: "30px" }}
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
              <div
                key={`${index}:${students_index}`}
                style={{ marginBottom: "30px" }}
              >
                {!isInline && (
                  <Header
                    textAlign="left"
                    content={student}
                    as={hasQuestions ? "h4" : "h3"}
                  />
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
      <div style={{ overflowX: "auto" }}>
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
                    style={{
                      width: pixelWidth + "px",
                      wordWrap: "break-word",
                      textAlign: "center",
                      verticalAlign: "bottom",
                    }}
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
                    <Header as="h4"> {student} </Header>
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
    setSelections({
      ...selections,
      [student]: rating,
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Header as="h2" content={question} textAlign="left" dividing>
        {question + " "}
        {required && (
          <span style={{ color: "red", fontWeight: "bold" }}>*</span>
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
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                overflowX: "auto",
              }}
            >
              {/* Student Name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "8px",
                }}
              >
                <Header as={"h3"} style={{ fontSize: "1.2rem" }}>
                  {isErrored && (
                    <Icon
                      size="tiny"
                      name={"exclamation circle"}
                      color={"red"}
                    />
                  )}
                  <Header.Content
                    as={isErrored ? "i" : null}
                    content={student}
                  />
                </Header>
              </div>

              {/* Rating Levels */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  gap: "8px",
                  width: "100%",
                }}
              >
                {levels.map((level, index) => (
                  <div
                    key={`col-${student}-${index}`}
                    onClick={() => handleSelection(student, index)}
                    style={{
                      minWidth: "0",
                      minHeight: "58px",
                      padding: "8px",
                      fontSize: "0.90rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: "22px 1fr",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    <Radio
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        width: "100%",
                        height: "100%",
                      }}
                      name={`Mood-${sentenceToCamelCase(question)}-${student}`}
                      value={index}
                      checked={selections[student] === index}
                      onChange={(e) => e.stopPropagation()}
                      required={required}
                    />

                    <span
                      style={{
                        lineHeight: "1.15",
                      }}
                    >
                      {level}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feedback Section */}
              {feedback && (
                <div style={{ marginTop: "10px" }}>
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
