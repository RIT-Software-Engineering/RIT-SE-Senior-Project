import React, { useContext, useEffect, useState } from "react";
import { USERTYPES } from "../functions/constants";
import {
  Divider,
  Icon,
  Message,
  Rating,
  Table,
  Label,
  Popup,
  Accordion,
} from "semantic-ui-react";
import { UserContext } from "../functions/UserContext";

export default function EvalReview(props) {
  const [userFeedback, setUserFeedback] = useState([]);
  const [studentExpanded, setStudentExpanded] = useState({});
  const coachFeedback = props.forms;
  const userContext = useContext(UserContext);
  const userName = `${userContext.user.fname} ${userContext.user.lname}`;
  const userIsStudent = userContext.user.role === USERTYPES.STUDENT;

  useEffect(() => {
    let sortedFeedback = [];

    sortedFeedback.push(
      Object.fromEntries(
        Object.entries(coachFeedback.Students).filter(
          ([student, _]) => !userIsStudent || userName === student
        )
      )
    );

    setUserFeedback(sortedFeedback);
  }, [setUserFeedback, coachFeedback, userIsStudent, userName]);

  useEffect(() => {
    if (userIsStudent) {
      setStudentExpanded((prev) => ({ ...prev, [userName]: true }));
    }
  }, [userIsStudent, userName]);

  const generateFeedbackCards = (student, index) => {
    return (
      <div key={"EvalReview" + props.id}>
        {Object.entries(student).map(([student_name, data]) => {
          const hasSelfRating =
            data.SelfRating && Object.keys(data.SelfRating).length > 0;
          return (
            <Accordion
              fluid
              styled
              key={props.id + student_name + "Card" + index}
            >
              <Accordion.Title
                active={studentExpanded[student_name]}
                index={index}
                onClick={() => {
                  setStudentExpanded((prev) => ({
                    ...prev,
                    [student_name]: !studentExpanded[student_name],
                  }));
                }}
              >
                <Icon name="dropdown" />
                {userIsStudent ? "Your" : `${student_name}'s`} Feedback Summary
              </Accordion.Title>
              {(studentExpanded[student_name] || userIsStudent) && (
                <Accordion.Content active={studentExpanded[student_name]}>
                  <Table striped>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>Rating</Table.HeaderCell>
                        {hasSelfRating && (
                          <Table.HeaderCell>Self Rating</Table.HeaderCell>
                        )}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {Object.entries(data.AverageRatings).map(
                        ([category, rating]) => (
                          <Table.Row
                            key={props.id + student_name + category + "Rating"}
                          >
                            <Table.Cell>{category}</Table.Cell>
                            <Table.Cell>
                              <Rating
                                defaultRating={rating}
                                disabled
                                maxRating={5}
                              />{" "}
                              ({Math.round(rating * 100) / 100})
                            </Table.Cell>
                            {hasSelfRating && (
                              <Table.Cell>
                                {data.SelfRating[category] && (
                                  <>
                                    <Rating
                                      defaultRating={data.SelfRating[category]}
                                      disabled
                                      maxRating={5}
                                    />
                                    <span>
                                      (
                                      {Math.round(
                                        data.SelfRating[category] * 100
                                      ) / 100}
                                      )
                                    </span>
                                  </>
                                )}
                              </Table.Cell>
                            )}
                          </Table.Row>
                        )
                      )}
                    </Table.Body>
                  </Table>
                  <Message color={"grey"}>
                    <Message.Header>
                      {"Coach Feedback"}{" "}
                      <p>(AI Is available for coach to use)</p>{" "}
                    </Message.Header>
                    {data.UsedAI && (
                      <Popup
                        content={
                          <Label basic color={"blue"} as={"a"} image>
                            <img
                              src={"Gemini_language_model_logo.png"}
                              alt="Google Gemini  logo"
                              color="white"
                              style={{ marginLeft: "5px" }}
                            />
                            <p
                              style={{
                                margin: "-12px 0 0 79px",
                                fontSize: "medium",
                                color: "#086EFF",
                              }}
                            >
                              {" "}
                              was used to aid the coach in your feedback.
                            </p>
                          </Label>
                        }
                        flowing
                        trigger={
                          <Label
                            corner={"right"}
                            icon={"google"}
                            color={"blue"}
                          />
                        }
                      />
                    )}
                    <Divider />
                    <Message.Content content={data.Feedback} />
                  </Message>
                </Accordion.Content>
              )}
            </Accordion>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {props.isSub ? (
        userFeedback.map((feedback, index) =>
          generateFeedbackCards(feedback, index)
        )
      ) : (
        <h5>No Submission</h5>
      )}
    </div>
  );
}
