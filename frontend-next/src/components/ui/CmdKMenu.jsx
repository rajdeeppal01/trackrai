import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, LayoutDashboard, Mail, FileText, Settings, Rocket } from 'lucide-react';
import './CmdKMenu.css';

export default function CmdKMenu() {
 const [open, setOpen] = useState(false);
 const router = useRouter();
 const { isAuthenticated } = useAuth();

 // Toggle the menu when ⌘K or Ctrl+K is pressed
 useEffect(() => {
 const down = (e) => {
 if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
 e.preventDefault();
 setOpen((open) => !open);
 }
 };

 document.addEventListener('keydown', down);
 return () => document.removeEventListener('keydown', down);
 }, []);

 const runCommand = (command) => {
 setOpen(false);
 command();
 };

 if (!isAuthenticated) return null; // Only show on dashboard/logged in pages

 return (
 <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu" className="cmdk-dialog">
 <div className="cmdk-search-wrapper">
 <Search className="cmdk-search-icon" size={18} />
 <Command.Input placeholder="Type a command or search..." className="cmdk-input" />
 </div>
 <Command.List className="cmdk-list">
 <Command.Empty className="cmdk-empty">No results found.</Command.Empty>

 <Command.Group heading="Job Hunt Actions">
 <Command.Item onSelect={() => runCommand(() => window.dispatchEvent(new CustomEvent('open-new-application')))}>
 <Plus size={14} />
 <span>Add New Application</span>
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push('/cold-email'))}>
 <Mail size={14} />
 <span>Draft Cold Email</span>
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push('/copilot'))}>
 <Rocket size={14} />
 <span>AI Copilot War Room</span>
 </Command.Item>
 </Command.Group>

 <Command.Group heading="Navigation">
 <Command.Item onSelect={() => runCommand(() => router.push('/'))}>
 <LayoutDashboard size={14} />
 <span>Dashboard</span>
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push('/resources/resume-guide'))}>
 <FileText size={14} />
 <span>Resume Guides</span>
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => navigate('/settings'))}>
 <Settings size={14} />
 <span>Settings</span>
 </Command.Item>
 </Command.Group>
 </Command.List>
 </Command.Dialog>
 );
}
