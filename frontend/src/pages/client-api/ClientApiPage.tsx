/** AUTO-DOC: src/pages/client-api/ClientApiPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/client-api/ClientApiPage.tsx
 * 
 * Halaman Client API untuk dokumentasi dan testing API
 * 
 * Fungsi:
 * - Menampilkan dokumentasi API endpoints
 * - Interactive API testing
 * - API key management
 * - Usage examples
 * - Response format documentation
 * 
 * Fitur:
 * - API endpoint list dengan method dan parameters
 * - Interactive testing interface
 * - Code examples in multiple languages
 * - API key generation dan management
 * - Rate limiting information
 */

import { useState } from 'react'
import { Card, Tabs, Button, Input, Typography, Table, Tag, Alert } from 'antd'
import {
    ApiOutlined,
    CopyOutlined,
    PlayCircleOutlined,
    KeyOutlined
} from '@ant-design/icons'
import CustomTable from '../../components/ui/CustomTable'
import CustomButton from '../../components/common/CustomButton'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

export default function ClientApiPage() {
    const [activeTab, setActiveTab] = useState('endpoints')
    const [apiKey, setApiKey] = useState('demo-api-key-12345')

    const endpoints = [
        {
            method: 'GET',
            path: '/api/olts',
            description: 'Get all OLT devices',
            parameters: 'None',
            example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://nms.example.com/api/olts'
        },
        {
            method: 'POST',
            path: '/api/onus',
            description: 'Provision new ONU',
            parameters: 'olt_id, serial_number, pon_port, onu_id',
            example: 'curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d \'{"olt_id": 1, "serial_number": "ZTE12345678", "pon_port": 1, "onu_id": 1}\' https://nms.example.com/api/onus'
        },
        {
            method: 'GET',
            path: '/api/alarms',
            description: 'Get active alarms',
            parameters: 'severity, status, limit, offset',
            example: 'curl -H "Authorization: Bearer YOUR_API_KEY" "https://nms.example.com/api/alarms?severity=critical&limit=10"'
        }
    ]

    const columns = [
        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: 80,
            render: (method: string) => {
                const colorMap: Record<string, string> = {
                    'GET': 'blue',
                    'POST': 'green',
                    'PUT': 'orange',
                    'DELETE': 'red'
                }
                return <Tag color={colorMap[method]}>{method}</Tag>
            }
        },
        {
            title: 'Endpoint',
            dataIndex: 'path',
            key: 'path',
            render: (path: string) => <code className="bg-gray-100 px-2 py-1 rounded">{path}</code>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <CustomButton
                    size="small"
                    onClick={() => console.log('Test endpoint:', record)}
                >
                    Test
                </CustomButton>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Title level={2} className="!mb-2">
                            <ApiOutlined className="mr-2" />
                            Client API
                        </Title>
                        <Text className="text-gray-600">
                            RESTful API documentation and testing tools
                        </Text>
                    </div>
                    <div className="flex items-center space-x-2">
                        <KeyOutlined className="text-gray-400" />
                        <Input
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ width: 200 }}
                            placeholder="API Key"
                        />
                        <CustomButton
                            icon={<CopyOutlined />}
                            onClick={() => navigator.clipboard.writeText(apiKey)}
                        >
                            Copy
                        </CustomButton>
                    </div>
                </div>

                <Alert
                    message="API Usage"
                    description="All API requests must include an Authorization header with a valid API key. Rate limits apply: 1000 requests per hour."
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Endpoints" key="endpoints">
                        <div className="space-y-4">
                            <Paragraph>
                                Below are the available API endpoints for the NMS system.
                            </Paragraph>
                            <CustomTable
                                columns={columns}
                                dataSource={endpoints}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    </TabPane>

                    <TabPane tab="Authentication" key="auth">
                        <div className="space-y-4">
                            <Title level={4}>API Authentication</Title>
                            <Paragraph>
                                All API requests must be authenticated using a Bearer token in the Authorization header:
                            </Paragraph>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <code>Authorization: Bearer YOUR_API_KEY</code>
                            </div>

                            <Title level={4}>Getting an API Key</Title>
                            <Paragraph>
                                Contact your system administrator to get an API key. Each key is associated with specific permissions and rate limits.
                            </Paragraph>
                        </div>
                    </TabPane>

                    <TabPane tab="Examples" key="examples">
                        <div className="space-y-6">
                            {endpoints.map((endpoint, index) => (
                                <Card key={index} size="small" className="bg-gray-50">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Tag color={endpoint.method === 'GET' ? 'blue' : endpoint.method === 'POST' ? 'green' : 'orange'}>
                                                {endpoint.method}
                                            </Tag>
                                            <code className="bg-white px-2 py-1 rounded">{endpoint.path}</code>
                                        </div>
                                        <Text className="text-gray-600">{endpoint.description}</Text>
                                        <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                                            {endpoint.example}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabPane>

                    <TabPane tab="Testing" key="testing">
                        <div className="space-y-4">
                            <Title level={4}>API Testing Tool</Title>
                            <Paragraph>
                                Use this tool to test API endpoints directly from your browser.
                            </Paragraph>

                            <Alert
                                message="Coming Soon"
                                description="Interactive API testing tool will be available in the next version."
                                type="info"
                                showIcon
                            />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    )
}
