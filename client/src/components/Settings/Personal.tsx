import { Avatar, Button, Form, Input, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useUpdateNameMutation } from '../../features/auth/authApi';
import { selectUser } from '../../features/auth/authSlice';
import type { User } from '../../types/Types';

interface ChangeNameProps {
    firstName: string;
    lastName: string;
}

const Personal: React.FC = () => {
    const user = useSelector(selectUser) as User;
    const initialValues = {
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1],
    };

    const [form] = Form.useForm();

    const [editProfile, setEditProfile] = useState<boolean>(false);

    const [
        updateName,
        {
            isLoading: updateNameLoading,
            isSuccess: updateNameSuccess,
            error: updateNameError,
        },
    ] = useUpdateNameMutation();

    useEffect(() => {
        if (updateNameSuccess) {
            setEditProfile(false);
        }
    }, [updateNameSuccess]);

    useEffect(() => {
        if (updateNameError) {
            message.error('Something went wrong');
        }
    }, [updateNameError]);

    const changeName = (values: ChangeNameProps) => {
        // if the user didn't change the name then don't send the request
        if (
            values.firstName === initialValues.firstName &&
            values.lastName === initialValues.lastName
        ) {
            setEditProfile(false);
            return;
        }
        updateName(`${values.firstName} ${values.lastName}`);
    };

    const handleCancel = () => {
        form.resetFields();
        setEditProfile(false);
    };
    return (
        <div className="p-3 shadow rounded flex flex-col gap-4 w-full max-w-md">
            <div className="flex justify-between items-center">
                <Avatar
                    size={64}
                    src={user.picture}
                    shape="circle"
                    style={{
                        border: `1px solid ${user.avatarColor}`,
                        fontSize: '1.5rem',
                        fontStyle: 'bold',
                        backgroundColor: user.avatarColor,
                    }}
                >
                    {user.name.split(' ')[0][0] + user.name.split(' ')[1][0]}
                </Avatar>

                <Button
                    type="primary"
                    size="large"
                    className="!flex items-center gap-2"
                >
                    <AiOutlineCloudUpload className="text-lg" />
                    Upload
                </Button>
            </div>

            <Form
                initialValues={initialValues}
                onFinish={changeName}
                form={form}
            >
                <Form.Item
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: 'Firstname is required',
                        },
                    ]}
                >
                    <Input
                        disabled={!editProfile}
                        placeholder="Firstname"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: 'Lastname is required',
                        },
                    ]}
                >
                    <Input
                        disabled={!editProfile}
                        placeholder="Lastname"
                        size="large"
                    />
                </Form.Item>
                <div className="flex overflow-hidden">
                    <AnimatePresence>
                        {!editProfile && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                key="edit-profile"
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => setEditProfile(true)}
                                >
                                    Edit Profile
                                </Button>
                            </motion.div>
                        )}

                        {editProfile && (
                            <motion.div
                                layout
                                key="save-profile"
                                className="flex gap-4"
                            >
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={updateNameLoading}
                                    >
                                        Save Profile
                                    </Button>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    danger
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Form>
        </div>
    );
};

export default Personal;
