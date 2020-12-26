
$.get('/db/selectExemplary', function(data) {
    console.log(data);

    for(let i = 0; i < data.length; i++) {

        $('#exemplaryProjectsDiv').append(createProjectElement(data[i]));
    }

}).then(() => {
    $('.ui.accordion').accordion();
});



function createProjectElement(dbObject) {
    let project = document.createElement('div');
    project.classList.add('ui', 'segment', 'stackable', 'padded', 'grid');

    let headerRow = document.createElement('div');
    headerRow.classList.add('row');
    project.appendChild(headerRow);

    let header = document.createElement('h3');
    header.classList.add('ui', 'header', 'projectTitle');
    header.innerText = dbObject.title;
    headerRow.appendChild(header);

    let contentRow = document.createElement('div');
    contentRow.classList.add('three','column','row');
    project.appendChild(contentRow);

    let posterColumn = document.createElement('div');
    posterColumn.classList.add('column');
    contentRow.appendChild(posterColumn);

    let poster = document.createElement('img');
    poster.style.border = "3px solid #DDDDDD";
    poster.src = '/db/getPoster?fileName=' + dbObject.poster_thumb;
    posterColumn.appendChild(poster);

    let teamColumn = document.createElement('div');
    teamColumn.classList.add('column');
    contentRow.appendChild(teamColumn);

    let teamHeader = document.createElement('h4');
    teamHeader.innerText = 'Team:';
    teamColumn.appendChild(teamHeader);
    
    let teamName = document.createElement('p');
    teamName.innerText = dbObject.team_name;
    teamColumn.appendChild(teamName);
    
    let memberHeader = document.createElement('h4');
    memberHeader.innerText = 'Students:';
    teamColumn.appendChild(memberHeader);

    let teamMembers = document.createElement('p');
    teamMembers.innerText = dbObject.members;
    teamColumn.appendChild(teamMembers);
    
    let sponsorColumn = document.createElement('div');
    sponsorColumn.classList.add('column');
    contentRow.appendChild(sponsorColumn);

    let sponsorHeader = document.createElement('h4');
    sponsorHeader.innerText = 'Sponsor:';
    sponsorColumn.appendChild(sponsorHeader);

    let sponsor = document.createElement('p');
    sponsor.innerText = dbObject.sponsor;
    sponsorColumn.appendChild(sponsor);

    let coachHeader = document.createElement('h4');
    coachHeader.innerText = 'Faculty Coach:';
    sponsorColumn.appendChild(coachHeader);

    let coach = document.createElement('p');
    coach.innerText = dbObject.coach;
    sponsorColumn.appendChild(coach);

    let synopsisRow = document.createElement('div');
    synopsisRow.classList.add('row');
    project.appendChild(synopsisRow);

    let accordion = document.createElement('div');
    accordion.classList.add('ui','accordion');
    synopsisRow.appendChild(accordion);

    let accordionTitle = document.createElement('div');
    accordionTitle.classList.add('title');
    accordionTitle.innerHTML = '<i class="dropdown icon"></i>Project Synopsis';
    accordion.appendChild(accordionTitle);

    let accordionContent = document.createElement('div');
    accordionContent.classList.add('content');
    accordionContent.innerHTML = '<p class="transition hidden">' + dbObject.synopsis + '</p>';
    accordion.appendChild(accordionContent);

    return project;
}
