import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useSignup from "../hooks/useSignup";

const SignUpPage = () => {
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
      });

    //   const queryClient = useQueryClient();

    //   const { mutate:signupMutation, isPending, error } = useMutation({
    //     mutationFn: signup,
    //     onSuccess: () => queryClient.invalidateQueries({
    //       queryKey: ["authUser"]
    //     })
    //   });

      const {isPending, error, signupMutation} = useSignup()

      const handleSignup = (e) => {
        e.preventDefault();
        signupMutation(signupData);
      };
    return <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

            {/*Left Side*/}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                <div className="mb-4 flex items-center justify-start gap-2">
                    <ShipWheelIcon className="w-9 h-9 text-primary"/>
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        SpeakWise
                    </span>
                </div>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error.response.data.message}</span>
                    </div>
                )}

                <div className="w-full">
                    <form onSubmit={handleSignup}>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-semibold">Create an Account</h2>
                                <p className="text-sm opacity-70">
                                    Join SpeakWise and start learning a fascinating new language today!
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Full Name" 
                                        className="input input-bordered w-full"
                                        value={signupData.fullName}
                                        onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="input input-bordered w-full"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        className="input input-bordered w-full"
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                        required
                                    />
                                    <p className="text-xs opacity-70 mt-1">
                                        Password must be at least 6 characters long
                                    </p>    
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-2">
                                        <input type="checkbox" className="checkbox checkbox-sm"/>
                                        <span className="text-xs leading-tight">
                                            I agree to the{" "}
                                            <span className="text-primary hover:underline">terms of service</span> and{" "}
                                            <span className="text-primary hover:underline">privacy policy</span>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button className="btn btn-primary w-full" type="submit">
                                {isPending ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Creating Account...
                                    </>
                                ) : ("Create Account")}
                            </button>

                            <div className="text-center mt-4">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                <div className="max-w-md p-8">
                    {/* Illustration */}
                    <div className="relative aspect-square max-w-sm mx-auto">
                        <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
                    </div>

                    <div className="text-center space-y-3 mt-6">
                        <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                        <p className="opacity-70">
                            Practice conversations, make friends, and improve your language skills together
                        </p>
                    </div>
                </div>
            </div>

        </div>

    </div>
}

export default SignUpPage
