import os
import re

search_dir = r"c:\Users\rajde\OneDrive\Desktop\projects\trackrai\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Remove Claude-like borders
    new_content = re.sub(r'border border-white/5', '', new_content)
    new_content = re.sub(r'border border-white/10', '', new_content)
    new_content = re.sub(r'border border-white/20', '', new_content)
    new_content = re.sub(r'border-white/5', '', new_content)
    new_content = re.sub(r'border-white/10', '', new_content)
    
    # Update shapes
    new_content = re.sub(r'rounded-md', 'rounded-xl', new_content)
    new_content = re.sub(r'rounded-lg', 'rounded-2xl', new_content)
    new_content = re.sub(r'rounded-xl', 'rounded-3xl', new_content)

    # Clean up double spaces caused by replacement
    new_content = re.sub(r'  +', ' ', new_content)
    
    # Fix class=" " issue if borders were the only class
    new_content = new_content.replace('className=" "', 'className=""')

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(search_dir):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))

print("Done.")
