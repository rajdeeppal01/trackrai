import ApplicationCard from "./ApplicationCard";

const applications = [

    {
        company: "Google",
        role: "Software Engineer Intern",
        status: "Applied",
        ats: 91,
        ai: 88,
        stage: "OA",
        date: "July 3"
    },

    {
        company: "Microsoft",
        role: "Software Engineer",
        status: "Interview",
        ats: 95,
        ai: 90,
        stage: "Interview",
        date: "July 1"
    },

    {
        company: "Amazon",
        role: "SDE Intern",
        status: "Applied",
        ats: 84,
        ai: 79,
        stage: "Applied",
        date: "June 28"
    }

];

export default function ApplicationGrid() {

    return (

        <div className="grid gap-6">

            {applications.map((app, index) => (

                <ApplicationCard

                    key={index}

                    application={app}

                />

            ))}

        </div>

    );

}