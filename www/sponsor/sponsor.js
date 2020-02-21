$('.ui.accordion').accordion()

$('.ui.modal').modal({
    closable: false
});

$('#proposalBtn').on('click', function(data) {
    $('.ui.modal').modal('show');
});