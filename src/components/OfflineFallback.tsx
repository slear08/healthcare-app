import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const OfflineFallback = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-full max-w-md bg-white">
                    <CardHeader className="text-center pb-2">
                        <motion.div
                            className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <WifiOff className="w-8 h-8 text-red-500" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">You're Offline</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">Please check your internet connection and try again.</p>
                        <motion.div
                            className="text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Some features may be limited while you're offline.
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
