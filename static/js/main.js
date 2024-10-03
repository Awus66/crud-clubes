document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-club-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clubID = event.target.getAttribute('club-id');
            deleteClub(clubID);
        });
    });
});


async function deleteClub(id) {
    const confirmed = confirm('Are you sure you want to delete this club?');
    if (!confirmed) {
    return;
    }

    try {
        const response = await fetch(`${window.location.origin}/clubs/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Club deleted successfully');
            window.location.reload();
        } else {
            alert('Error deleting club');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the club');
    }
}
