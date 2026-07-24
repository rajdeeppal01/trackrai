import re
with open(r'c:\Users\rajde\OneDrive\Desktop\projects\trackrai\frontend\src\pages\Landing.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Revert useEffect
old_effect = """    // Force dark mode for the landing page
    const root = document.documentElement
    const originalTheme = root.getAttribute('data-theme')
    root.setAttribute('data-theme', 'dark')
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (originalTheme) root.setAttribute('data-theme', originalTheme)
    }"""
new_effect = """    return () => window.removeEventListener("mousemove", handleMouseMove)"""
text = text.replace(old_effect, new_effect)

# Replace white with slate-50
text = re.sub(r'text-white', 'text-slate-50', text)
text = re.sub(r'bg-white', 'bg-slate-50', text)
text = re.sub(r'border-white', 'border-slate-50', text)

with open(r'c:\Users\rajde\OneDrive\Desktop\projects\trackrai\frontend\src\pages\Landing.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done!")
