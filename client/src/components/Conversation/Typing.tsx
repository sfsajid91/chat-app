import { motion } from 'framer-motion';
import React from 'react';

const Typing: React.FC = () => {
    return (
        <>
            <motion.div
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                layout
                className="max-w-[5.8rem] bg-blue-400 rounded-full"
            >
                <span className="typing" />
            </motion.div>
        </>
    );
};

export default Typing;
