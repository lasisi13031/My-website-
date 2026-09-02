/* ==========================================
   QUEUELESS QUEUE ENGINE
========================================== */


/* ==========================================
   QUEUE DATA
========================================== */

let queueRecords =
    JSON.parse(
        localStorage.getItem(
            "queuelessQueueRecords"
        )
    ) || [];

let ticketNumber =
    Number(
        localStorage.getItem(
            "queuelessTicketNumber"
        )
    ) || 1;


/* ==========================================
   CURRENT STAFF
========================================== */

const currentStaff = {
    id: "TELLER-001",
    name: "Teller 01",
    servicePoint: "Teller"
};


/* ==========================================
   SAVE QUEUE
========================================== */

function saveQueue() {

    localStorage.setItem(
        "queuelessQueueRecords",
        JSON.stringify(queueRecords)
    );

    localStorage.setItem(
        "queuelessTicketNumber",
        ticketNumber
    );
}


/* ==========================================
   HTML ELEMENTS
========================================== */

const customerName =
    document.getElementById("customerName");

const serviceSelect =
    document.getElementById("serviceSelect");

const servicePointSelect =
    document.getElementById("servicePointSelect");

const addCustomerBtn =
    document.getElementById("addCustomerBtn");

const queueList =
    document.getElementById("queueList");

const nextCustomerElement =
    document.getElementById("nextCustomer");

const currentlyServingElement =
    document.getElementById("currentlyServing");

const staffNameElement =
    document.getElementById("staffName");

const staffIdElement =
    document.getElementById("staffId");

const staffServicePointElement =
    document.getElementById("staffServicePoint");

const waitingCountElement =
    document.getElementById("waitingCount");

const calledCountElement =
    document.getElementById("calledCount");

const servingCountElement =
    document.getElementById("servingCount");

const completedCountElement =
    document.getElementById("completedCount");


/* ==========================================
   DISPLAY CURRENT STAFF
========================================== */

function displayCurrentStaff() {

    if (staffNameElement) {

        staffNameElement.textContent =
            currentStaff.name;
    }

    if (staffIdElement) {

        staffIdElement.textContent =
            currentStaff.id;
    }

    if (staffServicePointElement) {

        staffServicePointElement.textContent =
            currentStaff.servicePoint;
    }
}


/* ==========================================
   DISPLAY QUEUE SUMMARY
========================================== */

function displayQueueSummary() {

    const waiting =
        queueRecords.filter(function(record) {
            return record.status === "Waiting";
        }).length;

    const called =
        queueRecords.filter(function(record) {
            return record.status === "Called";
        }).length;

    const serving =
        queueRecords.filter(function(record) {
            return record.status === "Serving";
        }).length;

    const completed =
        queueRecords.filter(function(record) {
            return record.status === "Completed";
        }).length;


    if (waitingCountElement) {

        waitingCountElement.textContent =
            waiting;
    }

    if (calledCountElement) {

        calledCountElement.textContent =
            called;
    }

    if (servingCountElement) {

        servingCountElement.textContent =
            serving;
    }

    if (completedCountElement) {

        completedCountElement.textContent =
            completed;
    }
}


/* ==========================================
   DISPLAY ALL CUSTOMERS
========================================== */

function displayQueue() {

    if (!queueList) {
        return;
    }

    queueList.innerHTML = "";


    /* EMPTY QUEUE */

    if (queueRecords.length === 0) {

        queueList.innerHTML = `

            <div class="queue-record">

                <strong>
                    No customers in queue
                </strong>

                <p>
                    Customers added to the queue
                    will appear here.
                </p>

            </div>

        `;

        displayQueueSummary();

        return;
    }


    /* DISPLAY EVERY RECORD */

    queueRecords.forEach(
        function(record) {

            const queueItem =
                document.createElement("div");

            queueItem.className =
                "queue-record";


            queueItem.innerHTML = `

                <strong>
                    ${record.ticket}
                </strong>

                <p>
                    ${record.customerName}
                </p>

                <p>
                    ${record.service}
                    ·
                    ${record.servicePoint}
                </p>

                <p>
                    Status:
                    <strong>
                        ${record.status}
                    </strong>
                </p>
<p>
    Wait:
    ${record.waitMinutes || 0} min
</p>

<p>
    Service:
    ${record.serviceMinutes || 0} min
</p>
${record.status === "Skipped" ? `
    <button
        type="button"
        class="queue-action-btn"
        onclick="recallCustomer('${record.id}')"
    >
        🔄 Recall Customer
    </button>
` : ""}
                <p>
                    Joined:
                    ${record.joined}
                </p>

            `;


            queueList.appendChild(
                queueItem
            );
        }
    );


    displayQueueSummary();
}


/* ==========================================
   DISPLAY NEXT CUSTOMER
========================================== */

function displayNextCustomer() {

    if (!nextCustomerElement) {
        return;
    }


    /* FIND FIRST WAITING OR CALLED CUSTOMER */

    const nextCustomer =
        queueRecords.find(function(record) {

            return (
                record.status === "Waiting" ||
                record.status === "Called"
            );

        });
console.log("QUEUE RECORDS:", queueRecords);
console.log("NEXT CUSTOMER:", nextCustomer);

    /* NO CUSTOMER NEEDING ACTION */

    if (!nextCustomer) {

        nextCustomerElement.innerHTML = `

            <div class="next-customer-empty">

                <strong>
                    No customer waiting
                </strong>

                <p>
                    The next customer will appear here.
                </p>

            </div>

        `;

        return;
    }


    /* ======================================
       WAITING CUSTOMER
    ====================================== */

    if (nextCustomer.status === "Waiting") {

        nextCustomerElement.innerHTML = `

            <div class="next-customer-card">

                <span class="section-label">
                    NEXT IN QUEUE
                </span>

                <h3>
                    ${nextCustomer.ticket}
                </h3>

                <strong>
                    ${nextCustomer.customerName}
                </strong>

                <p>
                    ${nextCustomer.service}
                    ·
                    ${nextCustomer.servicePoint}
                </p>

                <p>
                    Joined:
                    ${nextCustomer.joined}
                </p>

                <button
                    type="button"
                    class="queue-action-btn"
                    onclick="callCustomer('${nextCustomer.id}')"
                >
                    📢 Call Customer
                </button>

            </div>

        `;

        return;
    }


    /* ======================================
       CALLED CUSTOMER
    ====================================== */

    if (nextCustomer.status === "Called") {

        nextCustomerElement.innerHTML = `

            <div class="next-customer-card">

                <span class="section-label">
                    CUSTOMER CALLED
                </span>

                <h3>
                    ${nextCustomer.ticket}
                </h3>

                <strong>
                    ${nextCustomer.customerName}
                </strong>

                <p>
                    ${nextCustomer.service}
                    ·
                    ${nextCustomer.servicePoint}
                </p>

                <p>
                    Called:
                    ${nextCustomer.called}
                </p>

                <button
                    type="button"
                    class="queue-action-btn"
                    onclick="startService('${nextCustomer.id}')"
                >
                    ▶ Start Service
                </button>
<button
    type="button"
    class="queue-action-btn"
    onclick="skipCustomer('${nextCustomer.id}')"
>
    ⏭️ Skip Customer
</button>
            </div>

        `;

    }
}


/* ==========================================
   DISPLAY CURRENTLY SERVING
========================================== */

function displayCurrentlyServing() {

    if (!currentlyServingElement) {
        return;
    }


    const servingCustomer =
        queueRecords.find(function(record) {

            return record.status === "Serving";

        });


    if (!servingCustomer) {

        currentlyServingElement.innerHTML = `

            <div class="currently-serving-empty">

                <strong>
                    No customer being served
                </strong>

                <p>
                    A customer will appear here
                    when service starts.
                </p>

            </div>

        `;

        return;
    }


    currentlyServingElement.innerHTML = `

        <div class="currently-serving-card">

            <span class="section-label">
                CURRENTLY SERVING
            </span>

            <h3>
                ${servingCustomer.ticket}
            </h3>

            <strong>
                ${servingCustomer.customerName}
            </strong>

            <p>
                ${servingCustomer.service}
                ·
                ${servingCustomer.servicePoint}
            </p>

            <p>
                Started:
                ${servingCustomer.serviceStarted}
            </p>
<p>
    Service Time:
    ${servingCustomer.serviceMinutes || 0} min
</p>
<button
    type="button"
    class="queue-action-btn"
    onclick="completeService('${servingCustomer.id}')"
>
    ✅ Complete Service
</button>
        </div>

    `;
}


/* ==========================================
   ADD CUSTOMER
========================================== */

function addCustomer() {

    const name =
        customerName.value.trim();

    const service =
        serviceSelect.value;

    const servicePoint =
        servicePointSelect.value;


    /* VALIDATION */

    if (name === "") {

        alert(
            "Please enter customer name."
        );

        return;
    }


    if (service === "") {

        alert(
            "Please select a service."
        );

        return;
    }


    if (servicePoint === "") {

        alert(
            "Please select a service point."
        );

        return;
    }


    /* CREATE TICKET */

    const ticket =
        "QL-" +
        String(ticketNumber).padStart(
            5,
            "0"
        );


    /* CREATE RECORD */

    const record = {

        id: Date.now(),

        ticket: ticket,

        customerName: name,

        service: service,

        servicePoint: servicePoint,

        staffId: currentStaff.id,

        staffName: currentStaff.name,

        staffServicePoint:
            currentStaff.servicePoint,

        joined:
            new Date().toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        joinedTimestamp:
            Date.now(),

        status: "Waiting",

        called: null,

        calledTimestamp: null,

        serviceStarted: null,

        serviceStartedTimestamp: null,

        completed: null,

        completedTimestamp: null,

        skipped: null,

        skippedTimestamp: null,

        recalled: null,

        recalledTimestamp: null,

        waitMinutes: 0,

        serviceMinutes: 0
    };


    /* ADD CUSTOMER */

    queueRecords.push(record);


    /* NEXT TICKET */

    ticketNumber++;


    /* SAVE */

    saveQueue();


    /* CLEAR INPUT */

    customerName.value = "";


    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();


    alert(
        "Customer added successfully.\n\n" +
        "Ticket: " + ticket
    );
}


/* ==========================================
   CALL CUSTOMER
========================================== */

function callCustomer(customerId) {

    const customer =
        queueRecords.find(function(record) {

            return String(record.id) ===
                   String(customerId);

        });


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }


    if (customer.status !== "Waiting") {

        alert(
            "This customer is not waiting."
        );

        return;
    }

if (
    customer.servicePoint !==
    currentStaff.servicePoint
) {

    alert(
        "This customer is assigned to " +
        customer.servicePoint +
        ". You are assigned to " +
        currentStaff.servicePoint +
        "."
    );

    return;
}
    /* CHANGE STATUS */

    customer.status = "Called";


    /* SAVE CALL TIME */

    customer.called =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    customer.calledTimestamp =
        Date.now();
customer.calledBy =
    currentStaff.name;

customer.calledById =
    currentStaff.id;

    /* SAVE */

    saveQueue();


    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();


    alert(
        customer.ticket +
        " has been called."
    );
}


/* ==========================================
   START SERVICE
========================================== */

function startService(customerId) {

    const customer =
        queueRecords.find(function(record) {

            return String(record.id) ===
                   String(customerId);

        });


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }
const activeService =
    queueRecords.find(function(record) {

        return record.status === "Serving";

    });

if (activeService) {

    alert(
        "Please complete the current customer before starting another service."
    );

    return;
}

    /* ONLY CALLED CUSTOMERS */

    if (customer.status !== "Called") {

        alert(
            "Only a called customer can start service."
        );

        return;
    }

if (
    customer.servicePoint !==
    currentStaff.servicePoint
) {

    alert(
        "This customer is assigned to " +
        customer.servicePoint +
        ". You are assigned to " +
        currentStaff.servicePoint +
        "."
    );

    return;
}
    /* CHANGE STATUS */

    customer.status = "Serving";


    /* SERVICE START TIME */

    customer.serviceStarted =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    customer.serviceStartedTimestamp =
        Date.now();

customer.serviceStartedBy =
    currentStaff.name;

customer.serviceStartedById =
    currentStaff.id;
    /* CALCULATE WAIT TIME */

    if (customer.joinedTimestamp) {

        customer.waitMinutes =
            Math.max(
                0,
                Math.floor(
                    (
                        customer.serviceStartedTimestamp -
                        customer.joinedTimestamp
                    ) / 60000
                )
            );

    }


    /* SAVE */

    saveQueue();


    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();


    alert(
        customer.ticket +
        " is now being served."
    );
}
/* ==========================================
   COMPLETE SERVICE
========================================== */

function completeService(customerId) {

    const customer =
        queueRecords.find(function(record) {

            return String(record.id) ===
                   String(customerId);

        });

    if (!customer) {

        alert(
            "Customer not found."
        );

        return;
    }

    if (customer.status !== "Serving") {

        alert(
            "Only a serving customer can be completed."
        );

        return;
    }

    /* CHANGE STATUS */

    customer.status = "Completed";

    /* SAVE COMPLETION TIME */

    customer.completed =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    customer.completedTimestamp =
        Date.now();

    /* CALCULATE SERVICE TIME */

    if (customer.serviceStartedTimestamp) {

        customer.serviceMinutes =
            Math.max(
                0,
                Math.floor(
                    (
                        customer.completedTimestamp -
                        customer.serviceStartedTimestamp
                    ) / 60000
                )
            );

    }

    /* SAVE */

    saveQueue();

    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();

    alert(
        customer.ticket +
        " service completed."
    );
}
/* ==========================================
   SKIP CUSTOMER
========================================== */

function skipCustomer(customerId) {

    const customer =
        queueRecords.find(function(record) {

            return String(record.id) ===
                   String(customerId);

        });

    if (!customer) {

        alert("Customer not found.");

        return;
    }

    if (
        customer.status !== "Called" &&
        customer.status !== "Waiting"
    ) {

        alert(
            "Only a waiting or called customer can be skipped."
        );

        return;
    }

    /* CHANGE STATUS */

    customer.status = "Skipped";

    /* SAVE SKIP TIME */

    customer.skipped =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    customer.skippedTimestamp =
        Date.now();
customer.skippedBy =
    currentStaff.name;

customer.skippedById =
    currentStaff.id;
    /* SAVE */

    saveQueue();

    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();

    alert(
        customer.ticket +
        " has been skipped."
    );
}
/* ==========================================
   ADD CUSTOMER BUTTON
========================================== */

if (addCustomerBtn) {

    addCustomerBtn.addEventListener(
        "click",
        addCustomer
    );
}

/* ==========================================
   RECALL CUSTOMER
========================================== */

function recallCustomer(customerId) {

    const customer =
        queueRecords.find(function(record) {

            return String(record.id) ===
                   String(customerId);

        });

    if (!customer) {

        alert("Customer not found.");

        return;
    }

    if (customer.status !== "Skipped") {

        alert(
            "Only a skipped customer can be recalled."
        );

        return;
    }

    /* CHANGE STATUS BACK TO WAITING */

    customer.status = "Waiting";

    /* SAVE RECALL TIME */

    customer.recalled =
        new Date().toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    customer.recalledTimestamp =
        Date.now();
customer.recalledBy =
    currentStaff.name;

customer.recalledById =
    currentStaff.id;
    /* SAVE */

    saveQueue();

    /* REFRESH */

    displayQueue();

    displayNextCustomer();

    displayCurrentlyServing();

    alert(
        customer.ticket +
        " has been recalled."
    );
}
/* ==========================================
   INITIAL DISPLAY
========================================== */

displayCurrentStaff();

displayQueue();

displayNextCustomer();

displayCurrentlyServing();