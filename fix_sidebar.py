import re

with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Add useLanguage import
if 'useLanguage' not in content:
    content = content.replace("import { NavView, Assistant } from '../types';", "import { NavView, Assistant } from '../types';\nimport { useLanguage } from '../contexts/LanguageContext';")

# Add useLanguage hook inside Sidebar
if 'const { t } = useLanguage();' not in content:
    content = content.replace("export const Sidebar: React.FC<SidebarProps> = ({", "export const Sidebar: React.FC<SidebarProps> = ({\n")
    content = re.sub(r'(export const Sidebar: React\.FC<SidebarProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t } = useLanguage();', content)

# Update navItems to use t()
content = content.replace("label: 'Dashboard'", "label: t('nav.dashboard')")
content = content.replace("label: 'My Assistants'", "label: t('nav.assistants')")
content = content.replace("label: 'Training Center'", "label: t('nav.training')")
content = content.replace("label: 'Skills'", "label: t('nav.skills')")
content = content.replace("label: 'SOP Builder'", "label: t('nav.sop')")
content = content.replace("label: 'Memory Store'", "label: t('nav.memory')")
content = content.replace("label: 'Toolbox'", "label: t('nav.toolbox')")
content = content.replace("label: 'Authority Rules'", "label: t('nav.authority')")
content = content.replace("label: 'Automation'", "label: t('nav.automation')")
content = content.replace("label: 'Test Lab'", "label: t('nav.testlab')")
content = content.replace("label: 'Deploy Hermes'", "label: t('nav.deploy')")
content = content.replace("label: 'Templates'", "label: t('nav.templates')")
content = content.replace("label: 'Settings'", "label: t('nav.settings')")

# Other texts
content = content.replace("<span>+ CREATE ASSISTANT</span>", "<span>+ {t('dash.createAssistant').toUpperCase()}</span>")

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
