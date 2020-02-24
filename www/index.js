
$.get('/db/selectExemplary', function(data) {
    console.log(data);

    for(var i = 0; i < data.length; i++) {

        $('#exemplaryProjectsDiv').append(createProjectElement(data[i]));
    }

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
    poster.style.border = "3px solid #DDDDDD";
    poster.src = '/db/getPoster?fileName=' + dbObject.poster;
    posterColumn.appendChild(poster);

    var teamColumn = document.createElement('div');
    teamColumn.classList.add('column');
    contentRow.appendChild(teamColumn);

    var teamHeader = document.createElement('h4');
    teamHeader.innerText = 'Team:';
    teamColumn.appendChild(teamHeader);
    
    var teamName = document.createElement('p');
    teamName.innerText = dbObject.team_name;
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
