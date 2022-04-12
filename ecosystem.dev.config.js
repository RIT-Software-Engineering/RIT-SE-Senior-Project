module.exports = {
    apps : [
        {
            name   : "dev",
            script : "./server/main.js",
            env: {
                NODE_ENV: "development",
                BASE_URL: "https://seniorproject-sandbox.se.rit.edu",
                PORT: "3002"
            },
            error_file : "/home/website-test/.pm2/logs/dev-error.log",
            out_file : "/home/website-test/.pm2/logs/dev-out.log"
        },
    ]
}