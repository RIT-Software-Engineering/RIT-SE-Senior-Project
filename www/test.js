
$.get('/db/selectExemplary', function(data) {
    console.log(data);
    $('#exemplaryProjectsDiv').append(createProjectElement(data[0]));
}).then(() => {
    $('.ui.accordion').accordion();

});



function createProjectElement(dbObject) {
    var project = document.createElement('div');
    project.classList.add('ui', 'segment', 'stackable', 'padded', 'grid');

    var headerRow = document.createElement('div');
    headerRow.classList.add('row');
    project.appendChild(headerRow);

    var header = document.createElement('h3');
    header.classList.add('ui', 'header', 'projectTitle');
    header.innerText = dbObject.title;
    headerRow.appendChild(header);

    var contentRow = document.createElement('div');
    contentRow.classList.add('three','column','row');
    project.appendChild(contentRow);

    var posterColumn = document.createElement('div');
    posterColumn.classList.add('column');
    contentRow.appendChild(posterColumn);

    var poster = document.createElement('img');
    poster.src = '/db/getPoster?fileName=' + dbObject.poster;
    posterColumn.appendChild(poster);

    var teamColumn = document.createElement('div');
    teamColumn.classList.add('column');
    contentRow.appendChild(teamColumn);

    var teamHeader = document.createElement('h4');
    teamHeader.innerText = 'Team:';
    teamColumn.appendChild(teamHeader);
    
    //TODO modify database to store team name
    var teamName = document.createElement('p');
    teamName.innerText = dbObject.teamName;
    teamColumn.appendChild(teamName);
    
    var memberHeader = document.createElement('h4');
    memberHeader.innerText = 'Students:';
    teamColumn.appendChild(memberHeader);

    var teamMembers = document.createElement('p');
    teamMembers.innerText = dbObject.members;
    teamColumn.appendChild(teamMembers);
    
    var sponsorColumn = document.createElement('div');
    sponsorColumn.classList.add('column');
    contentRow.appendChild(sponsorColumn);

    var sponsorHeader = document.createElement('h4');
    sponsorHeader.innerText = 'Sponsor:';
    sponsorColumn.appendChild(sponsorHeader);

    var sponsor = document.createElement('p');
    sponsor.innerText = dbObject.sponsor;
    sponsorColumn.appendChild(sponsor);

    var coachHeader = document.createElement('h4');
    coachHeader.innerText = 'Faculty Coach:';
    sponsorColumn.appendChild(coachHeader);

    var coach = document.createElement('p');
    coach.innerText = dbObject.coach;
    sponsorColumn.appendChild(coach);

    var synopsisRow = document.createElement('div');
    synopsisRow.classList.add('row');
    project.appendChild(synopsisRow);

    var accordion = document.createElement('div');
    accordion.classList.add('ui','accordion');
    synopsisRow.appendChild(accordion);

    var accordionTitle = document.createElement('div');
    accordionTitle.classList.add('title');
    accordionTitle.innerHTML = '<i class="dropdown icon"></i>Project Synopsis';
    accordion.appendChild(accordionTitle);

    var accordionContent = document.createElement('div');
    accordionContent.classList.add('content');
    accordionContent.innerHTML = '<p class="transition hidden">' + dbObject.synopsis + '</p>';
    accordion.appendChild(accordionContent);

    return project;
}

/* <div class="ui segment stackable padded grid">
    <div class="row">
        <h3 class="ui header projectTitle">Creating an Interactive Vocabulary Practice Program</h3>
    </div>
    <div class="three column row">
        <div class="column">
            <img class="ui image"  src="TeamJS-Thumb.jpg">
        </div>
        <div class="column">
            
                <h4>Team:</h4>
                        <p>Team.js</p>
                        <h4>Students:</h4>
                        <p>John Renner, Michael Timbrook, Matthew Witte, Johnathan Sellers</p>
            
            
        </div>
        <div class="column">
            <div style="width: 50%;">
                <h4>Sponsor:</h4>
                        <p>RIT NTID-Liberal Studies</p>
                        <h4>Faculty Coach:</h4>
                        <p>Don Boyd</p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="ui accordion">
            <div class="title">
            <i class="dropdown icon"></i>
            Project Synopsis
            </div>
            <div class="content">
            <p class="transition hidden">The vocabulary program is a tool for teachers to teach advanced vocabulary skills to deaf students whose hearing loss has significantly reduced their access to auditory English learning. ASL and other sign based communication modalities in some instances do not mark all English word forms and word roots. The vocabulary program provides a platform for teachers to strengthen student skills through repetition and various forms of enforcements. Teachers would be able to construct and share lessons that focus on specific sets of words. These lessons would include information such as context sentences, definitions, roots, synonyms, and antonyms. The lessons will be populated with existing corpus references, but will allow for editing by teachers for further customization. Teachers will then be able to assign lessons to students for completion and the program will provide metrics of success after the completion of a lesson. These metrics will encompass grading as well as give information about certain aspects of the lesson such as completion time and completion percentage. The program will be accessed through a web portal. The focus of the project will be to create one model lesson that is thoroughly vetted and will systematically produce a stable and simple workflow for both teachers and students alike.</p>
            </div>
        </div>
    </div>
</div> */