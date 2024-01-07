async function fetchActors(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`/actors?page=${page}&page_size=${pageSize}`);
        const result = await response.json();
        const actors = result.actors;
        const totalPages = result.total_pages;

        const actorsList = document.getElementById('actorsList');
        actorsList.innerHTML = '';

        actors.forEach(actor => {
            const li = document.createElement('li');
            li.innerHTML = `${actor.first_name} | ${actor.last_name} | ${actor.last_update}`;

            const updateBtn = document.createElement('button');
            updateBtn.innerHTML = 'Update';
            updateBtn.onclick = () => updateActor(actor.actor_id, actor.first_name, actor.last_name, actor.last_update);
            li.appendChild(updateBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Delete';
            deleteBtn.onclick = () => deleteActor(actor.actor_id);
            li.appendChild(deleteBtn);

            actorsList.appendChild(li);
        });

        generatePaginationButtons(page, totalPages, pageSize);
    } catch (error) {
        console.error('Error fetching actors:', error);
    }
}

function generatePaginationButtons(currentPage, totalPages, pageSize) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerHTML = i;
        button.onclick = () => fetchActors(i, pageSize);

        if (i === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }
}



fetchActors();


// Function to create a new actor
async function createActor() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const lastUpdate = document.getElementById('lastUpdate').value;
    const dateObj = new Date(lastUpdate);
    const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                last_update: formattedDate
            })
        });

        if (response.ok) {
            fetchActors();
        } else {
            console.error('Failed to create actor:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating actor:', error);
    }
}

// Function to update an actor
async function updateActor(actorId, currentFirstName, currentLastName, currentLastUpdate) {
    const newFirstName = prompt('Enter new first name:', currentFirstName);
    const newLastName = prompt('Enter new last name:', currentLastName);
    const newLastUpdate = prompt('Enter new last update:', currentLastUpdate);
     const dateObj = new Date(newLastUpdate);
     const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const response = await fetch(`/update/${actorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: newFirstName,
                last_name: newLastName,
                last_update: formattedDate
            })
        });

        if (response.ok) {
            fetchActors();
        } else {
            console.error('Failed to update actor:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating actor:', error);
    }
}


// Function to delete an actor
async function deleteActor(actorId) {
    try {
        const response = await fetch(`/delete/${actorId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchActors();
        } else {
            console.error('Failed to delete actor:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting actor:', error);
    }
}

// Fetch actors when the page loads
window.onload = fetchActors(1, 10);
