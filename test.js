function animateMarker() {
    var targetPosition = null;
    var isAnimating = false;
    var animationDuration = 1000; // Duration of the animation in milliseconds
    var curr_pos = new google.maps.LatLng(0, 0); // Initialize with a default position

    function goToPoint() {
        if (!targetPosition || isAnimating) return;

        isAnimating = true;
        var currentPosition = curr_pos;
        var distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, targetPosition);
        var bearing = google.maps.geometry.spherical.computeHeading(currentPosition, targetPosition);

        console.log("Current Position:", currentPosition.toString());
        console.log("Target Position:", targetPosition.lat, targetPosition.lng);

        var startTime = Date.now();
        var endTime = startTime + animationDuration;

        var easingFactor = 0.1;
        var newBearing = bearing;
        map.setHeading(newBearing);
        console.log("New Bearing:", newBearing);
        map.setZoom(20);
        map.setTilt(45);

        var animationInterval = setInterval(function () {
            var elapsed = Date.now() - startTime;
            if (elapsed > animationDuration) {
                clearInterval(animationInterval);
                current_marker.setPosition(targetPosition);
                curr_pos = targetPosition;
                isAnimating = false;
                return;
            }

            var t = elapsed / animationDuration; // Interpolation factor (0 to 1)
            var interpolatedPosition = google.maps.geometry.spherical.interpolate(
                currentPosition,
                targetPosition,
                t
            );
            current_marker.setPosition(interpolatedPosition);
            map.panTo(current_marker.getPosition());

        }, 50); // Adjust interval for smoother animation (e.g., 20ms)
    }

    function updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    targetPosition = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    goToPoint();
                });
        }
    }

    setInterval(updateLocation, 500); // Update location every 500ms
}