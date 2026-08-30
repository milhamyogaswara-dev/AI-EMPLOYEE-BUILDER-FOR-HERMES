import os
import glob

views = glob.glob('src/components/views/*.tsx')
for view in views:
    with open(view, 'r') as f:
        content = f.read()
    
    if 'isId?: boolean;' not in content:
        # find interface *Props {
        import re
        content = re.sub(r'(interface \w+Props \{)', r'\1\n  isId?: boolean;', content)
        
        # update component signature
        # React.FC<Props> = ({ ... })
        content = re.sub(r'(React\.FC<\w+Props> = \(\{\n?)', r'\1  isId,\n', content)
        
        with open(view, 'w') as f:
            f.write(content)
