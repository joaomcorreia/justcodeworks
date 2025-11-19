#!/usr/bin/env python
"""
Temporarily disable authentication across the JustCodeWorks project
This script will:
1. Disable CSRF and Auth middleware in settings
2. Replace IsAuthenticated with AllowAny in all viewsets
3. Create a backup of original files for easy restoration
"""
import os
import re
from pathlib import Path

def backup_and_replace_auth():
    print("🚫 Temporarily disabling authentication for development...")
    
    # Define the project root
    backend_root = Path("C:/projects/justcodeworks/backend")
    
    # Files to modify
    files_to_modify = [
        backend_root / "sites" / "views.py",
        backend_root / "main_site" / "views.py",
        backend_root / "admin_panel" / "views.py",
        backend_root / "user_dashboard" / "views.py",
        backend_root / "tenant_dashboards" / "views.py",
    ]
    
    # Patterns to replace
    auth_patterns = [
        (r'permission_classes = \[IsAuthenticated\]', 'permission_classes = [AllowAny]  # TEMP: Auth disabled'),
        (r'permission_classes = \[permissions\.IsAuthenticated\]', 'permission_classes = [permissions.AllowAny]  # TEMP: Auth disabled'),
        (r'permission_classes = \[IsAuthenticatedOrReadOnly\]', 'permission_classes = [AllowAny]  # TEMP: Auth disabled'),
        (r'permission_classes = \[permissions\.IsAuthenticatedOrReadOnly\]', 'permission_classes = [permissions.AllowAny]  # TEMP: Auth disabled'),
        (r'@permission_classes\(\[IsAuthenticated\]\)', '@permission_classes([AllowAny])  # TEMP: Auth disabled'),
        (r'return \[IsAuthenticated\(\)\]', 'return [AllowAny()]  # TEMP: Auth disabled'),
    ]
    
    # Process each file
    for file_path in files_to_modify:
        if file_path.exists():
            print(f"📝 Processing {file_path}")
            
            # Create backup
            backup_path = file_path.with_suffix('.py.auth_backup')
            if not backup_path.exists():
                content = file_path.read_text(encoding='utf-8')
                backup_path.write_text(content, encoding='utf-8')
                print(f"💾 Created backup: {backup_path}")
            
            # Read current content
            content = file_path.read_text(encoding='utf-8')
            
            # Apply replacements
            modified = False
            for pattern, replacement in auth_patterns:
                new_content = re.sub(pattern, replacement, content)
                if new_content != content:
                    content = new_content
                    modified = True
            
            # Write back if modified
            if modified:
                file_path.write_text(content, encoding='utf-8')
                print(f"✅ Modified {file_path}")
            else:
                print(f"ℹ️  No changes needed in {file_path}")
        else:
            print(f"⚠️  File not found: {file_path}")
    
    print("\n🎯 Authentication temporarily disabled!")
    print("📋 To restore authentication later, run the restore script or restore from .auth_backup files")

if __name__ == "__main__":
    backup_and_replace_auth()