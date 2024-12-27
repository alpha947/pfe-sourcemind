// appB/src/main/resources/static/js/status.js

document.addEventListener("DOMContentLoaded", function() {
    const statusIndicator = document.getElementById('status-indicator');
    const alertAudio = document.getElementById('alert-audio');

    // Initialiser le WebSocket
    const socket = new SockJS('/status-websocket');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/power-status', function(message) {
            const status = message.body;
            console.log('Received: ' + status);
            updateStatus(status);
        });
    }, function(error) {
        console.error('WebSocket error:', error);
        updateStatus('INACCESSIBLE');
    });

    function updateStatus(status) {
        switch(status) {
            case 'POWER_ON':
                setStatus('green', 'Courant Allumé');
                stopAlert();
                break;
            case 'POWER_OFF':
                setStatus('red', 'Coupure de Courant');
                playAlert();
                break;
            case 'INACCESSIBLE':
                setStatus('orange', 'Vérifier le capteur, il est inaccessible');
                stopAlert();
                break;
            default:
                setStatus('gray', 'Statut Inconnu');
                stopAlert();
                break;
        }
    }

    function setStatus(color, message) {
        statusIndicator.style.backgroundColor = color;
        statusIndicator.textContent = message;
        statusIndicator.className = `status-indicator ${color}`;
    }

    function playAlert() {
        alertAudio.volume = 1.0; // Volume maximal
        alertAudio.play().catch(error => {
            console.error('Erreur lors de la lecture du son:', error);
        });
    }

    function stopAlert() {
        alertAudio.pause();
        alertAudio.currentTime = 0;
    }
});
