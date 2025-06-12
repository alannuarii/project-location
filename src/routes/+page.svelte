<script>
  import { onMount } from 'svelte';

  let map;
  let currentPositionMarker;
  let destinationMarker;
  let directionsService;
  let directionsRenderer;

  onMount(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBoD4PeDssRaD0pqRno1HcpssdiYaGmk2s&callback=initMap`;
      script.async = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    }
  });

  function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: { lat: -6.200000, lng: 106.816666 } // Default Jakarta
    });

    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);

          currentPositionMarker = new google.maps.Marker({
            position: pos,
            map: map,
            title: "Posisi Anda",
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
        },
        () => {
          alert("Gagal mendapatkan posisi GPS.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung geolocation.");
    }

    map.addListener('click', (event) => {
      if (destinationMarker) destinationMarker.setMap(null);

      destinationMarker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        title: "Tujuan"
      });

      if (!currentPositionMarker) {
        alert("Posisi Anda belum diketahui.");
        return;
      }

      calculateAndDisplayRoute(currentPositionMarker.getPosition(), destinationMarker.getPosition());
    });
  }

  function calculateAndDisplayRoute(origin, destination) {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          alert('Gagal mendapatkan rute: ' + status);
        }
      }
    );
  }
</script>

<style>
  #map {
    width: 100vw;
    height: 100vh;
  }

  #info {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 10px;
    z-index: 5;
    border-radius: 5px;
    font-family: Arial, sans-serif;
  }
</style>

<div id="info">Klik titik di peta untuk menentukan tujuan dan mendapatkan arah dari posisi Anda saat ini.</div>
<div id="map"></div>
