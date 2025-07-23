import { Link } from "@inertiajs/inertia-react"
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"

const Dashboard = () => {
    return (
        <AuthenticatedLayout>
            <div>
                <h1 className="text-3xl text-red-500">Dashboard</h1>
                <Link href="/">Home</Link>
            </div>
        </AuthenticatedLayout>
    )
}

export default Dashboard