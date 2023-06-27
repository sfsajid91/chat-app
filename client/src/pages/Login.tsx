import { Alert, Button, Form, Input } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BsGoogle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApi';

interface Values {
    email: string;
    password: string;
}

export default function Login() {
    const [login, { isLoading, error }] = useLoginMutation();

    const onfinish = (values: Values) => {
        login(values);
    };

    const navigateToGoogle = () => {
        window.location.href = `${
            import.meta.env.VITE_API_URL
        }/auth/google/callback`;
    };

    return (
        <div className="overflow-x-hidden">
            <Helmet>
                <title>Login | Chat App</title>
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
            <div className="flex justify-center items-center h-[calc(100vh_-_10rem)] md:min-h-screen mx-4 py-8">
                <div className="space-y-7 max-w-sm">
                    <h3 className="leading-tight font-black text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 from-20% to-green-500 to-80%">
                        Hang out anytime, anywhere
                    </h3>
                    <div className="flex flex-col gap-3">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Alert
                                        message={
                                            error.status === 500
                                                ? 'Internal server error'
                                                : error?.data.message
                                        }
                                        type="error"
                                        showIcon
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Form onFinish={onfinish}>
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
                                    Login
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
                                Don&apos;t have an account?
                            </span>
                            <Link to="/signup" className="text-blue-500">
                                Sign up
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
