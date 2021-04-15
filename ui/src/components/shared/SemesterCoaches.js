import React from 'react'
import { Accordion } from 'semantic-ui-react';

export default function SemesterCoaches({coaches}) {

    return (
        <>
            {coaches && <Accordion 
                fluid
                styled
                panels={coaches.map(coach => {
                    return {
                        key: coach.system_id,
                        title: `${coach.fname} ${coach.lname}`,
                        content: {
                            content: coach.projects?.map(project => {
                                return <p>{project.title}</p>
                            })
                        }
                    }
                })}
            />}
        </>
    )
}
