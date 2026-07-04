import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ApplicationStack({
  applications,
  onDelete,
  onEdit,
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl p-8 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Recent Applications
        </h2>

        <p className="text-gray-500 mt-1">
          Your latest opportunities
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No applications yet.
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{
                scale: 1.01,
              }}
              className="
                rounded-2xl
                border
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 p-3">
                      <Briefcase
                        size={20}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {app.company}
                      </h3>

                      <p className="text-gray-500">
                        {app.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-5 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} />
                      {app.applied_date || "No Date"}
                    </div>

                    <div>
                      Status:
                      <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(app)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-blue-500
                      px-4
                      py-2
                      text-white
                      transition
                      hover:bg-blue-600
                    "
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(app.id)}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-red-500
                      px-4
                      py-2
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}