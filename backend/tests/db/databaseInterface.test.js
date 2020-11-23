/* global jest */
const database = require("../../src/db/databaseInterface");

jest.setTimeout(10000);

it("GET", (done) => {
    database.get("attr1", "tester0", { attr0: 0, attr2: "attr2" }, "", (err, results) => {
        expect(results).toEqual([{ attr1: "attr1" }]);
        done();
    });
});

it("UPDATE", (done) => {
    database.update("tester0", { attr1: "attr1", attr2: "attr2" }, { attr0: 0 }, (err, results) => {
        expect(results).toEqual({ "affectedRows": 1, "changedRows": 0, "fieldCount": 0, "insertId": 0, "message": "(Rows matched: 1  Changed: 0  Warnings: 0", "protocol41": true, "serverStatus": 34, "warningCount": 0 }
        );
        done();
    });
});

it("INSERT", (done) => {
    database.insert("tester0", { attr0: 99, attr1: "attr1", attr2: "attr2" }, (err, results) => {
        expect(results).toEqual({ "affectedRows": 1, "changedRows": 0, "fieldCount": 0, "insertId": 0, "message": "", "protocol41": true, "serverStatus": 2, "warningCount": 0 }
        );
        done();
    });
});

it("DELETE", (done) => {
    database.insert("tester0", { attr0: 98, attr1: "attr1", attr2: "attr2" }, (err, results) => {
        database.delete("tester0", { attr0: 98 }, (err, results) => {
            expect(results).toEqual({ "affectedRows": 1, "changedRows": 0, "fieldCount": 0, "insertId": 0, "message": "", "protocol41": true, "serverStatus": 34, "warningCount": 0 }
            );
            done();
        });
    });
});

it("getJoin", (done) => {
    database.getJoin("*", "tester0", "tester1", "tester0.attr0 = tester1.attr3", (err, results) => {
        expect(results).toEqual([{ "attr0": 0, "attr1": "attr1", "attr2": "attr2", "attr3": 0, "attr4": "attr4", "attr5": "attr5" }]
        );
        done();
    });
});