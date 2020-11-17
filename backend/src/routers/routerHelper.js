// Does error checking for MySQL callback and sends responses
function callbackHandler(err, results, res) {
    // DELETE LATER
    if (!err) {
        doesNotExist = results.length === 0 || results.affectedRows === 0;
        if (!doesNotExist) {
            res.status(200).send(results);
        }
        else {
            res.status(404).send({ msg: "entry does not exist" });
        }
    }
    else {

        //let alreadyExists = err.code === "ER_DUP_ENTRY";

        let badDataType = err.code === "ER_WARN_NULL_TO_NOTNULL" ||
            err.code === "ER_WARN_DATA_OUT_OF_RANGE" ||
            err.code === "ER_WARN_DATA_TRUNCATED" ||
            err.code === "ER_TRUNCATED_WRONG_VALUE" ||
            err.code === "ER_BAD_FIELD_ERROR" ||
            err.code === "ER_PARSE_ERROR";

        if (badDataType) {
            res.status(400).send({ msg: "bad data format or type" });
        }
        else {
            res.status(406).send({ msg: "user/task/tasklist already exists" });
        }
    }
}

function permHandler(err, results, perms, res) {
    if (!perms) {
        res.status(401).send({ msg: "user does not have permissions" });
    }
    else {
        callbackHandler(err, results, res);
    }
}

const routerHelper = {
    callbackHandler,
    permHandler
};

module.exports = routerHelper;