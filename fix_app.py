import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add const isId = userProfile.appLanguage === 'ID'; in the App component body
if 'const isId = userProfile.appLanguage === \'ID\';' not in content:
    content = content.replace('const [memories, setMemories] = useState<Memory[]>([]);', 'const [memories, setMemories] = useState<Memory[]>([]);\n  const isId = userProfile.appLanguage === \'ID\';')

# Add isId={isId} to all views that have the prop now
# The views are <DashboardView, <AssistantWorkspaceView, <CreateAssistantWizard, <TrainingCenterView, <SkillsView, <SOPView, <MemoryView, <ToolboxView, <AuthorityView, <AutomationView, <TestLabView, <IntegrationsView, <DeployView, <TemplatesView, <SettingsView
views = ['DashboardView', 'AssistantWorkspaceView', 'CreateAssistantWizard', 'TrainingCenterView', 'SkillsView', 'SOPView', 'MemoryView', 'ToolboxView', 'AuthorityView', 'AutomationView', 'TestLabView', 'IntegrationsView', 'DeployView', 'TemplatesView', 'SettingsView']

for view in views:
    # re.sub with care, find `<ViewName\n` or `<ViewName ` and add `isId={isId}\n`
    content = re.sub(rf'<{view}(\s+)', rf'<{view}\1isId={{isId}}\n\1', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
