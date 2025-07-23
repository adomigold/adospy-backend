import { Loader2 } from "lucide-react"
import { Button } from "../common/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../common/dialog"
import { useForm } from "@inertiajs/inertia-react"
import { useEffect, useState } from "react"

interface AddTargetModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const AddTargetModal: React.FC<AddTargetModalProps> = ({ open, onOpenChange }) => {
    const features = [
        "Call Logs",
        "Call Recording",
        "Key Logs",
        "App Screenshots",
        "Photos",
        "Videos",
        "Audio",
        "Recording/Ambient Sounds",
        "Wallpaper",
        "Locations",
        "Remcam",
        "Contacts",
        "SMS",
        "Spoof SMS",
        "Networks",
        "App Usage",
        "Installed Apps",
        "Web Activity",
        "Browser History",
        "Browser Videos",
        "Wifi Logs",
        "Bluetooth Logs",
        "Calendars",
        "Popups Alerts",
    ];
    const [plan, setPlan] = useState('');

    const { data, setData, post, processing } = useForm({
        plan_type: '',
    });

    const handleSubmit = (plan: string) => {
        setPlan(plan);
        setData('plan_type', plan);
    }

    useEffect(() => {
        if (plan) {
            post('/targets/', {});
        }
    }, [plan])
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                        Select a plan to add a new device
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Monthly Plan",
                            price: "$19.99/month",
                            plan: "monthly"
                        },
                        {
                            title: "Annual Plan",
                            price: "$215.89/year (10% discount)",
                            plan: "annual"
                        },
                    ].map((plan, index) => (
                        <div key={index} className="p-4 border rounded-2xl shadow-sm max-h-[600px] overflow-y-auto">
                            <h3 className="text-xl font-semibold">{plan.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{plan.price}</p>
                            <Button onClick={() => handleSubmit(plan.plan)} className="mb-4 bg-blue-600 text-white hover:bg-blue-700" variant="default">
                                {processing && data.plan_type === plan.plan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
                                Select Plan
                            </Button>

                            <div>
                                <h4 className="text-sm font-bold mb-2">Included Features:</h4>
                                <ul className="list-disc pl-4 text-sm space-y-1">
                                    {features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddTargetModal