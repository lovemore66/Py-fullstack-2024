// Function to fetch all actors and display in the list
async function fetchActors() {
    try {
        const response = await fetch('/actors');
        const actors = await response.json();

        const actorsList = document.getElementById('actorsList');
        actorsList.innerHTML = '';

        actors.forEach(actor => {
            const li = document.createElement('li');
            li.innerHTML = `${actor.first_name} | ${actor.last_name} | ${actor.last_update}`;
            
            // Create buttons for update and delete
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
    } catch (error) {
        console.error('Error fetching actors:', error);
    }
}

// Function to create a new actor
async function createActor() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName
            })
        });

        if (response.ok) {
            fetchActors(); // Refresh the actors list after creating
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

     // Convert the string to a date object
     const dateObj = new Date(newLastUpdate);
     // Format the date in the format MySQL recognizes ('YYYY-MM-DD HH:MM:SS')
     const formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
     console.log(formattedDate);

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
            fetchActors(); // Refresh the actors list after updating
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
            fetchActors(); // Refresh the actors list after deleting
        } else {
            console.error('Failed to delete actor:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting actor:', error);
    }
}

// Fetch actors when the page loads
window.onload = fetchActors;
