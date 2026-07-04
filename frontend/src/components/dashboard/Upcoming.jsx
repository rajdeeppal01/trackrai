import Card from "../ui/Card";
import {
  Calendar,
  Clock,
} from "lucide-react";

const events = [
  {
    company: "Google",
    role: "Technical Interview",
    time: "Tomorrow • 10:00 AM",
  },
  {
    company: "Amazon",
    role: "Online Assessment",
    time: "Friday • 7:00 PM",
  },
];

export default function Upcoming() {
  return (
    <Card className="p-6">

      <h2 className="text-lg font-semibold mb-6">

        Upcoming

      </h2>

      <div className="space-y-4">

        {events.map((event, i) => (

          <div
            key={i}
            className="
              rounded-2xl
              border
              p-4
              hover:border-indigo-300
              transition
            "
          >

            <h3 className="font-medium">

              {event.company}

            </h3>

            <p className="text-sm text-gray-500">

              {event.role}

            </p>

            <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">

              <Calendar size={15} />

              <Clock size={15} />

              {event.time}

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}