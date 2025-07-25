import { RotateCw } from "lucide-react"
import { Button } from "../components/common/button"
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout"
import { useForm } from "@inertiajs/inertia-react";
import { useToast } from "../hooks/use-toast";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/common/card";
import { Input } from "../components/common/input";

const Contacts = (props: any) => {
    const contactsData = props.contacts
    const [contacts, setContacts] = useState([])
    const [contact, setContact] = useState<any>({})

    const { toast } = useToast();
    const { get, processing } = useForm({});

    useEffect(() => {
        if (contactsData.length > 0) {
            setContacts(contactsData)
            setContact(contactsData[0])
        }
    }, [contactsData]);

    const submit = () => {
        get('/sync/contacts/', {
            onSuccess: () => {
                toast({
                    title: "Contacts Synced",
                    description: "Your contacts have been synced successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to sync contacts. Please try again.",
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
                        <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
                        <p className="text-muted-foreground">
                            View target contacts
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => submit()} className="flex items-center text-white  bg-blue-600 hover:bg-blue-700">
                            <RotateCw className={processing ? "animate-spin h-4 w-4" : "h-4 w-4"} />
                            Sync Contacts
                        </Button>
                    </div>
                </div>
                <Card className="h-[700px]">
                    <CardContent className="p-0 h-full">
                        <div className="flex h-full">
                            {/* Recipients List */}
                            <div className="w-1/4 p-4 h-full border-r-2 border-gray-300 overflow-y-auto">
                                <div className="w-full flex  items-center justify-between border-b border-gray-300 pb-5 tracking-tight">
                                    <span className="text-xl font-bold">Contacts</span>
                                    <div className="w-50">
                                        <Input
                                            id="currentPassword"
                                            type="current_password"
                                            onChange={(e) => {
                                                const searchQuery = e.target.value;
                                                const filteredcontacts = contactsData.filter((contact: any) =>
                                                    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                );
                                                setContacts(filteredcontacts);
                                            }}
                                            placeholder="Search Contacts"
                                        />
                                    </div>
                                </div>
                                {contacts?.map((item: any, index: number) => (
                                    <div
                                        onClick={() => setContact(item)}
                                        key={index}
                                        className={`flex items-center px-2 py-4 border-b border-gray-300 last:border-0 cursor-pointer ${item.id === contact.id ? "bg-blue-300" : ""}`}
                                    >
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs mt-1 text-gray-700">
                                                {item.phones[0]?.number}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-3/4 px-8 py-4 h-full overflow-y-auto space-y-4">
                                <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                                            {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <h2 className="text-2xl font-semibold">{contact.name || "Unknown"}</h2>
                                                {contact.is_whatsapp && (
                                                    <img src={`${import.meta.env.VITE_APP_URL}/static/whatsapp.png`} className="h-6 w-6 ml-2" alt="" />
                                                )}
                                            </div>
                                            {contact.groups?.length > 0 && (
                                                <p className="text-sm text-gray-500">Group: {contact.groups[0].name}</p>
                                            )}
                                            {contact.is_google && (
                                                <p className="text-sm text-green-600 font-medium">Synced from Google</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        {contact.phones?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-600">Phone</h3>
                                                <ul className="text-gray-800 text-sm">
                                                    {contact.phones.map((phone: any, idx: number) => (
                                                        <li key={idx}>{phone.number}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {contact.emails?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-600">Email</h3>
                                                <ul className="text-gray-800 text-sm">
                                                    {contact.emails.map((email: any, idx: number) => (
                                                        <li key={idx}>{email.address}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {contact.addresses?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-600">Address</h3>
                                                <ul className="text-gray-800 text-sm">
                                                    {contact.addresses.map((addr: any, idx: number) => (
                                                        <li key={idx}>{addr.street || addr.formattedAddress}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {contact.notes?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-600">Notes</h3>
                                                <p className="text-gray-800 text-sm">{contact.notes[0]}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}

export default Contacts