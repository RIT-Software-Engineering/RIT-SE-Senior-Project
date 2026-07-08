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
              {required && <Header content="*" color={"red"} floated="left" />}
            </Header>
          )}
          {students.map((student, students_index) => {
            const name = `Feedback-${sentenceToCamelCase(question)}-${hasStudents ? student : "Anon"}`;
            const isErrored = errorFields.has(name);
            return (
              <div
                key={`${index}:${students_index}`}
                className="peer-header"
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
    <div className="peer-question">
      <Header as="h2" content={question} textAlign="left" dividing>
        {question + " "}
        {required && <Header.Content content="*" className="peer-content-color" />}
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
            >
              {/* Student Name */}
              <div
                className="peer-name"
              >
                <Header as={"h3"} className="peer-error">
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
                className="peer-rating"
              >
                {levels.map((level, index) => (
                  <div
                    key={`col-${student}-${index}`}
                    className="peer-levels"
                  >
                    <Radio
                      className="peer-radio"
                      name={`Mood-${sentenceToCamelCase(question)}-${student}`}
                      value={index}
                      checked={selections[student] === index}
                      onChange={() => handleSelection(student, index)}
                      required={required}
                    />
                    {level}
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
