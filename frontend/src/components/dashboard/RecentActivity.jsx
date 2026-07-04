import Card from "../ui/Card";

const activity = [
  {
    title: "Applied to Google",
    time: "2 hours ago",
  },
  {
    title: "Resume optimized",
    time: "Yesterday",
  },
  {
    title: "Amazon OA scheduled",
    time: "3 days ago",
  },
];

export default function RecentActivity() {
  return (
    <Card className="p-6">

      <h2 className="text-xl font-semibold mb-6">

        Recent Activity

      </h2>

      <div className="space-y-6">

        {activity.map((item, index) => (

          <div
            key={index}
            className="flex gap-4"
          >

            <div className="flex flex-col items-center">

              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>

              {index !== activity.length - 1 && (

                <div className="w-px h-12 bg-gray-300 mt-1"></div>

              )}

            </div>

            <div>

              <p className="font-medium">

                {item.title}

              </p>

              <p className="text-sm text-gray-500">

                {item.time}

              </p>

            </div>

          </div>

        ))}

      </div>

    </Card>
  );
}