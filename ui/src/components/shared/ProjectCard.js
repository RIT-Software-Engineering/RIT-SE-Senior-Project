import "../../css/components/shared/projectCard.css";
import "../../css/base/variables.css";
import { config } from "../util/functions/constants";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

function ProjectCard({ project, exemplary = false, onClick }){
    return (
        <div class="card" onClick={() => onClick(project)}>
            <div className="ui header project-title">{project.title}</div>
            <img
              src={`${basePosterURL}${project.poster_thumb}`}
              alt="Project Poster"
            />
            <div className="ui small header">{project.sypnosis}</div>
            <div className="ui small header">{project.start_date} - {project.end_date}</div>
        </div>
    );
}

export default ProjectCard;