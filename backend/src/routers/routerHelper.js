// Does error checking for MySQL callback and sends responses
function callbackHandler(err, results, res) {
    if (!err) {
        let doesNotExist = (results.length === 0 && typeof (results.affectedRows) === "undefined")
            || (typeof (results.affectedRows) !== "undefined" && results.affectedRows === 0);

        if (!doesNotExist) {
            res.status(200).send(results);
        }
        else {
            res.status(404).send({ msg: "entry does not exist" });
        }
    }
    else {
        let doesNotExist = err.code === "ER_NO_REFERENCED_ROW_2";
        let badDataType = err.code === "ER_WARN_NULL_TO_NOTNULL" ||
            err.code === "ER_WARN_DATA_OUT_OF_RANGE" ||
            err.code === "ER_WARN_DATA_TRUNCATED" ||
            err.code === "ER_TRUNCATED_WRONG_VALUE" ||
            err.code === "ER_BAD_FIELD_ERROR" ||
            err.code === "ER_PARSE_ERROR";

        if (badDataType) {
            res.status(400).send({ msg: "bad data format or type" });
        }
        else if (doesNotExist) {
            res.status(404).send({ msg: "entry does not exist" });
        }
        else {
            res.status(406).send({ msg: "user/task/tasklist already exists" });
        }
    }
}

function permHandler(err, results, perms, res) {
    if (!perms) {
        if (err === "get premium") {
            res.status(401).send({ msg: "user needs to buy premium" })
        }
        else {
            res.status(401).send({ msg: "user does not have permissions" });
        }
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