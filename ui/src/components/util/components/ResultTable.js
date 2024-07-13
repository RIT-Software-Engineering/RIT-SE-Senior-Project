import React, { useEffect, useState } from 'react';
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
    Popup
} from 'semantic-ui-react';

export default function ResultTable(props) {
    const [expandedRows, setExpandedRows] = useState([]);

    const camelCaseToSentence = (string = '') =>
        string.replace(/([A-Z])/g, (word) => ` ${word}`).trimStart();

    const handleRowClick = (index) => {
        setExpandedRows(expandedRows.includes(index)
            ? expandedRows.filter(row => row !== index)
            : [...expandedRows, index]
        );
    };

    useEffect(() => {
        // console.log(props.OthersFeedback);
    }, []);

    return (
        <Container fluid>
            <Table collapsing celled striped>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell>Category</TableHeaderCell>
                        <TableHeaderCell>Average Rating</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* List of categories and their average ratings */}
                    {Object.keys(props.OthersFeedbackAvg).map((category, index) => (
                        <React.Fragment key={index}>
                            <TableRow onClick={() => handleRowClick(index)}>
                                <TableCell>
                                    <Icon name={expandedRows.includes(index) ? 'chevron up' : 'chevron down'} />
                                </TableCell>
                                <TableCell>
                                    <label>{camelCaseToSentence(category)}</label>
                                </TableCell>
                                <TableCell>
                                    <Rating
                                        disabled
                                        defaultRating={props.OthersFeedbackAvg[category]}
                                        maxRating={props.maxRating}
                                    />
                                    <span> ({props.OthersFeedbackAvg[category]})</span>
                                    <input
                                        type="hidden"
                                        name={`AverageFeedback-${category}-${props.student}`}
                                        value={props.OthersFeedbackAvg[category]}
                                    />
                                </TableCell>
                            </TableRow>
                            {expandedRows.includes(index) && (
                                <TableRow>
                                    <TableCell colSpan="3">
                                        <Card fluid>
                                            <CardContent>
                                                <CardHeader>{camelCaseToSentence(category) + " Breakdown & Feedback"} <Popup trigger={<Icon name={"eye slash"}></Icon>} content={"NOT visible to Evaluated Student"}/></CardHeader>
                                                <Card.Description>
                                                    <List>
                                                        {props.OthersFeedback.map((student, otherIndex) => (
                                                            <ListItem key={otherIndex}>
                                                                <Label ribbon size='large' color='grey'>{student.From}</Label>
                                                                <Rating
                                                                    disabled
                                                                    defaultRating={student.Ratings[category]}
                                                                    maxRating={props.maxRating}
                                                                />
                                                                <TextArea disabled>
                                                                    {student.Feedback[category] || "No Feedback Given"}
                                                                </TextArea>
                                                            </ListItem>
                                                        ))}
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
