import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function EmptyReminderList() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-12 bg-teal-50"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-teal-100 rounded-full p-6 mb-4"
            >
                <Clock className="w-12 h-12 text-teal-500" />
            </motion.div>
            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl font-semibold text-teal-700 mb-2"
            >
                No reminders yet
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-600 text-center max-w-sm"
            >
                Create your first reminder to start tracking your medications.
            </motion.p>
        </motion.div>
    );
}
