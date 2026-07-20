import os
import re

def check_imports(src_dir):
    files_map = {}
    # Build a map of lowercase path -> actual case path
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            full_path = os.path.join(root, file).replace('\\', '/')
            files_map[full_path.lower()] = full_path

    import_regex = re.compile(r'(?:import|from)\s+[\'"](.*?)[\'"]')
    
    errors_found = False
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if not file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css')):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            for match in import_regex.finditer(content):
                import_path = match.group(1)
                
                # Only check relative imports
                if not import_path.startswith('.'):
                    continue
                
                # Resolve the absolute path
                dir_path = os.path.dirname(filepath)
                resolved_base = os.path.normpath(os.path.join(dir_path, import_path)).replace('\\', '/')
                
                # Try to find the file with various extensions if not provided
                possible_paths = [resolved_base]
                if not os.path.splitext(resolved_base)[1]:
                    possible_paths.extend([f"{resolved_base}.js", f"{resolved_base}.jsx", f"{resolved_base}/index.js", f"{resolved_base}/index.jsx"])
                
                found = False
                for p in possible_paths:
                    if os.path.exists(p):
                        found = True
                        break
                        
                if not found:
                    # It doesn't exist directly. Let's see if it exists with different casing
                    lower_base = resolved_base.lower()
                    possible_lower_paths = [lower_base]
                    if not os.path.splitext(lower_base)[1]:
                        possible_lower_paths.extend([f"{lower_base}.js", f"{lower_base}.jsx", f"{lower_base}/index.js", f"{lower_base}/index.jsx"])
                    
                    for p_lower in possible_lower_paths:
                        if p_lower in files_map:
                            actual_case = files_map[p_lower]
                            print(f"CASE MISMATCH in {filepath}: imported '{import_path}', but actual file is '{actual_case}'")
                            errors_found = True
                            found = True
                            break
                            
                if not found:
                    pass # Could be alias or something else, but we only care about case mismatch

    if not errors_found:
        print("No case sensitivity mismatches found!")

if __name__ == "__main__":
    check_imports("c:/Users/rajde/OneDrive/Desktop/projects/trackrai/frontend/src")
