const fs = require('fs');
const path = require('path');

const layouts = [
  'dashboard', 'copilot', 'admin', 'analytics', 'applications',
  'ats-matcher', 'cold-email', 'premium', 'resumes', 'settings'
];

layouts.forEach(folder => {
  const layoutPath = path.join(__dirname, 'src', 'app', folder, 'layout.jsx');
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf-8');
    
    // Only wrap if not already wrapped
    if (!content.includes('ProtectedRoute')) {
      // Determine the relative path to components based on folder depth
      // In src/app/folder/layout.jsx, relative path to src/components is ../../components
      content = `import ProtectedRoute from '../../components/auth/ProtectedRoute';\n` + content;
      
      // Replace {children} with <ProtectedRoute>{children}</ProtectedRoute>
      // We know the layout returns <>{children}</> or similar.
      // A safer regex replacement:
      content = content.replace(
        /return\s*<>\s*\{children\}\s*<\/>/g,
        'return <ProtectedRoute>{children}</ProtectedRoute>'
      );
      // In case it returns just {children} or <div>{children}</div>
      if (!content.includes('<ProtectedRoute>')) {
         content = content.replace(
           /(\{children\})/g,
           '<ProtectedRoute>$1</ProtectedRoute>'
         );
      }
      
      fs.writeFileSync(layoutPath, content);
      console.log(`Wrapped ${folder}/layout.jsx`);
    } else {
      console.log(`Skipped ${folder}/layout.jsx (already wrapped)`);
    }
  } else {
    console.log(`Not found: ${folder}/layout.jsx`);
  }
});
