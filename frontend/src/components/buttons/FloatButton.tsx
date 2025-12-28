/** AUTO-DOC: src/components/buttons/FloatButton.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

const App: React.FC = () => (
    <>
        <FloatButton icon={<QuestionCircleOutlined />} type="primary" style={{ insetInlineEnd: 24 }} />
        <FloatButton icon={<QuestionCircleOutlined />} type="default" style={{ insetInlineEnd: 94 }} />
    </>
);

export default App;