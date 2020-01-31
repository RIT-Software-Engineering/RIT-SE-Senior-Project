console.log('hello world');

let filename = 'test.jpg';

$.get("/db/selectAll", function(data) {
    console.log(data);
    let result = document.createElement('p');
    result.textContent = JSON.stringify(data);
    document.body.appendChild(result);
    //filename = data.poster;
}).then(()=> {

    let img = document.createElement('img');
    img.src = '/db/getPoster?fileName=' + filename;
    document.body.appendChild(img);
});
