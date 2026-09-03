/* =====================================================
   QUEUELESS — CUSTOMER HISTORY ENGINE
   Omo Rabi Software
   Steps 1–5C
===================================================== */


/* =====================================================
   HISTORY STORAGE
===================================================== */

const QUEUELESS_HISTORY_KEY = "queuelessHistory";


/* =====================================================
   GET ALL HISTORY RECORDS
===================================================== */

function getHistoryRecords() {

    const storedHistory =
        localStorage.getItem(QUEUELESS_HISTORY_KEY);

    if (!storedHistory) {
        return [];
    }

    try {

        return JSON.parse(storedHistory);

    } catch (error) {

        console.error(
            "QueueLess History Error:",
            error
        );

        return [];
    }
}


/* =====================================================
   SAVE HISTORY RECORDS
===================================================== */

function saveHistoryRecords(records) {

    localStorage.setItem(
        QUEUELESS_HISTORY_KEY,
        JSON.stringify(records)
    );

}


/* =====================================================
   CREATE HISTORY RECORD
===================================================== */

function createHistoryRecord(data = {}) {

    const now = new Date();

    return {

        /* Record identification */
        recordId:
            "HST-" + now.getTime(),

        /* Customer information */
        ticketNumber:
            data.ticketNumber || "",

        customerName:
            data.customerName || "",

        customerId:
            data.customerId || "",

        /* Organization information */
        organization:
            data.organization || "",

        branch:
            data.branch || "",

        service:
            data.service || "",

        /* Queue information */
        queueType:
            data.queueType || "",

        /* Staff information */
        staff:
            data.staff || "",

        counter:
            data.counter || "",

        /* Queue journey */
        joinedAt:
            data.joinedAt || null,

        calledAt:
            data.calledAt || null,

        servingAt:
            data.servingAt || null,

        completedAt:
            data.completedAt || null,

        /* Performance information */
        waitingTime:
            data.waitingTime || 0,

        serviceTime:
            data.serviceTime || 0,

        /* Final status */
        status:
            data.status || "Completed",

        /* System timestamps */
        createdAt:
            now.toISOString(),

        date:
            now.toLocaleDateString()

    };

}


/* =====================================================
   ADD HISTORY RECORD
===================================================== */

function addHistoryRecord(data = {}) {

    const records =
        getHistoryRecords();

    const newRecord =
        createHistoryRecord(data);

    records.unshift(newRecord);

    saveHistoryRecords(records);

    return newRecord;

}


/* =====================================================
   SEARCH HISTORY RECORDS
===================================================== */

function searchHistoryRecords(searchTerm = "") {

    const records =
        getHistoryRecords();

    const term =
        String(searchTerm)
            .trim()
            .toLowerCase();


    /* Show everything when search is empty */

    if (!term) {
        return records;
    }


    return records.filter(record => {

        return (

            String(record.ticketNumber || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.customerName || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.customerId || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.service || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.branch || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.status || "")
                .toLowerCase()
                .includes(term)

            ||

            String(record.queueType || "")
                .toLowerCase()
                .includes(term)

        );

    });

}


/* =====================================================
   DISPLAY HISTORY RECORDS
===================================================== */

function displayHistoryRecords(records = null) {

    const historyList =
        document.getElementById("historyList");

    if (!historyList) {
        return;
    }


    /* If no filtered records were supplied,
       load all records */

    if (records === null) {

        records =
            getHistoryRecords();

    }


    /* =================================================
       NO RECORDS
    ================================================= */

    if (records.length === 0) {

        historyList.innerHTML = `

            <div class="history-empty">

                <strong>
                    No history records
                </strong>

                <p>
                    No matching customer records found.
                </p>

            </div>

        `;

        updateHistorySummary(records);

        return;
    }


    /* =================================================
       DISPLAY RECORDS
    ================================================= */

    historyList.innerHTML =

        records.map(record => {

            return `

                <div class="history-record">

                    <div class="history-record-header">

                        <strong>
                            ${record.ticketNumber || "No Ticket"}
                        </strong>

                        <span>
                            ${record.status || "Unknown"}
                        </span>

                    </div>


                    <div class="history-record-body">

                        <p>
                            <strong>Customer:</strong>
                            ${record.customerName || "Unknown"}
                        </p>

                        <p>
                            <strong>Customer ID:</strong>
                            ${record.customerId || "Not provided"}
                        </p>

                        <p>
                            <strong>Service:</strong>
                            ${record.service || "Not specified"}
                        </p>

                        <p>
                            <strong>Queue Type:</strong>
                            ${record.queueType || "Not specified"}
                        </p>

                        <p>
                            <strong>Organization:</strong>
                            ${record.organization || "Not specified"}
                        </p>

                        <p>
                            <strong>Branch:</strong>
                            ${record.branch || "Not specified"}
                        </p>

                        <p>
                            <strong>Staff:</strong>
                            ${record.staff || "Not assigned"}
                        </p>

                        <p>
                            <strong>Counter:</strong>
                            ${record.counter || "Not assigned"}
                        </p>

                        <p>
                            <strong>Waiting Time:</strong>
                            ${record.waitingTime || 0}
                            minutes
                        </p>

                        <p>
                            <strong>Service Time:</strong>
                            ${record.serviceTime || 0}
                            minutes
                        </p>

                    </div>


                    <div class="history-record-footer">

                        <small>
                            Date:
                            ${record.date || "Not available"}
                        </small>

                        <small>
                            Record ID:
                            ${record.recordId || "Not available"}
                        </small>

                    </div>

                </div>

            `;

        }).join("");


    updateHistorySummary(records);

}


/* =====================================================
   UPDATE HISTORY SUMMARY
===================================================== */

function updateHistorySummary(records) {

    const totalHistory =
        document.getElementById("totalHistory");

    const completedHistory =
        document.getElementById("completedHistory");

    const skippedHistory =
        document.getElementById("skippedHistory");

    const servingHistory =
        document.getElementById("servingHistory");


    /* TOTAL */

    if (totalHistory) {

        totalHistory.textContent =
            records.length;

    }


    /* COMPLETED */

    if (completedHistory) {

        completedHistory.textContent =

            records.filter(record =>

                String(record.status || "")
                    .toLowerCase() === "completed"

            ).length;

    }


    /* SKIPPED */

    if (skippedHistory) {

        skippedHistory.textContent =

            records.filter(record =>

                String(record.status || "")
                    .toLowerCase() === "skipped"

            ).length;

    }


    /* SERVING */

    if (servingHistory) {

        servingHistory.textContent =

            records.filter(record =>

                String(record.status || "")
                    .toLowerCase() === "serving"

            ).length;

    }

}


/* =====================================================
   HISTORY SEARCH CONNECTION
===================================================== */

function setupHistorySearch() {

    const searchInput =
        document.getElementById("historySearch");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchTerm =
                searchInput.value;

            const filteredRecords =
                searchHistoryRecords(
                    searchTerm
                );

            displayHistoryRecords(
                filteredRecords
            );

        }
    );

}







    console.log(
        "QueueLess test history record created:",
        testRecord
    );


    displayHistoryRecords();



/* =====================================================
   HISTORY JOURNEY ENGINE
===================================================== */

/* =====================================================
   CALCULATE TIME DIFFERENCE
===================================================== */

function calculateHistoryMinutes(startTime, endTime) {

    if (!startTime || !endTime) {
        return 0;
    }

    const start =
        new Date(startTime);

    const end =
        new Date(endTime);

    const difference =
        end - start;

    if (difference < 0) {
        return 0;
    }

    return Math.round(
        difference / 60000
    );

}


/* =====================================================
   CREATE NEW QUEUE JOURNEY
===================================================== */

function startHistoryJourney(data = {}) {

    const now =
        new Date().toISOString();

    const journey =
        addHistoryRecord({

            ...data,

            joinedAt:
                data.joinedAt || now,

            status:
                "Joined"

        });

    return journey;

}


/* =====================================================
   UPDATE HISTORY JOURNEY STATUS
===================================================== */

function updateHistoryStatus(
    recordId,
    newStatus
) {

    const records =
        getHistoryRecords();

    const recordIndex =
        records.findIndex(
            record =>
                record.recordId === recordId
        );

    /* Record not found */

    if (recordIndex === -1) {

        console.error(
            "QueueLess History Error: Record not found."
        );

        return null;

    }


    const record =
        records[recordIndex];

    const now =
        new Date().toISOString();


    /* =================================================
       JOINED
    ================================================= */

    if (newStatus === "Joined") {

        record.status =
            "Joined";

        if (!record.joinedAt) {

            record.joinedAt =
                now;

        }

    }


    /* =================================================
       WAITING
    ================================================= */

    else if (newStatus === "Waiting") {

        record.status =
            "Waiting";

    }


    /* =================================================
       CALLED
    ================================================= */

    else if (newStatus === "Called") {

        record.status =
            "Called";

        record.calledAt =
            now;

    }


    /* =================================================
       SERVING
    ================================================= */

    else if (newStatus === "Serving") {

        record.status =
            "Serving";

        record.servingAt =
            now;


        /* Calculate waiting time */

        if (record.joinedAt) {

            record.waitingTime =
                calculateHistoryMinutes(
                    record.joinedAt,
                    record.servingAt
                );

        }

    }


    /* =================================================
       COMPLETED
    ================================================= */

    else if (newStatus === "Completed") {

        record.status =
            "Completed";

        record.completedAt =
            now;


        /* Calculate waiting time */

        if (
            record.joinedAt &&
            record.servingAt
        ) {

            record.waitingTime =
                calculateHistoryMinutes(
                    record.joinedAt,
                    record.servingAt
                );

        }


        /* Calculate service time */

        if (
            record.servingAt &&
            record.completedAt
        ) {

            record.serviceTime =
                calculateHistoryMinutes(
                    record.servingAt,
                    record.completedAt
                );

        }

    }


    /* =================================================
       SKIPPED
    ================================================= */

    else if (newStatus === "Skipped") {

        record.status =
            "Skipped";

        record.completedAt =
            now;


        /* Calculate waiting time
           until the customer was skipped */

        if (record.joinedAt) {

            record.waitingTime =
                calculateHistoryMinutes(
                    record.joinedAt,
                    now
                );

        }

    }


    /* =================================================
       INVALID STATUS
    ================================================= */

    else {

        console.error(
            "QueueLess History Error: Invalid status:",
            newStatus
        );

        return null;

    }


    /* Update system timestamp */

    record.updatedAt =
        now;


    /* Save changes */

    saveHistoryRecords(
        records
    );


    /* Refresh history screen */

    displayHistoryRecords();


    console.log(
        "QueueLess History status updated:",
        record
    );


    return record;

}



      

      



    console.log(
        "1. Customer Joined:",
        record
    );


    /* Move to Waiting */

    updateHistoryStatus(
        record.recordId,
        "Waiting"
    );


    /* Move to Called */

    updateHistoryStatus(
        record.recordId,
        "Called"
    );


    /* Move to Serving */

    updateHistoryStatus(
        record.recordId,
        "Serving"
    );


    /* Move to Completed */

    updateHistoryStatus(
        record.recordId,
        "Completed"
    );


    console.log(
        "QueueLess journey test completed."
    );



/* =====================================================
   TEST SKIP QUEUE JOURNEY
   DEVELOPMENT ONLY
===================================================== */

function runHistorySkipTest() {



    /* 2. Customer waits */

    queueHistoryWaiting(
        record.recordId
    );


    /* 3. Customer is called */

    queueHistoryCalled(
        record.recordId
    );


    /* 4. Customer starts service */

    queueHistoryServing(
        record.recordId
    );


    /* 5. Customer completes service */

    queueHistoryCompleted(
        record.recordId
    );


    console.log(
        "QueueLess History Connection Layer working:",
        record
    );

}
    /* Create test customer */

    const record =
        startHistoryJourney({

            ticketNumber:
                "QL-SKIP-001",

            customerName:
                "Skip Test Customer",

            customerId:
                "SKIP-001",

            organization:
                "QueueLess Demo",

            branch:
                "Main Branch",

            service:
                "General Service",

            queueType:
                "Walk-in",

            staff:
                "Staff 01",

            counter:
                "Counter 01"

        });

/* =====================================================
   QUEUELESS HISTORY CONNECTION LAYER
===================================================== */

/*
   These functions are the official connection points
   that the future Queue Engine will use.
*/


/* =====================================================
   START CUSTOMER HISTORY
===================================================== */

function queueHistoryJoined(data = {}) {

    return startHistoryJourney(data);

}


/* =====================================================
   CUSTOMER CALLED
===================================================== */

function queueHistoryCalled(recordId) {

    return updateHistoryStatus(
        recordId,
        "Called"
    );

}


/* =====================================================
   CUSTOMER STARTS SERVICE
===================================================== */

function queueHistoryServing(recordId) {

    return updateHistoryStatus(
        recordId,
        "Serving"
    );

}


/* =====================================================
   CUSTOMER COMPLETES SERVICE
===================================================== */

function queueHistoryCompleted(recordId) {

    return updateHistoryStatus(
        recordId,
        "Completed"
    );

}


/* =====================================================
   CUSTOMER IS SKIPPED
===================================================== */

function queueHistorySkipped(recordId) {

    return updateHistoryStatus(
        recordId,
        "Skipped"
    );

}


/* =====================================================
   CUSTOMER WAITING
===================================================== */

function queueHistoryWaiting(recordId) {

    return updateHistoryStatus(
        recordId,
        "Waiting"
    );

}
    /* Joined → Waiting */

    updateHistoryStatus(
        record.recordId,
        "Waiting"
    );


    /* Waiting → Called */

    updateHistoryStatus(
        record.recordId,
        "Called"
    );


    /* Called → Skipped */

    updateHistoryStatus(
        record.recordId,
        "Skipped"
    );


    console.log(
        "QueueLess skip journey test completed:",
        record
    );


/* =====================================================
   CLEAR HISTORY
   DEVELOPMENT ONLY
===================================================== */

function clearQueueLessHistory() {

    localStorage.removeItem(
        QUEUELESS_HISTORY_KEY
    );

    displayHistoryRecords();

    console.log(
        "QueueLess history cleared."
    );

}


/* =====================================================
   START HISTORY SYSTEM
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayHistoryRecords();

        setupHistorySearch();

    }
);