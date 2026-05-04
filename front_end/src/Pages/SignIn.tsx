import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert } from '../components/common/alert';
import { Button } from '../components/common/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/card';
import { Input } from '../components/common/input';
import { Link, useForm } from "@inertiajs/inertia-react";
import { useState } from 'react';
import { Checkbox } from '../components/common/checkbox';

const SignIn = () => {
    const address = import.meta.env.VITE_APP_URL

    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember_me: false,
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post('/signin/', {});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
            {/* Left side - Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-52">
                    <div className="flex items-center space-x-3 mb-8">
                        <img src={`${address}/static/logo_white.png`} alt="Logo" className="w-12 h-12" />
                        <span className="text-4xl font-bold">Adospy</span>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Command And Control Server
                    </h2>
                </div>

                {/* Background decoration */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8">
                <div className="w-full max-w-md flex flex-row justify-center items-center">
                    <Card className="border-2 border-white bg-white/70 backdrop-blur-sm shadow-xl w-full h-full">
                        <CardHeader className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-4 lg:hidden">
                                <img src={`${address}/static/logo_blue.png`} className="w-12 h-12" alt="" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Adospy
                                </span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Sign In
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Sign in to guide, monitor, and protect.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {errors.username && <Alert variant="destructive" className="mb-4 h-12 bg-red-100 text-red-800 py-3"> {errors.username} </Alert>}
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                        className="w-full"
                                        placeholder="Enter your username"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                            className="w-full pr-10"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox 
                                            id="remember_me" 
                                            checked={data.remember_me} 
                                            onCheckedChange={(checked: boolean) => setData('remember_me', checked)} 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r text-white from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg font-semibold"
                                >
                                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Sign In
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/signup"
                                        className="text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default SignIn