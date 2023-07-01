import { Tooltip } from 'antd';
import { motion } from 'framer-motion';
import moment from 'moment';

interface MessageProps {
    sender?: boolean;
    message: string;
    updatedAt: string;
    // createdAt: string;
}

const Message = ({ sender, message, updatedAt }: MessageProps) => {
    // re render count
    // const renderCount = React.useRef(0);
    // console.log('Message rendered: ', renderCount.current++);

    return (
        <motion.div
            layout
            className={`max-w-sm flex flex-col ${
                sender ? 'ml-auto' : 'mr-auto'
            }`}
        >
            <Tooltip title={moment(updatedAt).calendar()} placement="leftTop">
                <div
                    className={`relative rounded-md p-4 bubble ${
                        sender
                            ? 'after:!border-l-gray-400 rounded-ee-none right bg-gray-400'
                            : 'bg-blue-400 after:!border-b-blue-400 rounded-es-none left'
                    }`}
                >
                    <p>{message}</p>
                </div>
                <span
                    className={`text-sm text-gray-500 mt-1 ${
                        sender ? 'ml-auto' : 'mr-auto'
                    }`}
                >
                    {moment(updatedAt).fromNow()}
                </span>
            </Tooltip>
        </motion.div>
    );
};

export default Message;
