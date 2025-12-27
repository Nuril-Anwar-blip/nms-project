import { Link, useLocation } from 'react-router-dom'

type NavItem = {
    label: string
    href: string
}

interface PillNavProps {
    logo: string
    items: NavItem[]
}

export default function PillNav({ logo, items }: PillNavProps) {
    const { pathname } = useLocation()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-950 border-b border-gray-800">
            <div className="h-full max-w-full flex items-center justify-between px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-6 w-6" />
                    <span className="text-white font-semibold text-sm">
                        NMS ZTE OLT
                    </span>
                </Link>

                {/* Navigation Pills */}
                <nav className="hidden md:flex items-center gap-1">
                    {items.map(item => {
                        const active = pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium
                  transition-colors
                  ${active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                `}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
