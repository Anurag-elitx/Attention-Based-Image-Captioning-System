import sys
import os

# Ensure backend directory is in sys.path so 'app' imports resolve regardless of cwd
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure project root is in sys.path so 'ml' imports resolve
project_root = os.path.dirname(backend_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)
