import type React from "react"
import { Link } from "@inertiajs/inertia-react"

interface IProps {
    user: {
        name: string
    }
}

const Dashboard: React.FC<IProps> = ({ user }) => {
    return (
        <div>
            <h1>Hello {user.name}</h1>
            <Link href="/dashboard">Dashboard</Link>
        </div>
    )
}

export default Dashboard