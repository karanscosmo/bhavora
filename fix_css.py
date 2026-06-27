import os

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
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace `<div ref={mapContainer} className="absolute inset-0" />`
    content = content.replace(
        '<div ref={mapContainer} className="absolute inset-0" />',
        '<div ref={mapContainer} className="absolute inset-0" style={{ width: \'100%\', height: \'100%\', minHeight: \'400px\' }} />'
    )
    
    # decision-twin etc might have different classNames
    content = content.replace(
        '<div ref={mapContainer} className="w-full h-full" />',
        '<div ref={mapContainer} className="w-full h-full" style={{ width: \'100%\', height: \'100%\', minHeight: \'400px\' }} />'
    )

    with open(f, 'w') as file:
        file.write(content)
