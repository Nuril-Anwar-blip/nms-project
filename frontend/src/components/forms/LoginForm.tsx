/** AUTO-DOC: src/components/forms/LoginForm.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/forms/LoginForm.tsx
 * 
 * Komponen LoginForm untuk digunakan di berbagai halaman
 * 
 * Fungsi:
 * - Form login yang reusable
 * - Validasi input
 * - Error handling
 * - Loading state
 * 
 * Props:
 * - onSubmit: (values: LoginFormValues) => void
 * - loading: boolean
 * - error: string | null
 */

import { Form, Input, Button, Checkbox, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import CustomButton from '../common/CustomButton'

interface LoginFormValues {
    username: string
    password: string
    remember?: boolean
}

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => void
    loading?: boolean
    error?: string | null
    showRememberMe?: boolean
    showForgotPassword?: boolean
}

export default function LoginForm({
    onSubmit,
    loading = false,
    error = null,
    showRememberMe = true,
    showForgotPassword = true
}: LoginFormProps) {
    return (
        <Form
            name="login"
            onFinish={onSubmit}
            layout="vertical"
            size="large"
        >
            {error && (
                <Alert
                    message={error}
                    type="error"
                    className="mb-4"
                    closable
                />
            )}

            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Username"
                    autoComplete="username"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    autoComplete="current-password"
                />
            </Form.Item>

            {showRememberMe && (
                <Form.Item>
                    <div className="flex items-center justify-between">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        {showForgotPassword && (
                            <a href="#" className="text-blue-600 hover:text-blue-800">
                                Forgot password?
                            </a>
                        )}
                    </div>
                </Form.Item>
            )}

            <Form.Item>
                <CustomButton
                    type="primary"
                    loading={loading}
                    disabled={loading}
                    className="w-full"
                    onClick={() => {
                        const formElement = document.querySelector('form[name="login"]') as HTMLFormElement
                        if (formElement) {
                            formElement.requestSubmit()
                        }
                    }}
                >
                    Sign In
                </CustomButton>
            </Form.Item>
        </Form>
    )
}
