import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useUpdatePasswordMutation } from '../../features/auth/authApi';

interface ChangePasswordProps {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

const ChangePassword: React.FC = () => {
    const [form] = Form.useForm();

    const [updatePassword, { isLoading, isError, isSuccess }] =
        useUpdatePasswordMutation();

    const onfinish = (values: ChangePasswordProps) => {
        form.resetFields();
        const credentials = {
            oldPassword: values.currentPassword,
            newPassword: values.password,
        };

        updatePassword(credentials);
    };

    useEffect(() => {
        if (isSuccess) {
            message.success('Password changed successfully');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            form.setFields([
                {
                    name: 'currentPassword',
                    errors: ['Incorrect password'],
                },
            ]);
        }
    }, [isError]);

    return (
        <div className="p-3 shadow rounded flex flex-col gap-4 w-full max-w-md">
            <h1 className="font-bold text-xl text-gray-600">Change Password</h1>
            <Form onFinish={onfinish} form={form}>
                <Form.Item
                    name="currentPassword"
                    rules={[
                        {
                            min: 8,
                            required: true,
                            message: 'Please enter your current password',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Current password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password',
                        },
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters',
                        },
                        {
                            max: 20,
                            message: 'Password must be at most 20 characters',
                        },
                    ]}
                >
                    <Input.Password placeholder="New password" size="large" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password again',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Passwords should be same')
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Confirm password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        disabled={isLoading}
                        block
                    >
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
