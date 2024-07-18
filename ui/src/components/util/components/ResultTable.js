import React, { useState } from "react";
import {
  Container,
  Rating,
  List,
  Icon,
  ListItem,
  Table,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableHeader,
  TextArea,
  TableBody,
  CardHeader,
  CardContent,
  Label,
  Card,
  Popup,
} from "semantic-ui-react";

function roundDec(number, places) {
  return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}

export default function ResultTable(props) {
  const [expandedRows, setExpandedRows] = useState([]);

  const camelCaseToSentence = (string = "") =>
    string.replace(/([A-Z])/g, (word) => ` ${word}`).trimStart();

  const handleRowClick = (index) => {
    setExpandedRows(
      expandedRows.includes(index)
        ? expandedRows.filter((row) => row !== index)
        : [...expandedRows, index]
    );
  };

  const hasSelfRating =
    !!props.SelfFeedback && Object.keys(props.SelfFeedback).length > 0;
  const categories = Array.from(
    new Set([
      ...Object.keys(props.OthersFeedbackAvg),
      ...(hasSelfRating ? Object.keys(props.SelfFeedback.Ratings) : []),
    ])
  );

  return (
    <Container fluid>
      <Table collapsing celled striped>
        <TableHeader>
          <TableRow>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Average Rating</TableHeaderCell>
            {hasSelfRating && <TableHeaderCell>Self Rating</TableHeaderCell>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* List of categories and their average ratings */}
          {/* {Object.keys(categories).map((category, index) => ( */}
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              <TableRow onClick={() => handleRowClick(index)}>
                <TableCell>
                  <Icon
                    name={
                      expandedRows.includes(index)
                        ? "chevron up"
                        : "chevron down"
                    }
                  />
                </TableCell>
                <TableCell>
                  <label>{camelCaseToSentence(category)}</label>
                </TableCell>
                <TableCell>
                  {props.OthersFeedbackAvg[category] !== undefined && (
                    <>
                      <Rating
                        disabled
                        defaultRating={props.OthersFeedbackAvg[category]}
                        maxRating={props.maxRating}
                      />
                      <span>
                        {" "}
                        (
                        {props.OthersFeedbackAvg[category]
                          ? roundDec(props.OthersFeedbackAvg[category], 2)
                          : " N/A "}
                        )
                      </span>
                      <input
                        type="hidden"
                        name={`AverageFeedback-${category}-${props.student}`}
                        value={props.OthersFeedbackAvg[category]}
                      />
                    </>
                  )}
                </TableCell>
                {hasSelfRating && (
                  <TableCell>
                    {props.SelfFeedback.Ratings[category] !== undefined && (
                      <>
                        <Rating
                          disabled
                          defaultRating={props.SelfFeedback.Ratings[category]}
                          maxRating={props.maxRating}
                        />
                        <span>
                          {" "}
                          (
                          {props.SelfFeedback.Ratings[category]
                            ? roundDec(props.SelfFeedback.Ratings[category], 2)
                            : " N/A "}
                          )
                        </span>
                      </>
                    )}
                    <input
                      type="hidden"
                      name={`SelfFeedback-${category}-${props.student}`}
                      value={props.SelfFeedback.Ratings[category]}
                    />
                  </TableCell>
                )}
              </TableRow>
              {expandedRows.includes(index) && (
                <TableRow>
                  <TableCell colSpan="3">
                    <Card fluid>
                      <CardContent>
                        <CardHeader>
                          {camelCaseToSentence(category) +
                            " Breakdown & Feedback"}
                          <Popup
                            content="NOT visible to Evaluated Student"
                            trigger={
                              <Icon
                                name={"eye slash"}
                                style={{ marginLeft: "5px" }}
                              />
                            }
                          />
                        </CardHeader>
                        <Card.Description>
                          <List>
                            {props.OthersFeedback.map((student, otherIndex) => (
                              <ListItem key={otherIndex}>
                                <Label ribbon size="large" color="grey">
                                  {student.From}
                                </Label>
                                {student.Ratings[category] !== undefined ? (
                                  <Rating
                                    disabled
                                    defaultRating={student.Ratings[category]}
                                    maxRating={props.maxRating}
                                  />
                                ) : (
                                  <i>No rating given</i>
                                )}
                                <TextArea
                                  disabled
                                  value={
                                    student.Feedback[category] ||
                                    "No Feedback Given"
                                  }
                                />
                              </ListItem>
                            ))}
                            {hasSelfRating &&
                              props.SelfFeedback.Feedback[category] !==
                                undefined && (
                                <ListItem>
                                  <Label ribbon size="large" color="black">
                                    {props.student}
                                  </Label>
                                  <Rating
                                    disabled
                                    defaultRating={
                                      props.SelfFeedback.Ratings[category]
                                    }
                                    maxRating={props.maxRating}
                                  />
                                  <TextArea
                                    disabled
                                    value={
                                      props.SelfFeedback.Feedback[category] ||
                                      "No Feedback Given"
                                    }
                                  />
                                </ListItem>
                              )}
                          </List>
                        </Card.Description>
                      </CardContent>
                    </Card>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
