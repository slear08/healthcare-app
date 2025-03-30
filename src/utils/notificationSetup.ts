export async function setupNotifications() {
    try {
        // Check if notifications are supported
        if (!('Notification' in window)) {
            return;
        }

        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            return;
        }

        // Check if push notifications are supported
        if (!('PushManager' in window)) {
            return;
        }

        // Register service worker first
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Handle notification permission
        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey:
                    'BInk419lZ2jkHZYxcqdAByTYfQqykKb3f98UUzcRsad9V-xIO8fpa9xtVz4og8vk9vX_SknH46U1t0oI0WenyYc',
            });

            // Convert subscription to JSON format
            const subscriptionJSON = subscription.toJSON();

            if (!subscriptionJSON || !subscriptionJSON.endpoint) {
                throw new Error('Invalid subscription data');
            }

            // Send subscription to server with the correct format
            const response = await fetch('https://healthcare-server-pa9l.onrender.com/api/notifications/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription: subscriptionJSON }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }

            await response.json();
        } else {
            console.log('Notification permission denied or not granted');
        }
    } catch (error) {
        console.error('Error setting up notifications:', error);
    }
}
