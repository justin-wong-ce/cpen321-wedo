function computeExistCheck(results) {
    return (typeof (results.affectedRows) !== "undefined" && results.affectedRows === 0) || (results.length === 0 && typeof (results.affectedRows) === "undefined");
}

function noErrCheck(results, res) {
    let doesNotExist = computeExistCheck(results);
    if (!doesNotExist) {
        res.status(200).send(results);
    }
    else {
        res.status(404).send({ msg: "entry does not exist" });
    }
}

function noResCheck(err, res) {
    let alrExists = err.code === "ER_DUP_ENTRY" || err.code === "ER_DUP_KEY";
    // err.code === "ER_WARN_NULL_TO_NOTNULL" ||
    //     err.code === "ER_WARN_DATA_OUT_OF_RANGE" ||
    //     err.code === "ER_WARN_DATA_TRUNCATED" ||
    //     err.code === "ER_TRUNCATED_WRONG_VALUE" ||
    //     err.code === "ER_BAD_FIELD_ERROR" ||
    //     err.code === "ER_PARSE_ERROR";

    if (alrExists) {
        res.status(406).send({ msg: "user/task/tasklist already exists" });
    }
    else {
        let doesNotExist = err.code === "ER_NO_REFERENCED_ROW_2";
        if (doesNotExist) {
            res.status(404).send({ msg: "entry does not exist" });
        }
        else {
            res.status(400).send({ msg: "bad data format or type" });
        }
    }
}

function callbackHandler(err, results, res) {
    if (!err) {
        noErrCheck(results, res);
    }
    else {
        noResCheck(err, res);
    }
}

function permHandler(err, results, perms, res) {
    if (!perms) {
        if (err === "get premium") {
            res.status(401).send({ msg: "user needs to buy premium" });
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