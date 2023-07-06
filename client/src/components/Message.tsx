import { Tooltip } from 'antd';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useEffect } from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { useSeenMessageMutation } from '../features/chat/chatApi';
import { Message } from '../types/Types';

interface MessageProps {
    sender?: boolean;
    messageObj: Message;
}

const Message = ({ sender, messageObj }: MessageProps) => {
    // re render count
    // const renderCount = React.useRef(0);
    // console.log('Message rendered: ', renderCount.current++);
    const { message, seen, updatedAt, _id } = messageObj;

    const [seenMessage] = useSeenMessageMutation();

    useEffect(() => {
        let timer = 1;

        if (!seen && !sender) {
            timer = setTimeout(() => {
                seenMessage(_id);
            }, 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [seen, sender]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`max-w-sm min-w-[6rem] flex flex-col ${
                sender ? 'ml-auto' : 'mr-auto'
            }`}
        >
            <Tooltip
                title={moment(updatedAt).format('MMM D, h:mm a')}
                placement="leftTop"
            >
                <div
                    className={`relative rounded-md p-2 bubble ${
                        sender
                            ? 'after:!border-l-gray-400 rounded-ee-none right bg-gray-400'
                            : 'bg-blue-400 after:!border-b-blue-400 rounded-es-none left'
                    }`}
                >
                    <p className="px-2 text-gray-800">{message}</p>
                    <div
                        className={`flex justify-start items-center pt-0.4 px-1 gap-4 ${
                            sender ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                        {sender && (
                            <BsCheck2All
                                className={
                                    seen ? 'text-blue-600' : 'text-gray-600'
                                }
                            />
                        )}
                        <span className={`text-xs text-gray-200`}>
                            {moment(updatedAt).format('h:mm A')}
                        </span>
                    </div>
                </div>
            </Tooltip>
        </motion.div>
    );
};

export default Message;
