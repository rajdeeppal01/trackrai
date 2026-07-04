import ApplicationCard from "./ApplicationCard";

export default function PipelineColumn({ title, items }) {
  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Column header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-500 tracking-widest">
          {title}
        </h2>

        <span className="text-xs text-gray-400">
          {items.length}
        </span>
      </div>

      {/* Drop area */}
      <div
        className="
          min-h-[300px]
          p-2
          rounded-2xl
          bg-white/30
          border
          border-dashed
          border-gray-200
          transition
        "
      >
        <div className="space-y-3">
          {items.map((item) => (
            <ApplicationCard key={item.id} {...item} />
          ))}
        </div>
      </div>

    </div>
  );
}