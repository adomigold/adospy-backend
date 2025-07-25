import { RotateCw, PhoneMissed, PhoneOutgoing, PhoneIncoming } from "lucide-react"
import { Button } from "../components/common/button"
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"
import { useForm } from "@inertiajs/inertia-react";
import { useToast } from "../hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "../components/common/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/common/table";
import { useEffect, useState } from "react";

const CallLogs = (props: any) => {
    const callLogsData = props.call_logs;
    const [callLogs, setCallLogs] = useState([]);

    const { toast } = useToast();
    const { get, processing } = useForm({});

    useEffect(() => {
        setCallLogs(callLogsData);
    }, [callLogsData]);

    const submit = () => {
        get('/sync/call_logs/', {
            onSuccess: () => {
                toast({
                    title: "Call Logs Synced",
                    description: "Your call logs have been synced successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to sync call logs. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };
    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Call Logs</h2>
                        <p className="text-muted-foreground">
                            View target call logs
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => submit()} className="flex items-center text-white  bg-blue-600 hover:bg-blue-700">
                            <RotateCw className={processing ? "animate-spin h-4 w-4" : "h-4 w-4"} />
                            Sync Call Logs
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Calls ({callLogs.length})</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Call Type</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>SIM Slot</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {callLogs.map((call: any) => (
                                    <TableRow key={call.id}>
                                        <TableCell>
                                            {
                                                call.call_type === "OUTGOING" ?
                                                    <PhoneOutgoing className="h-4 w-4 text-blue-600" /> :
                                                    call.call_type === "INCOMING" ?
                                                        <PhoneIncoming className="h-4 w-4 text-green-600" /> :
                                                        <PhoneMissed className="h-4 w-4 text-red-600" />
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{call.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{call.number}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{call.sim_slot}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {new Date(call.duration * 1000).toISOString().substr(11, 8)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{new Date(call.created_at).toLocaleString()}</div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}

export default CallLogs;