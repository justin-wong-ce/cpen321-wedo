// Does error checking for MySQL callback and sends responses
function callbackHandler(err, results) {

    if (err.code === 'ER_DUP_ENTRY')
        res.status(406).send("user/task/tasklist already exists");

    else if (err.code === 'ER_WARN_NULL_TO_NOTNULL' ||
        err.code === 'ER_WARN_DATA_OUT_OF_RANGE' ||
        err.code === 'ER_WARN_DATA_TRUNCATED')
        res.status(400).send("bad data format or type")

    else if (err) {
        res.status(404).send(err);
    }

    else {
        res.status(200).send(results);
    }
}

const routerHelper = {
    callbackHandler: callbackHandler
}

module.exports = routerHelper