import { Checkbox } from "@radix-ui/react-checkbox"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "../components/common/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/common/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/common/table"
import { useEffect, useState } from "react"
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"
import AliasNameModal from "../components/targets/EditAliasNameModal"
import { Inertia } from "@inertiajs/inertia"
import { useForm } from "@inertiajs/inertia-react"

const Targets = (props: any) => {
    const targets = props.targets
    const [selectdTargets, setSelectedTargets] = useState<any>([])
    const [aliasOpen, setAliasOpen] = useState(false)
    const [device, setDevice] = useState<any>({})
    const [plan, setPlan] = useState('');

    const { data, setData, post, processing } = useForm({
        plan_type: '',
    });

    const handleSubmit = () => {
        setPlan('monthly');
        setData('plan_type', 'monthly');
    }

    useEffect(() => {
        if (plan === 'monthly') {
            post('/targets/', {});
            setPlan('');
        } else {
            return;
        }
    }, [plan])

    const handleSelectAll = () => {
        if (selectdTargets.length === targets.length) {
            setSelectedTargets([])
        } else {
            setSelectedTargets(targets)
        }
    }

    const handleShowAlias = (device: any) => {
        setDevice(device)
        setAliasOpen(true)
    }

    const handleDelete = (device: any) => {
        window.confirm("Are you sure you want to delete this device? All data and charge history will be lost. No money will be refunded.")
        Inertia.delete(`/targets/${device.id}/`)
    }
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Devices Dashboard</h2>
                        <p className="text-muted-foreground">
                            View and manage your devices
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => handleSubmit()} className="flex items-center text-white  bg-blue-600 hover:bg-blue-700">
                            {processing && data.plan_type === 'monthly' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Device
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{targets?.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {targets.filter((target: any) => target.status === 'active').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nearly Expired Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {targets.filter((target: any) => target.status === 'nearly_expired').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expired Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {targets.filter((target: any) => target.status === 'expired').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Devices ({targets.length})</CardTitle>
                            {selectdTargets.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectdTargets.length} selected
                                    </span>
                                    <Button variant="outline" size="sm">
                                        Bulk Actions
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectdTargets.length === targets.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>License Key</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Alias Name</TableHead>
                                    <TableHead>Plan Type</TableHead>
                                    <TableHead>App Version</TableHead>
                                    <TableHead>Plan Expired</TableHead>
                                    <TableHead>Last Synced</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {targets.map((target: any) => (
                                    <TableRow key={target.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectdTargets.includes(target.id)}
                                                onCheckedChange={() => setSelectedTargets(target.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-blue-600">{target.license_key}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-medium text-${target.status === 'active' ? 'green' : target.status === 'idle' ? 'yellow' : 'red'}-600`}>{target.status || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.name_alias || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.plan_type.toUpperCase() || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.payload_version || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.plan_end || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.last_sync && new Date(target.last_sync).toLocaleString() || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button onClick={() => handleShowAlias(target)} variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleDelete(target)} variant="ghost" size="sm">
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AliasNameModal target={device} open={aliasOpen} onOpenChange={() => setAliasOpen(false)} />
        </AuthenticatedLayout>
    )
}

export default Targets