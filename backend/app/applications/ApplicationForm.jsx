import { useForm } from "react-hook-form";
import StatusSelect from "./StatusSelect";

export default function ApplicationForm({ onSubmit }) {
  const { register, handleSubmit } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <input
        {...register("company")}
        placeholder="Company"
        className="w-full rounded-xl border p-3"
      />

      <input
        {...register("role")}
        placeholder="Role"
        className="w-full rounded-xl border p-3"
      />

      <StatusSelect
        {...register("status")}
      />

      <input
        type="date"
        {...register("applied_date")}
        className="w-full rounded-xl border p-3"
      />

      <input
        {...register("link")}
        placeholder="Job Link"
        className="w-full rounded-xl border p-3"
      />

      <textarea
        {...register("notes")}
        placeholder="Notes"
        rows={4}
        className="w-full rounded-xl border p-3"
      />

      <button
        className="w-full rounded-xl bg-blue-600 py-3 text-white"
      >
        Save Application
      </button>
    </form>
  );
}