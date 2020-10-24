export class PriorityQueue {
    constructor() {
        this.list = [];
    }

    // value is an array with length of 2
    // index0: nodeID
    // index1: distance
    enqueue(value) {
        if (this.list.isEmpty()) {
            this.list.push(value);
        } else {
            let pushed = false;
            for (let listIter = 0; listIter < this.list.length; listIter++) {
                if (value[1] < this.list[i][1]) {
                    this.list.splice(listIter, 0, value);
                    pushed = true;
                    break;
                }
            }

            if (pushed == false) {
                this.list.push(value);
            }
        }
    };

    dequeue() {
        let value = this.list.shift();
        return value;
    }

    isEmpty() {
        return this.list.length == 0;
    }

}