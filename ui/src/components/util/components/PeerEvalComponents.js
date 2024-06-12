import { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import {
    Grid, GridColumn, GridRow, Header, Radio
} from 'semantic-ui-react';

export const QuestionMoodRating = ({ question, student_names, satisfactionLevels }) => {
    if (!satisfactionLevels) {
        satisfactionLevels = ['Extremely Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Extremely Satisfied'];
    }

    const [selections, setSelections] = useState({});

    const handleSelection = (student, rating) => {
        setSelections({
            ...selections,
            [student]: rating
        });
    };

    return (
        <div>
            <Header as='h2' content={question} textAlign='left' />
            <br />
            <Grid divided='vertically'>
                {student_names.map(name => (
                    <GridRow columns={satisfactionLevels.length + 1}>
                        <GridColumn style={{ textAlign: 'left' }}><Header as='h3' content={name} /></GridColumn>
                        {
                            satisfactionLevels.map((level, index) => (
                                <GridColumn style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Radio style={{ margin: '8px auto' }} value={index} checked={selections[name] === index} onChange={() => handleSelection(name, index)} />
                                    {level}
                                </GridColumn>
                            ))
                        }
                    </GridRow>
                ))}
            </Grid>
        </div>
    );
};