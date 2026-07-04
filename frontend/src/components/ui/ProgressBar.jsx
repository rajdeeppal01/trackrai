export default function ProgressBar({ value }) {
  return (
    <div className="mt-3">

      <div className="flex justify-between text-xs text-gray-500 mb-1">

        <span>Progress</span>

        <span>{value}%</span>

      </div>

      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-indigo-500
            to-violet-600
            transition-all
            duration-700
          "
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}