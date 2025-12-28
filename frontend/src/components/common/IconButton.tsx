/** AUTO-DOC: src/components/common/IconButton.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'
import { Button } from 'antd'
import type { ButtonProps } from 'antd'

interface Props extends ButtonProps {
  icon?: React.ReactNode
}

export default function IconButton({ icon, children, ...rest }: Props) {
  return (
    <Button {...rest} icon={icon}>
      {children}
    </Button>
  )
}

