import { Avatar, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useSendMessageMutation } from '../../features/chat/chatApi';
import {
    selectCurrentRecipient,
    selectIsModalOpen,
    setCurrentRecipient,
    setIsModalOpen,
} from '../../features/chat/chatSlice';

const { TextArea } = Input;

const MessageModal: React.FC = () => {
    const isModalOpen = useAppSelector(selectIsModalOpen);
    const currentRecipient = useAppSelector(selectCurrentRecipient);

    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('');

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handleCancel = () => {
        dispatch(setIsModalOpen(false));
    };

    const [sendMessage, { isSuccess, data }] = useSendMessageMutation();

    const handleOk = () => {
        sendMessage({
            message: value.trim(),
            receiverEmail: currentRecipient?.email,
        });
    };

    useEffect(() => {
        if (isSuccess && data?.conversation) {
            setIsLoading(false);
            dispatch(setCurrentRecipient(null));
            dispatch(setIsModalOpen(false));
            navigate(`/t/${data.conversation._id}`);
            setValue('');
        }
    }, [isSuccess, data]);

    return (
        <>
            <Modal
                title="New Message"
                open={isModalOpen}
                onCancel={handleCancel}
                okText="Send"
                onOk={handleOk}
                confirmLoading={isLoading}
            >
                <div className="flex items-center gap-2 mb-2">
                    <Avatar
                        size={48}
                        src={currentRecipient?.picture}
                        style={{ backgroundColor: '#87d068' }}
                    >
                        {currentRecipient?.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="text-lg font-semibold">
                        {currentRecipient?.name}
                    </span>
                </div>

                <TextArea
                    rows={4}
                    style={{ height: 120, resize: 'none' }}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </Modal>
        </>
    );
};

export default MessageModal;
