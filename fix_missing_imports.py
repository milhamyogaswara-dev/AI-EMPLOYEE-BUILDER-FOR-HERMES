def fix_import(file):
    with open(file, 'r') as f:
        content = f.read()
    if 'useLanguage' not in content:
        content = content.replace("import React", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';\n//")
    with open(file, 'w') as f:
        f.write(content)

fix_import('src/components/views/DeployView.tsx')
fix_import('src/components/views/TrainingCenterView.tsx')
