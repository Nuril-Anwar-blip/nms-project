/**
 * File: pages/auth/LoginPage.tsx
 * 
 * Halaman Login untuk autentikasi user ke NMS
 * 
 * Fungsi:
 * - Form login dengan username dan password
 * - Validasi input user
 * - Handle login process
 * - Redirect ke dashboard setelah login berhasil
 * - Error handling untuk login gagal
 * 
 * Fitur:
 * - Remember me checkbox
 * - Forgot password link
 * - Link ke halaman register
 * - Loading state saat login
 * 
 * Backend Integration:
 * - Menggunakan useAuth hook untuk login
 * - Token JWT disimpan di localStorage
 * - User data disimpan untuk session
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Alert, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks'
import CustomButton from '../../components/common/CustomButton'

const { Title, Text } = Typography

export default function LoginPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)

        try {
            const success = await login(values.username, values.password)
            if (success) {
                navigate('/dashboard')
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <Title level={2} className="!mb-2 text-gray-900">
                        NMS ZTE OLT
                    </Title>
                    <Text className="text-gray-600">
                        Network Management System
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
                    name="login"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                >
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
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <CustomButton
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            Sign In
                        </CustomButton>
                    </Form.Item>

                    <div className="text-center">
                        <Text className="text-gray-600">
                            Don't have an account?{' '}
                            <a href="/register" className="text-blue-600 hover:text-blue-800">
                                Sign up
                            </a>
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
