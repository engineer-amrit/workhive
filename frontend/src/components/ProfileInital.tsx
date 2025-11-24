import type { ErrorResponse, ProfileInitialsSchema as ProfileI } from '@app/backend';
import axiosInstance from '@/config/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/useAuth';

const ProfileInital = ({ setStep }: {
    setStep: React.Dispatch<React.SetStateAction<2 | 1>>
}) => {
    const navigate = useNavigate();
    const { fetchUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ProfileI>();
    const onSubmit = async (data: ProfileI) => {
        await axiosInstance.post("/client/initials", data)
            .then(() => {
                fetchUser?.();
                navigate("/");
            })
            .catch((error: ErrorResponse) => {
                if (error.errors) {
                    error.errors.forEach((err) => {
                        const field = err.path.join(".");
                        setError(field as keyof ProfileI, { type: "manual", message: err.message });
                    });
                } else {
                    // fallback error
                    setError("useCase", { type: "manual", message: error?.message || "Something went wrong" });
                }
            });

    };


    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Role */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-sm font-semibold text-gray-800">
                    What's your role?
                </label>
                <select
                    id="role"
                    {...register("role")}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                >
                    <option value="">Select your role</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="marketing">Marketing</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                </select>
                {errors.role && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.role.message}
                    </p>
                )}
            </div>

            {/* Team Size */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="teamSize" className="text-sm font-semibold text-gray-800">
                    Team Size
                </label>
                <select
                    id="teamSize"
                    {...register("teamSize")}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                >
                    <option value="">Select team size</option>
                    <option value="solo">Just me</option>
                    <option value="small">2-10 people</option>
                    <option value="medium">11-50 people</option>
                    <option value="large">51+ people</option>
                </select>
                {errors.teamSize && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.teamSize.message}
                    </p>
                )}
            </div>

            {/* Use Case */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="useCase" className="text-sm font-semibold text-gray-800">
                    Primary Use Case
                </label>
                <select
                    id="useCase"
                    {...register("useCase")}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#667eea] focus:ring-1 focus:ring-[#667eea] w-full bg-white"
                >
                    <option value="">Select use case</option>
                    <option value="personal">Personal projects</option>
                    <option value="team">Team collaboration</option>
                    <option value="documentation">Documentation</option>
                    <option value="project_management">Project management</option>
                    <option value="knowledge_base">Knowledge base</option>
                </select>
                {errors.useCase && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.useCase.message}
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 mt-1 flex-wrap">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 bg-white text-[#667eea] border-2 border-[#667eea] rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors flex-1 sm:flex-auto"
                >
                    Later
                </button>
                <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-br cursor-pointer from-[#667eea] to-[#764ba2] text-white rounded-lg text-sm font-semibold hover:translate-y-[-2px] hover:shadow-lg transition-all flex-1 sm:flex-auto"
                >
                    {isSubmitting ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </form>
    )
}

export default ProfileInital
