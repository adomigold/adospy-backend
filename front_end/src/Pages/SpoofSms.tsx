import { useForm } from "@inertiajs/inertia-react";
import { Card, CardContent } from "../components/common/card"
import { Input } from "../components/common/input"
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"
import { Loader2 } from "lucide-react";
import { Button } from "../components/common/button";
import { useToast } from "../hooks/use-toast";

const SpoofSms = () => {
    const { toast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        message: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/spoof-sms/', {
            onSuccess: () => {
                toast({
                    title: "Message Sent",
                    description: "Your message has been sent successfully.",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div className="flex w-1/2 flex-col border-b border-gray-400 pb-5 lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Spoof SMS</h2>
                        <p className="text-muted-foreground">
                            Send a message to a specific number from the target phone.
                        </p>
                    </div>
                </div>
                <Card className="w-1/2">
                    <CardContent>
                        <form onSubmit={submit} className="p-4 w-1/2">
                            <div className="mb-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                    className="w-full"
                                    placeholder="Phone Number to send to"
                                />
                                <p className="text-sm text-red-500 mt-2"><b>IMPORTANT:</b> This is <span className="underline">NOT</span> the target number, but the number you want to send SMS to.</p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea name="message" id="message" cols={30} rows={10} value={data.message} onChange={(e) => setData('message', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg font-semibold"
                            >
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send SMS
                            </Button>
                        </form>
                        <div className="p-4 bg-red-100 rounded-md text-red-600">
                            <p className="text-sm text-red-500 mt-2"><b>CAUTION:</b> On some devices, the message may be appeared in the <span className="underline">INBOX</span>. Also no guarantee that the message will be sent successfully.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}

export default SpoofSms