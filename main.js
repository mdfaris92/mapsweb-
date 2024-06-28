// main.js

function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        zoom: 14,
        mapId: 'YOUR_MAP_ID' // Optional: Use a custom map style
    });

    const webGLOverlayView = new google.maps.WebGLOverlayView();

    webGLOverlayView.onAdd = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        webGLOverlayView.onDraw = ({ gl, transformer }) => {
            const latLngAltitude = {
                lat: 37.7749,
                lng: -122.4194,
                altitude: 100
            };

            const matrix = transformer.fromLatLngAltitude(latLngAltitude);
            camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
            renderer.render(scene, camera);
        };
    };

    webGLOverlayView.setMap(map);
}

window.initMap = initMap;