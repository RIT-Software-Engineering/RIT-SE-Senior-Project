import "../../css/components/shared/projectCard.css";
import "../../css/base/variables.css";
import { config } from "../util/functions/constants";
import { getFormattedDate } from "../util/functions/utils"
import { decode } from "html-entities";
import uiConfig from "../../config/uiConfig.js";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

function ProjectCard({ project, exemplary = false, onClick }){

    const decodeSynopsis = (synopsis) => {
        return decode(synopsis).replace(/\r\n|\r/g, "\n");
    };

    const getFirstSentence = (text) => {
        const match = text.match(/.*?[.!?](?:\s|$)/);
        return (match ? match[0].trim() : text);
    }

    return (
        <div class="card" onClick={() => onClick(project)}>
            <div className="ui header project-title">{project.title}</div>
            <img
              src={project.poster_thumb ? [`${basePosterURL}${project.poster_thumb}`] : [`${uiConfig.logoPath}`]}
              alt="Project Poster"
            />
            <div className="ui header project-desc">{getFirstSentence(decodeSynopsis(project.synopsis))}</div>
            <div className="ui header project-desc">{getFormattedDate(project.start_date)} - {getFormattedDate(project.end_date)}</div>
        </div>
    );
}

export default ProjectCard;