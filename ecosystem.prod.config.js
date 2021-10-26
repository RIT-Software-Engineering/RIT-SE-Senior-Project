module.exports = {
    apps : [
        {
            name   : "prod",
            script : "./server/main.js",
            env: {
                NODE_ENV: "production",
                BASE_URL: "https://seniorproject.se.rit.edu",
                PORT: "3001"
            },
        },
    ]
}