module.exports = {
    apps : [
        {
            name   : "dev",
            script : "./server/main.js",
            env: {
                NODE_ENV: "development",
                BASE_URL: "https://seniorproject.se.rit.edu/test",
                PORT: "3002"
            },
        },
    ]
}