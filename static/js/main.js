document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-club-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clubID = event.target.getAttribute('club-id');
            deleteClub(clubID);
        });
    });
});

window.addEventListener('load', loadGoogleMapsScript);


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


function createMap() {
    const geocoder = new google.maps.Geocoder();
    const mapElement = document.querySelector('#map');
    const address = mapElement.getAttribute('data-address');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status === 'OK') {
        const map = new google.maps.Map(mapElement, {
          zoom: 15,
          center: results[0].geometry.location
        });

        const marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode could not complete the request for the following reasons: ' + status);
      }
    });
  }


function loadGoogleMapsScript() {
    const mapExists = document.querySelector('#map');
    if (!mapExists) {
        return;
    }
  
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB1ts7GIALiMN_BKhkHgZQ8mRvnVrcar6k&callback=createMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
