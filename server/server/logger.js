

function log(log) {
    console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]`, log);
}

function warn(warn) {
    console.warn(`[${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]`, warn)
}

function error(error) {
    console.error(`[${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]`, error)
}

function info(info) {
    console.info(`[${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}]`, info)
}

module.exports = {
    log,
    warn,
    error,
    info,
}
