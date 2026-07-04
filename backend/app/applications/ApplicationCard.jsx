import { motion } from "framer-motion";
import {
    Building2,
    MapPin,
    Calendar,
    FileText,
    Sparkles
} from "lucide-react";

export default function ApplicationCard({ application }) {

    const stages = [
        "Applied",
        "OA",
        "Interview",
        "HR",
        "Offer"
    ];

    const completed = stages.indexOf(application.stage) + 1;

    return (

        <motion.div
            whileHover={{
                y: -8,
                scale: 1.01
            }}
            transition={{
                duration: 0.25
            }}
            className="
            rounded-3xl
            border
            border-gray-200
            bg-white/70
            backdrop-blur-xl
            p-6
            shadow-sm
            hover:shadow-2xl
            transition-all
            overflow-hidden
        "
        >

            <div className="flex justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <Building2 size={18} />

                        <h2 className="font-semibold text-xl">

                            {application.company}

                        </h2>

                    </div>

                    <p className="text-gray-500 mt-1">

                        {application.role}

                    </p>

                </div>

                <span className="rounded-full bg-blue-100 px-4 py-1 text-blue-700 text-sm">

                    {application.status}

                </span>

            </div>

            <div className="grid grid-cols-3 mt-8 gap-6">

                <Metric
                    title="ATS Score"
                    value={`${application.ats}%`}
                />

                <Metric
                    title="AI Match"
                    value={`${application.ai}%`}
                />

                <Metric
                    title="Updated"
                    value="Yesterday"
                />

            </div>

            <div className="mt-8">

                <div className="flex justify-between text-sm">

                    <span>Pipeline</span>

                    <span>

                        {completed}/5

                    </span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">

                    <motion.div

                        initial={{ width: 0 }}

                        animate={{
                            width: `${completed * 20}%`
                        }}

                        transition={{
                            duration: 0.8
                        }}

                        className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-violet-600
                    "

                    />

                </div>

            </div>

            <div className="mt-8 space-y-3 text-sm">

                <Info icon={<FileText size={16} />}>

                    Resume_v5.pdf

                </Info>

                <Info icon={<MapPin size={16} />}>

                    Bangalore

                </Info>

                <Info icon={<Calendar size={16} />}>

                    {application.date}

                </Info>

            </div>

            <div className="flex justify-between mt-8">

                {stages.map((stage, index) => (

                    <Stage

                        key={stage}

                        done={index < completed}

                        title={stage}

                    />

                ))}

            </div>

            <div className="
            mt-8
            rounded-2xl
            bg-gradient-to-r
            from-violet-50
            to-blue-50
            p-4
        ">

                <div className="flex gap-2 items-center">

                    <Sparkles
                        size={18}
                        className="text-violet-600"
                    />

                    <p className="font-medium">

                        AI Suggestion

                    </p>

                </div>

                <p className="text-sm text-gray-600 mt-2">

                    Your resume is a strong match. Following up
                    in 3 days could improve your response rate.

                </p>

            </div>

        </motion.div>

    );

}

function Metric({ title, value }) {

    return (

        <div>

            <p className="text-xs uppercase text-gray-400">

                {title}

            </p>

            <p className="font-semibold text-lg mt-1">

                {value}

            </p>

        </div>

    );

}

function Info({ icon, children }) {

    return (

        <div className="flex gap-3 items-center text-gray-600">

            {icon}

            {children}

        </div>

    );

}

function Stage({ done, title }) {

    return (

        <div className="flex flex-col items-center">

            <div
                className={`
                w-5
                h-5
                rounded-full
                ${
                    done
                        ? "bg-green-500"
                        : "bg-gray-300"
                }
            `}
            />

            <p className="text-xs mt-2">

                {title}

            </p>

        </div>

    );

}