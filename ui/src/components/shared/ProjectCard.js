import "../../css/components/shared/projectCard.css";
import "../../css/base/variables.css";
import { config } from "../util/functions/constants";
import { getFormattedDate } from "../util/functions/utils"
import { decode } from "html-entities";
import uiConfig from "../../config/uiConfig.js";

const basePosterURL = `${config.url.API_GET_ARCHIVE_POSTER}?fileName=`;

function ProjectCard({ project, cardClass="card", onClick }){

    const decodeSynopsis = (synopsis) => {
        return decode(synopsis).replace(/\r\n|\r/g, "\n");
    };

    const getFirstSentence = (text) => {
        const maxLength = 150;
        const match = text.match(/.*?[.!?](?:\s|$)/);
        const sentence = match ? match[0].trim() : text
        return (sentence.length > maxLength ? sentence.slice(0, maxLength-3) + "..." : sentence);
    }
    
    const awards = Object.values(uiConfig.awards).filter(
        (award) => project[award.sqlName] === 1);

    return (
        <div className={`${cardClass} ${awards.length === 0 ? "no-award" : ""}`} onClick={() => onClick(project)}>

            {cardClass===("card-exemplary") && awards.length > 0 &&
            <div className="award-sash" style={{ backgroundColor: awards[0].color, color: awards[0].textColor }}>
                <div className="ui header">{awards[0].name}</div>
            </div>}

            {(cardClass===("card-exemplary-left") || cardClass===("card-exemplary-right")) && awards.length > 0 &&
            <div className="award-sash-side" style={{ backgroundColor: awards[0].color, color: awards[0].textColor }}>
                <div className="ui header">{awards[0].name}</div>
            </div>}

            {cardClass===("card-exemplary") && awards.length > 1 &&
            <div className="award-sash-left" style={{ backgroundColor: awards[1].color, color: awards[1].textColor }}>
                <div className="ui header">{awards[1].name}</div>
            </div>}

            {(cardClass===("card-exemplary-left") || cardClass===("card-exemplary-right")) && awards.length > 1 &&
            <div className="award-sash-left-side" style={{ backgroundColor: awards[1].color, color: awards[1].textColor }}>
                <div className="ui header">{awards[1].name}</div>
            </div>}

            <div className="ui header project-title">{project.title}</div>

            {cardClass===("card") && awards.length > 0 &&
            <div style={{ display: "flex", flexDirection:"column", alignItems:"center"}}>
            {awards.map((award) => (
              <div className="short-award-ribbon" style={{ backgroundColor: award.color, color: award.textColor }}>
                <div className="ui header">{award.name}</div>
              </div>
            ))}
            </div>}

            <img
              src={project.poster_thumb ? [`${basePosterURL}${project.poster_thumb}`] : [`${uiConfig.logoPath}`]}
              alt="Project Poster"
            />
            <div className="ui header project-desc" style={{ paddingTop: "15px" }}>{getFirstSentence(decodeSynopsis(project.synopsis))}</div>
            <div className="ui header project-desc">{getFormattedDate(project.start_date)} - {getFormattedDate(project.end_date)}</div>
        </div>
    );
}

export default ProjectCard;