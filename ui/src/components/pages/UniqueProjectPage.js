import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import ExemplaryProject from "./HomePage/ExemplaryProject";

const tempData = {
    "archive_id":1,
    "project_id":null,
    "csv":null,
    "name":"Name 1",
    "dept":null,
    "start_date":null,
    "end_date":null,
    "featured":0,
    "outstanding":0,
    "creative":0,
    "title":"Business Action Tracking",
    "team_name":"BAT Team","members":"Shayde Nofziger, Chris Jones, Alex Parrill, Corban Mailloux, Adam McCarthy",
    "sponsor":"Lockheed Martin - Enterprise Business Services",
    "coach":"Sam Malachowsky",
    "poster_thumb":"BAT-Thumb.jpg",
    "poster_full":null,
    "synopsis":"Developed for Lockheed Martin, the Business Action Tracking system is a highly-integrated, " +
        "user-friendly task management tool to be used across teams in a corporate setting. The system can be \n    " +
        "used to create, update, and monitor actions to their completion. Actions can be hierarchical, " +
        "associated with a project, and/or interdepartmental. An action is assigned to an actor and contains basic " +
        "fields, including name, description, due date, and status. \n    Additional notes or custom fields can be " +
        "included.Seamless integration with existing workflows and tools (e.g. Outlook, iPhone, and possibly others) " +
        "is a core part of the tool. Users can enter and update actions without leaving their existing workflows. " +
        "The tool will add value without impeding on existing business processes. \n    Because of this, the system " +
        "is designed to be intuitively usable with little instruction or training.\n    To encourage adoption and use, " +
        "users may manage and update tasks with the tool from a number of devices, including laptops, desktops, " +
        "and iPhones. All supported devices must have access to useful functionality, and \n    " +
        "feature intuitive interfaces to ensure that users can easily manage tasks.The system also includes a " +
        "management interface, allowing administrators to view overall statistics and concerns in a dashboard view. " +
        "This is especially useful when estimating time to \n    completion for similar tasks, seeing where teams are " +
        "falling behind, and for managing risks. To encourage user engagement, the system will reward users for " +
        "completing actions.","video":null}

function UniqueProjectPage() {
    let { title } = useParams();
    /**
     * TODO:
     * - how to query db
     * - create new column urlTitle
     * - query project data based on "urlTitle" column
     *      - EXISTS: proceed with component logic here
     *      - otherwise we can call error page and render instead
     */
    return (
        <div>
            <h1>Unique Project Page Title from URL: {title}</h1>
            <ExemplaryProject project={tempData}/>
        </div>
    )
}

export default UniqueProjectPage;
