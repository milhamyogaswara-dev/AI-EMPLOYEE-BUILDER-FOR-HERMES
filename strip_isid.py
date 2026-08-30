import os
import glob
import re

files = glob.glob('src/components/views/*.tsx') + ['src/components/Sidebar.tsx', 'src/components/Header.tsx', 'src/App.tsx']
for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r') as f:
        content = f.read()
    
    # Remove isId?: boolean; from interfaces
    content = re.sub(r'\s*isId\?:\s*boolean;', '', content)
    
    # Remove isId, from destructured props
    content = re.sub(r'\s*isId,\n', '\n', content)
    content = re.sub(r'isId,\s*', '', content)
    
    # Remove isId={isId} from component usages
    content = re.sub(r'\s*isId=\{isId\}', '', content)
    
    # Replace any `{isId ? 'Id text' : 'En text'}` or similar with proper translations using regex?
    # Actually, let's just do it step by step manually or with a more robust regex if we have a lot.
    # It's better to rewrite the views properly. Let's just write the changes.
    
    with open(file, 'w') as f:
        f.write(content)
