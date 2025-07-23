import { Card, CardHeader, CardTitle, CardContent } from '../components/common/card';
import { Link } from "@inertiajs/inertia-react";

const VerifyEmail = (props: any) => {
    const address = import.meta.env.VITE_APP_URL
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
            {/* Left side - Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-52">
                    <div className="flex items-center space-x-3 mb-8">
                        <img src={`${address}/static/public/logo_white.png`} alt="Logo" className="w-12 h-12" />
                        <span className="text-4xl font-bold">Adospy</span>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Parental Control Portal
                    </h2>
                    <p className="text-xl text-center mb-8 text-blue-100">
                        Keep your child's digital world safe and balanced.
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl font-bold mb-1">24/7</div>
                            <div className="text-blue-100">Device Monitoring</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <div className="text-2xl font-bold mb-1">500+</div>
                            <div className="text-blue-100">Active Users</div>
                        </div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Card className="border-2 border-white bg-white/70 backdrop-blur-sm shadow-xl">
                        <CardHeader className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-4 lg:hidden">
                                <img src={`${address}/static/public/logo_blue.png`} className="w-12 h-12" alt="" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Adospy
                                </span>
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Email Verification
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="w-full">
                                {
                                    props.errors.fail &&
                                    <div className="mb-4 font-medium text-sm text-red-600">
                                        <div className="mb-8 text-md text-gray-600">
                                            You're email verification failed. Maybe the link is broken or link has expired.
                                            For more information, please contact us at <a href="tel:+255692536972" className="text-blue-600 hover:underline">+255 692 536 972</a>.
                                        </div>
                                    </div>
                                }

                                {
                                    props.errors.success &&
                                    <div className="mb-4 font-medium text-sm text-red-600">
                                        <div className="mb-8 text-md text-gray-600">
                                            You're email verification successful.
                                            For more information, please contact us at <a href="tel:+255692536972" className="text-blue-600 hover:underline">+255 692 536 972</a>.
                                        </div>
                                        <Link
                                            href="/signin"
                                            className="text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Login to your account
                                        </Link>
                                    </div>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail