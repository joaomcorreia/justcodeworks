#!/usr/bin/env python3
"""
# [I18N] Django management command to sync JCW navigation from frontend config to NavigationItem model

This command reads the canonical navigation structure from the frontend MainNavigationClient
and creates/updates NavigationItem rows to match for both EN and PT locales.

Usage:
    python manage.py sync_jcw_navigation

The command is idempotent - running it multiple times will just update existing rows.
"""

from django.core.management.base import BaseCommand
from sites.models import SiteProject, NavigationItem, LocaleChoices


class Command(BaseCommand):
    help = 'Sync JCW navigation from frontend config to NavigationItem model'

    def handle(self, *args, **options):
        self.stdout.write('🧩 Starting JCW Navigation Sync...')
        
        # Note: jcw-main is now the platform template, not a tenant site
        # This command is no longer needed since navigation is handled at the platform level
        self.stdout.write(
            self.style.WARNING('⚠️  JCW navigation sync is no longer needed - jcw-main is now the platform template, not a tenant site.')
        )
        return

        # Define navigation items that mirror MainNavigationClient.tsx
        # [I18N] EN menu items
        en_items = [
            {"label": "Home", "path": "/"},
            {"label": "Websites", "path": "/websites"}, 
            {"label": "POS Systems", "path": "/pos-systems"},
            {"label": "Services", "path": "/services"},
            {"label": "Help Center", "path": "/help-center"},
            {"label": "Print Lab", "path": "/print-lab"},
        ]
        
        # [I18N] PT menu items with localized paths
        pt_items = [
            {"label": "Início", "path": "/"},
            {"label": "Websites", "path": "/websites"},
            {"label": "Sistemas TPV", "path": "/sistemas-tpv"},
            {"label": "Serviços", "path": "/servicos"},
            {"label": "Centro de Ajuda", "path": "/centro-ajuda"},
            {"label": "Print Lab", "path": "/print-lab"},
        ]

        # Sync EN navigation items
        self.stdout.write('🔧 Syncing EN navigation items...')
        en_created, en_updated = self._sync_navigation_items(
            jcw_project, en_items, LocaleChoices.EN
        )
        
        # Sync PT navigation items  
        self.stdout.write('🔧 Syncing PT navigation items...')
        pt_created, pt_updated = self._sync_navigation_items(
            jcw_project, pt_items, LocaleChoices.PT
        )
        
        # Summary
        self.stdout.write('📊 Navigation Sync Summary:')
        self.stdout.write(f'   EN items: {en_created} created, {en_updated} updated')
        self.stdout.write(f'   PT items: {pt_created} created, {pt_updated} updated')
        self.stdout.write('🎉 JCW Navigation Sync Complete!')
        self.stdout.write('')
        self.stdout.write('🔍 To verify:')
        self.stdout.write('   1. Open Django admin: Sites › Navigation items')
        self.stdout.write('   2. Filter by project = Just Code Works')
        self.stdout.write('   3. Check EN and PT items match the frontend menu')

    def _sync_navigation_items(self, project, items, locale):
        """Create or update navigation items for a specific locale"""
        created_count = 0
        updated_count = 0
        
        for index, item in enumerate(items, 1):
            nav_item, created = NavigationItem.objects.get_or_create(
                project=project,
                locale=locale,
                location='header',
                order=index,
                defaults={
                    'label': item['label'],
                    'url': item['path'],
                    'is_external': False,
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f'✅ Created {locale}: {item["label"]} → {item["path"]}')
            else:
                # Update existing item
                updated = False
                if nav_item.label != item['label']:
                    nav_item.label = item['label']
                    updated = True
                if nav_item.url != item['path']:
                    nav_item.url = item['path']
                    updated = True
                
                if updated:
                    nav_item.save()
                    updated_count += 1
                    self.stdout.write(f'🔄 Updated {locale}: {item["label"]} → {item["path"]}')
                else:
                    self.stdout.write(f'📋 No change {locale}: {item["label"]} → {item["path"]}')
        
        return created_count, updated_count