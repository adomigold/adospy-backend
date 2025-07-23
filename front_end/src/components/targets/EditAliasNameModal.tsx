import { Loader2 } from "lucide-react"
import { Button } from "../common/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/dialog"
import { useForm } from "@inertiajs/inertia-react"
import { Input } from "../common/input";
import { Alert } from "../common/alert";
import { useEffect } from "react";

interface AddTargetModalProps {
    target: any;
    open: boolean;
    onOpenChange: (open: boolean) => void
}

const AliasNameModal: React.FC<AddTargetModalProps> = ({ open, onOpenChange, target }) => {
    const { data, setData, put, processing, errors } = useForm({
        success: '',
        target_id: '',
        name_alias: target.name_alias || '',
    })

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        put('/targets/', {});
    };

    useEffect(() => {
        if (open && Object.keys(target).length > 0) {
            setData({
                success: '',
                target_id: target.id,
                name_alias: target.name_alias || '',
            });
        } else {
            setData({
                success: '',
                target_id: '',
                name_alias: '',
            });
            // clear errors
            errors.success = '';
            errors.name_alias = '';
        }
    }, [open, target]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>Edit Alias Name</DialogTitle>
                </DialogHeader>
                {errors.success && <Alert variant="destructive" className="mb-4 h-12 bg-green-100 text-green-800 py-3"> {errors.success} </Alert>}
                {errors.name_alias && <Alert variant="destructive" className="mb-4 h-12 bg-red-100 text-red-800 py-3"> {errors.name_alias} </Alert>}
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="name_alias" className="block text-sm font-medium text-gray-700 mb-2">
                            Alias Name
                        </label>
                        <Input
                            id="name_alias"
                            name="name_alias"
                            type="text"
                            value={data.name_alias}
                            onChange={(e) => setData('name_alias', e.target.value)}
                            required
                            className="w-full"
                            placeholder="Enter Alias Name"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg font-semibold"
                    >
                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AliasNameModal