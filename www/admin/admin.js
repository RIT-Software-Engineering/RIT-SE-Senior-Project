$('.tabular.menu .item').tab();

function loadSponsorInfo() {
    $.get('/db/selectAllSponsorInfo', function(data) {
        console.log(data);
        
    });
}