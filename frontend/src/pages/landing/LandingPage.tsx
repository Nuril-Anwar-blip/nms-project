/** AUTO-DOC: src/pages/landing/LandingPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/landing/LandingPage.tsx
 * 
 * Halaman Landing Page untuk NMS ZTE OLT
 * 
 * Fungsi:
 * - Halaman utama sebelum login
 * - Menampilkan informasi tentang sistem
 * - Link ke halaman login
 * - Responsive design
 * 
 * Fitur:
 * - Hero section dengan judul dan deskripsi
 * - Feature highlights
 * - Call-to-action buttons
 * - Footer dengan informasi
 */

import { useNavigate } from 'react-router-dom'
import { Button, Typography, Card, Row, Col } from 'antd'
import {
    ApiOutlined,
    WifiOutlined,
    AlertOutlined,
    BarChartOutlined
} from '@ant-design/icons'
import CustomButton from '../../components/common/CustomButton'
import SplitText from '../../components/animations/SplitText'

const { Title, Text, Paragraph } = Typography

export default function LandingPage() {
    const navigate = useNavigate()

    const features = [
        {
            icon: <ApiOutlined className="text-4xl text-blue-600" />,
            title: 'OLT Management',
            description: 'Monitor and manage ZTE OLT devices efficiently'
        },
        {
            icon: <WifiOutlined className="text-4xl text-green-600" />,
            title: 'ONU Provisioning',
            description: 'Easy ONU provisioning and configuration'
        },
        {
            icon: <AlertOutlined className="text-4xl text-red-600" />,
            title: 'Alarm Monitoring',
            description: 'Real-time alarm monitoring and notification'
        },
        {
            icon: <BarChartOutlined className="text-4xl text-purple-600" />,
            title: 'Performance Analytics',
            description: 'Advanced analytics and reporting tools'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <Title level={1} className="!text-5xl !font-bold text-gray-900 mb-4">
                        <SplitText text="NMS ZTE OLT" delay={0.2} className="block" />
                    </Title>
                    <Title level={3} className="!text-xl text-gray-600 !font-normal mb-8">
                        <SplitText text="Network Management System for ZTE OLT Devices" delay={0.4} className="block" />
                    </Title>
                    <div className="space-x-4">
                        <CustomButton
                            type="primary"
                            size="large"
                            onClick={() => navigate('/login')}
                        >
                            Get Started
                        </CustomButton>
                        <CustomButton
                            size="large"
                            onClick={() => {
                                const element = document.getElementById('features')
                                element?.scrollIntoView({ behavior: 'smooth' })
                            }}
                        >
                            Learn More
                        </CustomButton>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-16">
                    <div className="text-center mb-12">
                        <Title level={2} className="!text-3xl text-gray-900 mb-4">
                            Powerful Features
                        </Title>
                        <Text className="text-lg text-gray-600">
                            Everything you need to manage your fiber optic network
                        </Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card
                                    className="h-full text-center hover:shadow-lg transition-shadow"
                                    bordered={false}
                                >
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <Title level={4} className="!mb-3">
                                        {feature.title}
                                    </Title>
                                    <Paragraph className="text-gray-600">
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* CTA Section */}
                <div className="text-center py-16">
                    <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none">
                        <Title level={2} className="!text-white !mb-4">
                            Ready to Get Started?
                        </Title>
                        <Paragraph className="text-lg text-white/90 mb-8">
                            Join thousands of network operators who trust our NMS solution
                        </Paragraph>
                        <CustomButton
                            type="primary"
                            size="large"
                            onClick={() => navigate('/login')}
                            className="bg-white text-blue-600 hover:bg-gray-50"
                        >
                            Sign In Now
                        </CustomButton>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <Text className="text-gray-400">
                        © 2024 NMS ZTE OLT. All rights reserved.
                    </Text>
                </div>
            </footer>
        </div>
    )
}
