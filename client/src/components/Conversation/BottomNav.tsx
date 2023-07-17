import type { InputRef } from 'antd';
import { Button, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import { socket, useSendMessageMutation } from '../../features/chat/chatApi';

interface BottomNavProps {
    receiver: string;
    conversationId: string;
}

const BottomNav = ({ receiver, conversationId }: BottomNavProps) => {
    const [form] = Form.useForm();
    const message = Form.useWatch('message', form);
    const inputRef = useRef<InputRef>(null);

    const [isTyping, setIsTyping] = useState(false);

    // debounce typing event when user is typing set isTyping to true after typing stops for 1 second set isTyping to false
    useEffect(() => {
        if (!isTyping && message) {
            setIsTyping(true);
        }

        if (!message) {
            setIsTyping(false);
        }

        const timeout = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
        return () => {
            clearTimeout(timeout);
        };
    }, [message]);

    useEffect(() => {
        socket.emit('typing', isTyping, conversationId);
    }, [isTyping]);

    const [sendMessage, { isLoading, data: sentMessage }] =
        useSendMessageMutation();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus({
                cursor: 'end',
            });
        }
    }, [sentMessage]);

    const handleSendMessage = (values: { message: string }) => {
        form.resetFields();
        if (!values.message) return;
        if (!receiver) return;
        if (values.message.trim().length <= 0) return;
        const data = {
            message: values.message.trim(),
            receiverEmail: receiver,
        };
        sendMessage(data);
    };

    // if the key press is enter then submit the form if shift + enter or ctrl + enter then add a new line
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault();
        }

        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && message) {
            form.submit();
        }
    };

    return (
        <>
            <nav className="px-4 py-2 border bg-white z-20 overflow-none h-fit">
                <Form
                    form={form}
                    className="w-full flex items-center h-full"
                    onFinish={handleSendMessage}
                >
                    <Form.Item name="message" className="!py-0 !my-0 !w-full">
                        <Input.TextArea
                            size="large"
                            className="!w-full !border-blue-500"
                            style={{ borderRadius: '10px', resize: 'none' }}
                            placeholder="Aa"
                            rows={1}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                            autoSize={{ minRows: 1, maxRows: 4 }}
                        />
                    </Form.Item>

                    <Form.Item className="!py-0 !my-0">
                        <Button
                            type="ghost"
                            htmlType="submit"
                            style={{ borderRadius: '999px' }}
                            disabled={isLoading}
                        >
                            <IoSendSharp className="text-2xl text-blue-500" />
                        </Button>
                    </Form.Item>
                </Form>
            </nav>
        </>
    );
};

export default BottomNav;
