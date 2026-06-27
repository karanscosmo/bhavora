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
    with open(f, 'r') as file:
        content = file.read()
    
    # We want to find the useEffect that has `map.current = new mapboxgl.Map`
    
    # We will replace:
    #   useEffect(() => {
    #     if (!mapContainer.current) return;
    # 
    #     map.current = new mapboxgl.Map({
    #
    # With:
    #   useEffect(() => {
    #     if (!mapContainer.current) return;
    #     let isActive = true;
    #     import('mapbox-gl').then(m => {
    #       if (!isActive) return;
    #       const mapboxgl = m.default;
    #       mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    #       map.current = new mapboxgl.Map({
    
    content = re.sub(
        r"useEffect\(\(\) => \{\s*if \(\!mapContainer\.current\) return;\s*map\.current = new mapboxgl\.Map\(\{",
        r"useEffect(() => {\n    if (!mapContainer.current) return;\n    let isActive = true;\n    import('mapbox-gl').then(m => {\n      if (!isActive) return;\n      const mapboxgl = m.default;\n      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';\n\n      map.current = new mapboxgl.Map({",
        content
    )
    
    # And we replace the end of the useEffect:
    #     return () => map.current?.remove();
    #   }, []);
    #
    # With:
    #     });
    #     return () => {
    #       isActive = false;
    #       map.current?.remove();
    #     };
    #   }, []);
    
    content = re.sub(
        r"    return \(\) => map\.current\?\.remove\(\);\s*\}, \[\]\);",
        r"    });\n\n    return () => {\n      isActive = false;\n      map.current?.remove();\n    };\n  }, []);",
        content
    )
    
    with open(f, 'w') as file:
        file.write(content)
    print(f"Fixed {f}")
