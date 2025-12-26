/**
 * File: pages/auth/RegisterPage.tsx
 * 
 * Halaman Register untuk pendaftaran user baru NMS
 * 
 * Fungsi:
 * - Form registrasi user baru
 * - Validasi input user
 * - Password confirmation
 * - Handle registration process
 * - Redirect ke login setelah registrasi berhasil
 * 
 * Fitur:
 * - Form validation
 * - Password strength indicator
 * - Terms and conditions checkbox
 * - Link ke halaman login
 * - Loading state saat registrasi
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Alert, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import CustomButton from '../../components/common/CustomButton'

const { Title, Text } = Typography

export default function RegisterPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)

        try {
            // TODO: Implement registration API call
            console.log('Registration data:', values)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Redirect to login after successful registration
            navigate('/login')
        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <Title level={2} className="!mb-2 text-gray-900">
                        Create Account
                    </Title>
                    <Text className="text-gray-600">
                        Join NMS ZTE OLT System
                    </Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        className="mb-4"
                        closable
                        onClose={() => setError(null)}
                    />
                )}

                <Form
                    form={form}
                    name="register"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Full Name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                            },
                        ]}
                    >
                        <Checkbox>
                            I agree to the <a href="#">Terms and Conditions</a>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <CustomButton
                            type="primary"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                            onClick={() => form.submit()}
                        >
                            Register
                        </CustomButton>
                    </Form.Item>

                    <div className="text-center">
                        <Text className="text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-800">
                                Sign in
                            </a>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
