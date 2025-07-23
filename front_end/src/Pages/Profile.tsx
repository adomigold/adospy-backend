
import { User, Mail, Lock, Save } from 'lucide-react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Button } from '../components/common/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/card';
import { Input } from '../components/common/input';
import { useToast } from '../hooks/use-toast';
import AuthenticatedLayout from '../components/Layout/AuthenticatedLayout';
import { useForm } from '@inertiajs/inertia-react';

const Profile = (props: any) => {
    const { toast } = useToast();

    const { data, setData, post, processing, errors } = useForm({
        first_name: props.user.first_name,
        last_name: props.user.last_name,
        email: props.user.email,
        password: '',
        confirm_password: '',
        current_password: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/signin/', {
            onSuccess: () => {
                toast({
                    title: "Profile Updated",
                    description: "Your profile has been updated successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to update profile. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                    <User className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Personal Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        placeholder="Enter your last name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <Button
                                    type='submit'
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </CardContent>
                        </Card>
                    </form>

                    {/* Password Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="h-5 w-5" />
                                <span>Update Password</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="current_password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={data.confirm_password}
                                    onChange={(e) => setData('confirm_password', e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !data.current_password || !data.password || !data.confirm_password}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                <Lock className="mr-2 h-4 w-4" />
                                {processing ? 'Updating...' : 'Update Password'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Profile;
