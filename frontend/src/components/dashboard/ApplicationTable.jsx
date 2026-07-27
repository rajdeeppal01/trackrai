import { format } from 'date-fns';
import StatusBadge from '../ui/StatusBadge';

export default function ApplicationTable({ applications, onEdit }) {
 // Helper to strip HTML tags for a clean note preview
 const getNotePreview = (htmlString) => {
 if (!htmlString) return 'No notes yet...';
 const doc = new DOMParser().parseFromString(htmlString, 'text/html');
 const text = doc.body.textContent || "";
 return text.length > 60 ? text.substring(0, 60) + '...' : text;
 };

 if (applications.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-20 opacity-50">
 <p className="text-white/60 mb-4 text-sm">No applications found in this view.</p>
 </div>
 );
 }

 return (
 <div className="overflow-x-auto bg-black/20 rounded-3xl">
 <table className="w-full text-left text-sm text-white/70">
 <thead className="text-xs text-white/40 uppercase bg-white/5 border-b ">
 <tr>
 <th scope="col" className="px-6 py-4 font-medium tracking-wider">Company & Role</th>
 <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
 <th scope="col" className="px-6 py-4 font-medium tracking-wider">Applied Date</th>
 <th scope="col" className="px-6 py-4 font-medium tracking-wider">War Room Snapshot</th>
 </tr>
 </thead>
 <tbody>
 {applications.map((app) => {
 return (
 <tr 
 key={app.id} 
 onClick={() => onEdit(app)}
 className="border-b hover:bg-white/[0.02] cursor-pointer transition-colors group"
 >
 <td className="px-6 py-4 whitespace-nowrap">
 <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
 {app.company}
 </div>
 <div className="text-xs text-white/50">{app.role}</div>
 </td>
 <td className="px-6 py-4 whitespace-nowrap">
 <StatusBadge status={app.status} />
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-white/50">
 {app.applied_date ? format(new Date(app.applied_date), 'MMM d, yyyy') : '—'}
 </td>
 <td className="px-6 py-4">
 <div className="text-xs text-white/40 max-w-xs truncate italic">
 {getNotePreview(app.notes)}
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 );
}
