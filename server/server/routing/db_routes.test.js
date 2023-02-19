const app = require('../../server') // Link to your server file
const supertest = require('supertest')

it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

describe('GET HTML', function() {
    it('sponsors', function(done) {
        supertest(app).get('/db/getHtml').expect(200);
    });
});
