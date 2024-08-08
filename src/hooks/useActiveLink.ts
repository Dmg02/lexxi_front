import { usePathname } from "next/navigation"

type ReturnType = {
    active: boolean
    isExternalLink: boolean
}

export default function useActiveLink(path: string): ReturnType {
    const pathname = usePathname()

    const normalActive = path ? pathname === path || pathname.startsWith(path) : false;

    return {
        active: normalActive,
        isExternalLink: path.startsWith('http'),
    }
}
