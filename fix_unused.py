import re
import os

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig = content
    
    # Remove `const isId = lang === 'id';`
    content = re.sub(r'\s*const isId\s*=\s*lang === [\'"]id[\'"];', '', content)
    
    # Remove `lang, ` from `const { lang, t } = useLanguage();`
    content = content.replace("const { lang, t } = useLanguage();", "const { t } = useLanguage();")
    content = content.replace("const { t, lang } = useLanguage();", "const { t } = useLanguage();")
    
    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            clean_file(os.path.join(root, file))

