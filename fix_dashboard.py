import re

with open('src/components/views/DashboardView.tsx', 'r') as f:
    content = f.read()

# Add useLanguage import
if 'useLanguage' not in content:
    content = content.replace("import { Assistant, UserProfile } from '../../types';", "import { Assistant, UserProfile } from '../../types';\nimport { useLanguage } from '../../contexts/LanguageContext';")

# Add hook
if 'const { t } = useLanguage();' not in content:
    content = re.sub(r'(export const DashboardView: React\.FC<DashboardViewProps> = \(\{[^\}]+\}\) => \{)', r'\1\n  const { t } = useLanguage();', content)

# Remove old `{isId ? 'id' : 'en'}` manually written previously
# Example: `{isId ? 'Selamat datang,' : 'Good day,'}`
content = re.sub(r'\{isId\s*\?\s*\'Selamat datang,\'\s*:\s*\'Good day,\'\}', r'{t(\'dash.welcome\')},', content)
content = re.sub(r'\{isId\s*\?[^\}]+: [^\}]+\}', 't(\'dash.subtitle\')', content, count=1) # The subtitle

# Let's replace line by line for safety based on what was added before.
# We will use simple regexes.
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Create Assistant\'\}', r'{t(\'dash.createAssistant\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'TEST LAB\'\}', r'{t(\'dash.testLab\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Employees\'\}', r'{t(\'dash.employees\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Autonomous Agents\'\}', r'{t(\'dash.autonomousAgents\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Skills\'\}', r'{t(\'dash.activeSkills\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Active Blueprints\'\}', r'{t(\'dash.activeBlueprints\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Memories\'\}', r'{t(\'dash.memories\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Indexed Knowledge\'\}', r'{t(\'dash.indexedKnowledge\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Routines\'\}', r'{t(\'dash.routines\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Cron Schedules\'\}', r'{t(\'dash.cronSchedules\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Tools\'\}', r'{t(\'dash.tools\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'MCP & Web Connected\'\}', r'{t(\'dash.mcpConnected\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Benchmark\'\}', r'{t(\'dash.benchmark\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'AI Employees Gallery\'\}', r'{t(\'dash.gallery\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Autonomous assistants equipped with proprietary knowledge, skills, and governance\.\'\}', r'{t(\'dash.galleryDesc\')}', content)

content = re.sub(r'isId\s*\?\s*`[^\`]+`\s*:\s*`View All \(\$\{assistants\.length\}\)`', r'`${t(\'dash.viewAll\')} (${assistants.length})`', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'Studio Execution Log\'\}', r'{t(\'dash.log\')}', content)
content = re.sub(r'\{isId\s*\?\s*\'[^\']+\'\s*:\s*\'LIVE ACTIVITY STREAM\'\}', r'{t(\'dash.liveStream\')}', content)


with open('src/components/views/DashboardView.tsx', 'w') as f:
    f.write(content)
