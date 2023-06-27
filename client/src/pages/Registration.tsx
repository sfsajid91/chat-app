import { Alert, Button, Col, Form, Input, Row } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsGoogle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../features/auth/authApi';

interface RegistrationProps {
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export default function Registration() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

    const navigate = useNavigate();

    const onfinish = (values: RegistrationProps) => {
        const credentials = {
            name: values.firstName + ' ' + values.lastName,
            email: values.email,
            password: values.password,
        };

        register(credentials);
    };

    useEffect(() => {
        if (isSuccess) {
            navigate('/login');
        }
    }, [isSuccess]);

    const navigateToGoogle = () => {
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/auth/google/callback`;
    };

    return (
        <div className="overflow-x-hidden overflow-y-auto">
            <Helmet>
                <title>Registration | Chat App</title>
            </Helmet>
            <nav className="px-8 py-2 w-full sticky top-0 border-b bg-white bg-opacity-40 backdrop-blur-sm">
                <div className="w-96">
                    <img
                        src="/icon.png"
                        className="h-14 object-cover"
                        alt="logo"
                    />
                </div>
            </nav>
            <div className="flex justify-center items-center min-h-screen mx-4 py-8">
                <div className="space-y-7 max-w-sm">
                    <h3 className="leading-tight font-black text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 from-20% to-green-500 to-80%">
                        Hang out anytime, anywhere
                    </h3>
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert
                                        message={
                                            error.status === 500
                                                ? 'Internal server error'
                                                : error?.data?.message
                                        }
                                        type="error"
                                        showIcon
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Form onFinish={onfinish}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="firstName"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please enter your firstname',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter your firstname"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="lastName"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please enter your lastname',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter your lastname"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Col xs={24} md={12}> */}
                            <Form.Item
                                name="email"
                                hasFeedback
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Please enter an valid email',
                                    },
                                    {
                                        required: true,
                                        message: 'Please enter your email',
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter your email"
                                    size="large"
                                />
                            </Form.Item>
                            {/* </Col> */}

                            {/* <Col xs={24} md={12}> */}
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your password',
                                    },
                                    {
                                        min: 8,
                                        message:
                                            'Password must be at least 8 characters',
                                    },
                                    {
                                        max: 20,
                                        message:
                                            'Password must be at most 20 characters',
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Enter your password"
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    size="large"
                                />
                            </Form.Item>
                            {/* </Col> */}

                            {/* <Col xs={24} md={12}> */}
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please enter your password again',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue('password') ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    'Passwords should be same'
                                                )
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder="Confirm password"
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    size="large"
                                />
                            </Form.Item>
                            {/* </Col> */}

                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={isLoading}
                                    block
                                >
                                    SignUp
                                </Button>
                            </Form.Item>
                        </Form>
                        <p className="text-gray-400 mx-auto -mt-6">or</p>
                        <Button
                            // type="primary"
                            onClick={navigateToGoogle}
                            icon={<BsGoogle className="text-red-400" />}
                            size="large"
                            block
                            className="!flex !items-center justify-center space-x-2"
                        >
                            Continue with Google
                        </Button>
                        <div className="flex justify-between">
                            <span className="text-gray-400">
                                Already have an account?
                            </span>
                            <Link to="/login" className="text-blue-500">
                                Login
                            </Link>
                        </div>
                        {/* forgot password? */}
                        {/* <h3 className="text-blue-500">Forgot password?</h3> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
