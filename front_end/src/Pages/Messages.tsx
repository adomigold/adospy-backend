import { useEffect, useState, useRef } from "react";
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"
import { Button } from "../components/common/button";
import { RotateCw } from "lucide-react";
import { useForm } from "@inertiajs/inertia-react";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent } from "../components/common/card";
import { Input } from "../components/common/input";

const Messages = (props: any) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();
    const messageData = props.messages;
    const [messages, setMessages] = useState([]);
    const [reciepients, setReciepients] = useState<any>([]);

    useEffect(() => {
        if (Object.keys(messageData).length > 0) {
            const firstKey = Object.keys(messageData)[0];
            setMessages(messageData[firstKey]);
            setReciepients(Object.keys(messageData));
        }
    }, [messageData]);

    const { get, processing } = useForm({});

    const submit = () => {
        get('/sync/sms/', {
            onSuccess: () => {
                toast({
                    title: "Messages Synced",
                    description: "Your messages have been synced successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to sync messages. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <AuthenticatedLayout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
                        <p className="text-muted-foreground">
                            View your target messages
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => submit()} className="flex items-center text-white  bg-blue-600 hover:bg-blue-700">
                            <RotateCw className={processing ? "animate-spin h-4 w-4" : "h-4 w-4"} />
                            Sync Messages
                        </Button>
                    </div>
                </div>
                <Card className="h-[700px]">
                    <CardContent className="p-0 h-full">
                        <div className="flex h-full">
                            {/* Recipients List */}
                            <div className="w-1/4 p-4 h-full border-r-2 border-gray-300 overflow-y-auto">
                                <div className="w-full flex  items-center justify-between border-b border-gray-300 pb-5 tracking-tight">
                                    <span className="text-xl font-bold">Recipients</span>
                                    <div className="w-50">
                                        <Input
                                            id="currentPassword"
                                            type="current_password"
                                            onChange={(e) => {
                                                const searchQuery = e.target.value;
                                                const filteredReciepients = Object.keys(messageData).filter((reciepient) =>
                                                    reciepient.toLowerCase().includes(searchQuery.toLowerCase())
                                                );
                                                setReciepients(filteredReciepients);
                                            }}
                                            placeholder="Search Recipients"
                                        />
                                    </div>
                                </div>
                                {reciepients.map((reciepient: any) => (
                                    <div
                                        onClick={() => setMessages(messageData[reciepient])}
                                        key={reciepient}
                                        className={`flex items-center px-2 py-4 border-b border-gray-300 last:border-0 cursor-pointer ${messages === messageData[reciepient] ? "bg-blue-300" : ""}`}
                                    >
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                            {reciepient.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">{reciepient}</p>
                                            <p className="text-xs mt-1 text-gray-700">
                                                {messageData[reciepient].length} messages
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Conversation */}
                            <div className="w-3/4 px-8 py-4 h-full overflow-y-auto space-y-4">
                                {messages.map((message: any) =>
                                    message.message_type === "INBOX" ? (
                                        <div key={message.id} className="flex justify-start">
                                            <div className="bg-gray-300 text-gray-900 px-4 py-2 rounded-2xl max-w-xs">
                                                {message.message}
                                                <p className="text-xs font-medium mt-1 text-gray-800 pt-5 float-right">
                                                    {new Date(message.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={message.id} className="flex justify-end">
                                            <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-xs">
                                                {message.message}
                                                <p className="text-xs font-medium mt-1 text-white pt-5 float-right">
                                                    {new Date(message.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                                <div ref={bottomRef}></div> 
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AuthenticatedLayout>
    )
}

export default Messages