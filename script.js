const form = document.getElementById("expense-form");
const cardContainer = document.getElementById("card-container");

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();

    const amount = form.amount.value.trim();
    const category = form.category.value;
    const desc = form.desc.value.trim();

    if (!amount || !category || !desc) {
        alert("Please fill all fields!");
        return;
    }

    const data = { amount, category, desc };
    const key = `${amount}-${desc}-${Date.now()}`; // unique key using timestamp

    localStorage.setItem(key, JSON.stringify(data));
    form.reset();
    getDataFromLocalStorage();
}

function getDataFromLocalStorage() {
    const data = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        try {
            const val = JSON.parse(localStorage.getItem(key));
            if (val && val.amount && val.category && val.desc) {
                data.push({ key, val });
            }
        } catch (e) {
            continue; // skip invalid or unrelated data
        }
    }

    if (data.length > 0) {
        cardContainer.innerHTML = "";
        display(data);
    } else {
        cardContainer.innerHTML = "<h3>Add New Expense..</h3>";
    }
}

function display(data) {
    cardContainer.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const header = document.createElement("h2");
        header.textContent = item.val.category;

        const subtitle = document.createElement("h3");
        subtitle.textContent = `₹ ${item.val.amount}`;

        const description = document.createElement("p");
        description.textContent = item.val.desc;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            form.amount.value = item.val.amount;
            form.category.value = item.val.category;
            form.desc.value = item.val.desc;
            localStorage.removeItem(item.key);
            getDataFromLocalStorage();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            localStorage.removeItem(item.key);
            getDataFromLocalStorage();
        };

        card.appendChild(header);
        card.appendChild(subtitle);
        card.appendChild(description);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);

        cardContainer.appendChild(card);
    });
}

getDataFromLocalStorage();
