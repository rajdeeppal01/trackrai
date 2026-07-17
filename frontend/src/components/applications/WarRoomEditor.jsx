import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import './WarRoomEditor.css';
import { Sparkles, Save, Code, List, Heading2 } from 'lucide-react';
import Button from '../ui/Button';

export default function WarRoomEditor({ application, content, onChange }) {
  // Generate dummy AI prep data based on the company/role
  const defaultContent = `
    <h2>Interview War Room: ${application?.company || 'Company'}</h2>
    <p><strong>Role:</strong> ${application?.role || 'Software Engineer'}</p>
    
    <hr />
    
    <h3>🧠 AI Company Intel</h3>
    <ul>
      <li><strong>Recent News:</strong> Raised Series C last month, focusing heavily on AI integrations.</li>
      <li><strong>Core Values:</strong> Speed, Ownership, Customer Obsession.</li>
      <li><strong>Tech Stack (Estimated):</strong> React, TypeScript, Python (FastAPI), AWS.</li>
    </ul>

    <h3>💡 Likely Interview Questions</h3>
    <ol>
      <li>Tell me about a time you had to optimize a slow React component.</li>
      <li>How would you design a scalable notification system?</li>
      <li>What is your experience with CI/CD pipelines?</li>
    </ol>

    <hr />
    
    <h3>📝 Your Notes & Leetcode Prep</h3>
    <p><em>Type your notes here... (try using markdown like *bold* or \`code\`)</em></p>
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || defaultContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  const handleRegenerate = () => {
    const randomUpdate = Math.floor(Math.random() * 100);
    const newContent = `
      <h2>Interview War Room: ${application?.company || 'Company'}</h2>
      <p><strong>Role:</strong> ${application?.role || 'Software Engineer'}</p>
      <hr />
      <h3>🧠 AI Company Intel (Update #${randomUpdate})</h3>
      <p><em>Just in:</em> The CEO announced a major push into Generative AI workflows during yesterday's earnings call. They are actively hiring engineers with LLM experience.</p>
      <ul>
        <li><strong>Culture:</strong> Highly autonomous, fast-paced shipping cycles.</li>
        <li><strong>Tech Stack (Updated):</strong> React, Node.js, Python, LangChain, PostgreSQL.</li>
      </ul>
      <h3>💡 Alternative Interview Questions</h3>
      <ol>
        <li>How do you handle rate-limiting for a third-party API integration?</li>
        <li>Explain the difference between a process and a thread in Node.js.</li>
      </ol>
      <hr />
      <h3>📝 Your Notes & Leetcode Prep</h3>
      <p><em>Type your notes here...</em></p>
    `;
    if (editor) {
      editor.commands.setContent(newContent);
      if (onChange) onChange(newContent);
      toast.success('AI Intel regenerated successfully!');
    }
  };

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || defaultContent, false);
    }
  }, [editor, content, defaultContent]);

  if (!editor) return null;

  return (
    <div className="war-room-container">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="flex gap-2">
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="toolbar-btn">
            <Heading2 size={16} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="toolbar-btn">
            <List size={16} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="toolbar-btn">
            <Code size={16} />
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={handleRegenerate}
            variant="secondary" 
            className="!py-1.5 !px-3 !text-xs" 
            icon={Sparkles}
          >
            Regenerate AI Intel
          </Button>
          <Button 
            type="submit" 
            form="app-form"
            onClick={() => toast.success('Interview notes saved!')}
            variant="primary" 
            className="!py-1.5 !px-3 !text-xs" 
            icon={Save}
          >
            Save Notes
          </Button>
        </div>
      </div>

      {/* Tiptap Editor Content */}
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
