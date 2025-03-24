import { Download, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
function InstallationPage() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="w-full border-b bg-background/95 py-4">
                <div className="container flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Shield className="h-8 w-8 text-teal-600" />
                        <span className="text-2xl font-bold text-teal-600">Community HealthCare</span>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="w-full py-12 bg-gradient-to-b from-teal-50 to-white text-center">
                    <div className="container px-4 max-w-4xl mx-auto">
                        <Shield className="h-16 w-16 text-teal-600 mx-auto" />
                        <h1 className="text-3xl font-bold text-teal-800">Download Our Healthcare App</h1>
                        <p className="text-gray-600 max-w-[600px] mx-auto">
                            A free community healthcare app to help you manage your health, get medicine reminders, and
                            book appointments at your barangay health center.
                        </p>
                        <div className="inline-flex items-center bg-teal-50 px-3 py-1 text-sm text-teal-800 my-4 rounded">
                            <Shield className="mr-2 h-4 w-4" />
                            Free community service - Not for commercial use
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleInstallClick}
                                className={`px-6 py-3 text-white font-bold rounded-lg ${
                                    deferredPrompt ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                disabled={!deferredPrompt}
                            >
                                <Download className="inline-block mr-2 h-5 w-5" />
                                {deferredPrompt ? 'Install Now' : 'Not Available'}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full border-t bg-teal-50 py-4 text-center">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Community HealthCare App. A free service for the community.
                </p>
            </footer>
        </div>
    );
}

export default InstallationPage;
