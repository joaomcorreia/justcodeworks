'use client';

import { useState, useEffect } from 'react';

interface ProjectInfo {
  id: string;
  name: string;
  template: string;
}

export function useProjectInfo() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Fetch all projects for the current user and use the first one
    fetch(`http://localhost:8000/api/projects/`, {
      method: "GET",
      credentials: "include", // Use session cookies for auth
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(projects => {
        console.log('Projects data:', projects); // Debug log to see the structure
        
        // Get the first project for the current user
        const project = Array.isArray(projects) && projects.length > 0 ? projects[0] : null;
        
        if (project) {
          // Extract template name safely - prioritize site_template over template
          let templateName = 'Default Template';
          if (project.site_template) {
            if (typeof project.site_template === 'string') {
              templateName = project.site_template;
            } else if (project.site_template.name) {
              templateName = project.site_template.name;
            } else if (project.site_template.key) {
              templateName = project.site_template.key;
            }
          } else if (project.template_name) {
            templateName = project.template_name;
          } else if (project.template) {
            if (typeof project.template === 'string') {
              templateName = project.template;
            } else if (project.template.name) {
              templateName = project.template.name;
            } else if (project.template.id) {
              templateName = `Template ${project.template.id}`;
            }
          }
          
          setProjectInfo({
            id: project.id,
            name: project.name || 'Your Business',
            template: templateName
          });
        } else {
          // No projects found
          setProjectInfo({
            id: '',
            name: 'Your Business',
            template: 'Default Template'
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching project info:', error);
        // Fallback to default values
        setProjectInfo({
          id: '',
          name: 'Your Business',
          template: 'Default Template'
        });
        setLoading(false);
      });
  }, [isClient]);

  return { projectInfo, loading };
}