export default function StatusSelect(props) {
 return (
 <select
 {...props}
 className="w-full rounded-3xl border border-gray-300 p-3"
 >
 <option value="Applied">Applied</option>
 <option value="Interview">Interview</option>
 <option value="Offer">Offer</option>
 <option value="Rejected">Rejected</option>
 </select>
 );
}