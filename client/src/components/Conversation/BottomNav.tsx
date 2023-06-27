import { Button, Form, Input } from 'antd';
import { IoSendSharp } from 'react-icons/io5';
import { useSendMessageMutation } from '../../features/chat/chatApi';

interface BottomNavProps {
    receiver: string;
}

const BottomNav = ({ receiver }: BottomNavProps) => {
    const [form] = Form.useForm();

    const [sendMessage, { isLoading }] = useSendMessageMutation();

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
    return (
        <>
            <nav className="w-full px-4 py-2 border-t flex items-center sticky -bottom-2 bg-white z-20">
                <Form
                    form={form}
                    className="w-full flex"
                    onFinish={handleSendMessage}
                >
                    <Form.Item name="message" className="!py-0 !my-0 !w-full">
                        <Input
                            size="large"
                            className="!w-full"
                            style={{ borderRadius: '999px' }}
                            placeholder="Aa"
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
