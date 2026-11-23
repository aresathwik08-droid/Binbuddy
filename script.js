
// BINBUDDY - JAVASCRIPT

// 1. WASTE ITEM DATABASE

const wasteItems = {
    "vegetable peels": {
        bin: "Green Bin",
        type: "Wet Waste"
    },
    "food waste": {
        bin: "Green Bin",
        type: "Wet Waste"
    },
    "banana peel": {
        bin: "Green Bin",
        type: "Wet Waste"
    },
    "paper": {
        bin: "Blue Bin",
        type: "Dry Waste"
    },
    "plastic bottle": {
        bin: "Blue Bin",
        type: "Dry Waste"
    },
    "cardboard": {
        bin: "Blue Bin",
        type: "Dry Waste"
    },
    "broken tube light": {
        bin: "Red Bin",
        type: "Hazardous / E-Waste"
    },
    "battery": {
        bin: "Red Bin",
        type: "Hazardous Waste"
    }
};


// 2. WASTE SEARCH FUNCTION

function searchWaste() {

    const item = document.getElementById("wasteInput")
        .value.trim().toLowerCase();

    const result = document.getElementById("wasteResult");

    if (item === "") {
        result.textContent = "Please enter a waste item.";
        result.className = "result";
        return;
    }

    if (wasteItems[item]) {

        const data = wasteItems[item];

        result.textContent =
            "Item: " + item +
            " | Bin: " + data.bin +
            " | Category: " + data.type;

        result.className = "result " +
            (data.bin === "Green Bin" ? "bin-green" :
             data.bin === "Blue Bin" ? "bin-blue" :
             "bin-red");

    } else {

        result.textContent =
            "Item not found. Please check the item name.";

        result.className = "result";
    }
}


// 3. SAVE AND LOAD COMPLAINTS

const storageKey = "binbuddyComplaints";

let complaints = [];

try {
    complaints = JSON.parse(
        localStorage.getItem(storageKey)
    ) || [];
} catch (error) {
    complaints = [];
}


// 4. INITIAL SAMPLE COMPLAINTS

if (complaints.length === 0) {

    complaints = [
        {
            id: 1,
            name: "Rahul",
            location: "Colony Park",
            category: "Overflowing Garbage",
            description: "Garbage bin is full.",
            status: "Reported",
            votes: 2,
            voters: [],
            photo: ""
        },
        {
            id: 2,
            name: "Priya",
            location: "Main Road",
            category: "Dry Waste",
            description: "Waste collection is pending.",
            status: "Reported",
            votes: 1,
            voters: [],
            photo: ""
        },
        {
            id: 3,
            name: "Arun",
            location: "Apartment Gate",
            category: "Wet Waste",
            description: "Garbage is not collected.",
            status: "Assigned",
            votes: 3,
            voters: [],
            photo: ""
        },
        {
            id: 4,
            name: "Kiran",
            location: "Bus Stop",
            category: "Overflowing Garbage",
            description: "Garbage near bus stop.",
            status: "Assigned",
            votes: 2,
            voters: [],
            photo: ""
        },
        {
            id: 5,
            name: "Ravi",
            location: "School Road",
            category: "Dry Waste",
            description: "Plastic waste problem.",
            status: "Cleaned",
            votes: 4,
            voters: [],
            photo: ""
        },
        {
            id: 6,
            name: "Sita",
            location: "Market Street",
            category: "Wet Waste",
            description: "Waste has been removed.",
            status: "Cleaned",
            votes: 1,
            voters: [],
            photo: ""
        },
        {
            id: 7,
            name: "Manoj",
            location: "Temple Road",
            category: "E-Waste",
            description: "Old electronic waste.",
            status: "Reported",
            votes: 0,
            voters: [],
            photo: ""
        },
        {
            id: 8,
            name: "Anu",
            location: "Park Entrance",
            category: "Sanitary Waste",
            description: "Improper waste disposal.",
            status: "Cleaned",
            votes: 2,
            voters: [],
            photo: ""
        }
    ];

    saveComplaints();
}


// 5. SAVE DATA IN LOCAL STORAGE

function saveComplaints() {

    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify(complaints)
        );
    } catch (error) {
        alert("Storage is full. Try using a smaller photo.");
    }
}


// 6. PREVENT HTML INJECTION

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}


// 7. DISPLAY COMPLAINTS ON STATUS BOARD

function displayComplaints() {

    const reported =
        document.getElementById("reportedList");

    const assigned =
        document.getElementById("assignedList");

    const cleaned =
        document.getElementById("cleanedList");

    reported.innerHTML = "";
    assigned.innerHTML = "";
    cleaned.innerHTML = "";

    complaints.forEach(function(item) {

        const card = `
            <div class="complaint-card">

                <h4>${escapeHTML(item.location)}</h4>

                <p><b>Name:</b> ${escapeHTML(item.name)}</p>

                <p><b>Category:</b> ${escapeHTML(item.category)}</p>

                <p>${escapeHTML(item.description)}</p>

                ${item.photo ?
                    `<img src="${item.photo}"
                    alt="Complaint photo"
                    style="width:100%;max-height:140px;
                    object-fit:cover;border-radius:6px;">`
                    : ""}

                <p>👍 Votes: ${item.votes}</p>

                <button onclick="upvote(${item.id})">
                    Upvote
                </button>

            </div>
        `;

        if (item.status === "Reported") {
            reported.innerHTML += card;
        }

        else if (item.status === "Assigned") {
            assigned.innerHTML += card;
        }

        else if (item.status === "Cleaned") {
            cleaned.innerHTML += card;
        }

    });

    displayWorkerDashboard();
}


// 8. PHOTO PREVIEW

let selectedPhoto = "";

document.getElementById("photo").addEventListener(
    "change",
    function(event) {

        const file = event.target.files[0];

        selectedPhoto = "";

        const preview =
            document.getElementById("photoPreview");

        if (!file) {
            preview.style.display = "none";
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image.");
            event.target.value = "";
            return;
        }

        if (file.size > 1024 * 1024) {
            alert("Please select an image smaller than 1 MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {

            selectedPhoto = e.target.result;

            preview.src = selectedPhoto;
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
);


// 9. SUBMIT COMPLAINT

document.getElementById("complaintForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("userName").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const category =
            document.getElementById("category").value;

        const description =
            document.getElementById("description").value.trim();

        if (!name || !location || !category || !description) {
            alert("Please fill all required fields.");
            return;
        }

        const newComplaint = {

            id: Date.now(),

            name: name,

            location: location,

            category: category,

            description: description,

            status: "Reported",

            votes: 0,

            voters: [],

            photo: selectedPhoto

        };

        complaints.unshift(newComplaint);

        saveComplaints();

        displayComplaints();

        document.getElementById("message").textContent =
            "Complaint submitted successfully!";

        document.getElementById("complaintForm").reset();

        document.getElementById("photoPreview").style.display =
            "none";

        selectedPhoto = "";

        document.getElementById("status").scrollIntoView({
            behavior: "smooth"
        });

    });


// 10. COMMUNITY UPVOTING

function upvote(id) {

    const complaint = complaints.find(function(item) {
        return item.id === id;
    });

    if (!complaint) return;

    if (!complaint.voters) {
        complaint.voters = [];
    }

    const voterId = "demo-resident";

    if (complaint.voters.includes(voterId)) {

        alert("You have already voted for this complaint.");

        return;
    }

    complaint.votes++;

    complaint.voters.push(voterId);

    saveComplaints();

    displayComplaints();

    alert("Thank you for supporting a clean community!");
}


// 11. WORKER DASHBOARD

function displayWorkerDashboard() {

    const workerList =
        document.getElementById("workerList");

    workerList.innerHTML = "";

    complaints.forEach(function(item) {

        let buttons = "";

        if (item.status === "Reported") {

            buttons = `
                <button onclick="updateStatus(${item.id}, 'Assigned')">
                    Assign Worker
                </button>
            `;

        } else if (item.status === "Assigned") {

            buttons = `
                <button onclick="updateStatus(${item.id}, 'Cleaned')">
                    Mark Cleaned
                </button>
            `;

        } else {

            buttons = "<p>✓ Work Completed</p>";
        }

        workerList.innerHTML += `

            <div class="complaint-card">

                <h4>${escapeHTML(item.location)}</h4>

                <p><b>Complaint:</b>
                    ${escapeHTML(item.description)}
                </p>

                <p><b>Status:</b> ${item.status}</p>

                ${buttons}

            </div>

        `;

    });
}


// 12. UPDATE COMPLAINT STATUS

function updateStatus(id, newStatus) {

    const complaint = complaints.find(function(item) {
        return item.id === id;
    });

    if (!complaint) return;

    complaint.status = newStatus;

    saveComplaints();

    displayComplaints();

    alert("Complaint status updated to " + newStatus);
}


// 13. WASTE SEGREGATION QUIZ

let ecoPoints = 0;

function checkQuiz(answer) {

    const result =
        document.getElementById("quizResult");

    if (answer === "Green") {

        result.textContent =
            "Correct answer! You earned 10 eco-points.";

        ecoPoints += 10;

    } else {

        result.textContent =
            "Wrong answer! Try again.";

    }

    document.getElementById("ecoPoints").textContent =
        ecoPoints;
}


// 14. LOAD WEBSITE DATA

displayComplaints();
