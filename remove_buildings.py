import os
import re

files = [
    "apps/web/src/app/(dashboard)/cities/page.tsx",
    "apps/web/src/app/(dashboard)/disaster/page.tsx",
    "apps/web/src/app/(dashboard)/decision-twin/page.tsx",
    "apps/web/src/app/(dashboard)/impact/page.tsx",
    "apps/web/src/app/(dashboard)/analytics/page.tsx",
    "apps/web/src/app/(dashboard)/reports/page.tsx",
    "apps/web/src/app/(dashboard)/simulation-results/page.tsx"
]

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r') as file:
        content = file.read()
    
    # regex to remove the 3d-buildings layer addition
    pattern = r"\s*//\s*3D Buildings Layer\s*map\.current\.addLayer\(\{[\s\S]*?'id':\s*'3d-buildings'[\s\S]*?\}\);"
    content = re.sub(pattern, "", content)
    
    # also wrap map.current.on('load', ...) internals in a try catch to prevent silent rendering crashes
    # we can inject a try block at the start of map.current.on('load', () => {
    # but since it might be complex, let's just do a simple replacement for now.
    
    with open(f, 'w') as file:
        file.write(content)
        
print("Removed 3d buildings layer")
