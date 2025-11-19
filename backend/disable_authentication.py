#!/usr/bin/env python
"""
Temporarily disable ALL authentication across the JCW project for development.
This script will:
1. Set all ViewSet permissions to AllowAny
2. Comment out authentication checks in perform_* methods
3. Remove staff/user requirement checks
4. Create a backup before making changes

Run this script to disable auth, then run restore_authentication.py to restore it later.
"""
import os
import shutil
from datetime import datetime

def backup_files():
    """Create backup copies of files we're going to modify"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = f"auth_backup_{timestamp}"
    
    files_to_backup = [
        "sites/views.py",
        "main_site/views.py", 
        "user_dashboard/views.py",
        "tenant_dashboards/views.py",
    ]
    
    print(f"📁 Creating backup directory: {backup_dir}")
    os.makedirs(backup_dir, exist_ok=True)
    
    for file_path in files_to_backup:
        if os.path.exists(file_path):
            backup_path = os.path.join(backup_dir, file_path.replace('/', '_'))
            shutil.copy2(file_path, backup_path)
            print(f"✅ Backed up {file_path} -> {backup_path}")
    
    return backup_dir

def disable_auth_in_file(file_path):
    """Disable authentication in a specific view file"""
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return
    
    print(f"🔧 Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace permission classes with AllowAny
    replacements = [
        # Common permission patterns
        ('permission_classes = [IsAuthenticated]', 'permission_classes = [AllowAny]  # TEMP: Auth disabled'),
        ('permission_classes = [IsAuthenticated,', 'permission_classes = [AllowAny]  # TEMP: Auth disabled, original: [IsAuthenticated,'),
        ('[IsAuthenticated]', '[AllowAny]  # TEMP: Auth disabled'),
        
        # Staff checks in perform methods
        ('if not self.request.user.is_staff:', '# TEMP: Auth disabled - if not self.request.user.is_staff:'),
        ('if not request.user.is_staff:', '# TEMP: Auth disabled - if not request.user.is_staff:'),
        ('if not user.is_staff:', '# TEMP: Auth disabled - if not user.is_staff:'),
        
        # User authentication checks
        ('if not request.user.is_authenticated:', '# TEMP: Auth disabled - if not request.user.is_authenticated:'),
        ('if not self.request.user.is_authenticated:', '# TEMP: Auth disabled - if not self.request.user.is_authenticated:'),
        
        # Permission denied raises
        ('raise PermissionDenied(', '# TEMP: Auth disabled - raise PermissionDenied('),
        
        # User ownership checks
        ('if request.user != ', '# TEMP: Auth disabled - if request.user != '),
        ('if self.request.user != ', '# TEMP: Auth disabled - if self.request.user != '),
        
        # Return permission responses
        ('return Response({\'error\':', 'return Response({\'info\': \'AUTH DISABLED -'),
        
        # Get permissions method patterns
        ('if self.action in [\'list\', \'retrieve\']:\n            permission_classes = [AllowAny]\n        else:\n            permission_classes = [IsAuthenticated]',
         'permission_classes = [AllowAny]  # TEMP: Auth disabled for all actions'),
    ]
    
    changes_made = 0
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changes_made += 1
    
    # Add AllowAny import if not present
    if 'from rest_framework.permissions import' in content and 'AllowAny' not in content:
        content = content.replace(
            'from rest_framework.permissions import',
            'from rest_framework.permissions import AllowAny,'
        )
        changes_made += 1
    elif 'AllowAny' not in content and 'permission_classes' in content:
        # Add import at the top if needed
        lines = content.split('\n')
        import_added = False
        for i, line in enumerate(lines):
            if line.startswith('from rest_framework') and not import_added:
                lines.insert(i + 1, 'from rest_framework.permissions import AllowAny  # TEMP: Auth disabled')
                import_added = True
                changes_made += 1
                break
        content = '\n'.join(lines)
    
    if changes_made > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Made {changes_made} changes to {file_path}")
    else:
        print(f"ℹ️  No changes needed in {file_path}")

def main():
    print("🚫 TEMPORARILY DISABLING ALL AUTHENTICATION")
    print("=" * 50)
    
    # Create backup
    backup_dir = backup_files()
    
    # Files to process
    view_files = [
        "sites/views.py",
        "main_site/views.py", 
        "user_dashboard/views.py",
        "tenant_dashboards/views.py",
    ]
    
    # Disable auth in each file
    for file_path in view_files:
        disable_auth_in_file(file_path)
    
    print("\n✅ AUTHENTICATION TEMPORARILY DISABLED")
    print(f"📁 Backup created in: {backup_dir}")
    print("\n⚠️  IMPORTANT: Run 'python restore_authentication.py' to restore auth when done!")
    print("\n🔧 To manually restore, you can:")
    print("1. Copy files back from backup directory")
    print("2. Search for 'TEMP: Auth disabled' comments and reverse changes")

if __name__ == "__main__":
    main()