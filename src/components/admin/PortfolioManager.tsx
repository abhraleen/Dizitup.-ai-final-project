import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail_url: string;
  link_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

const CATEGORIES = [
  'Video Editing',
  'Branding',
  'Website',
  'App Development',
  'Digital Marketing',
  'UI/UX Design',
  'Photography',
  'Animation',
  'Social Media',
  'Other'
];

const PortfolioManager = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    thumbnail_url: '',
    link_url: '',
    is_featured: false
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Title and category are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase
          .from('portfolio_projects')
          .update(formData)
          .eq('id', editingProject.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        // Create new project
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Project created successfully!",
        });
      }

      resetForm();
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description || '',
      thumbnail_url: project.thumbnail_url || '',
      link_url: project.link_url || '',
      is_featured: project.is_featured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });

      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      thumbnail_url: '',
      link_url: '',
      is_featured: false
    });
    setEditingProject(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-display text-primary animate-pulse">Loading portfolio manager...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-card-foreground">Portfolio Manager</h2>
          <p className="text-muted-foreground">Manage your portfolio projects and showcase your work</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl bg-card border-primary/20 max-h-[90vh] flex flex-col p-0">
            {/* Fixed Header */}
            <div className="flex-none px-6 py-4 border-b border-border bg-card">
              <DialogTitle className="text-xl font-display text-card-foreground">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </DialogTitle>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-6 py-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-card-foreground">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                      required
                      className="bg-input border-primary/20 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      style={{ cursor: 'text' }}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-card-foreground">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-input border-primary/20 text-card-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" style={{ cursor: 'pointer' }}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-card-foreground">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the project"
                      rows={3}
                      className="bg-input border-primary/20 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      style={{ cursor: 'text' }}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Thumbnail Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="bg-input border-primary/20 text-card-foreground file:text-card-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      {isUploading && (
                        <div className="text-sm text-muted-foreground animate-pulse">
                          Uploading...
                        </div>
                      )}
                    </div>
                    {formData.thumbnail_url && (
                      <div className="mt-2">
                        <img 
                          src={formData.thumbnail_url} 
                          alt="Preview" 
                          className="w-32 h-20 object-cover rounded border border-primary/20"
                        />
                      </div>
                    )}
                  </div>

                  {/* Link URL */}
                  <div className="space-y-2">
                    <Label htmlFor="link_url" className="text-card-foreground">Project Link (Optional)</Label>
                    <Input
                      id="link_url"
                      type="url"
                      value={formData.link_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                      placeholder="https://example.com"
                      className="bg-input border-primary/20 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      style={{ cursor: 'text' }}
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured" className="text-card-foreground">Featured Project</Label>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex-none bg-card border-t border-primary/20 px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving || isUploading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-card border-border hover-glow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {project.category}
                    </Badge>
                    {project.is_featured && (
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-card-foreground">{project.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {project.thumbnail_url && (
                <img 
                  src={project.thumbnail_url} 
                  alt={project.title}
                  className="w-full h-32 object-cover rounded border border-primary/20"
                />
              )}
              
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
                
                {project.link_url && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(project.link_url, '_blank')}
                    className="text-muted-foreground hover:text-card-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-display text-card-foreground mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your portfolio by adding your first project.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;