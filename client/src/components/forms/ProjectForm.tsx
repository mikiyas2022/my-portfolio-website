import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../../store';
import { addProject, updateProject, setIsEditing, setCurrentProject } from '../../store/slices/portfolioSlice';
import config from '../../config';

interface ProjectFormProps {
  onClose: () => void;
}

const ProjectForm = ({ onClose }: ProjectFormProps) => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state: RootState) => state.portfolio);
  const token = useSelector((state: RootState) => state.auth.token);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technology, setTechnology] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setTitle(currentProject.title);
      setDescription(currentProject.description);
      setTechnologies(currentProject.technologies);
    }
  }, [currentProject]);

  const handleAddTechnology = () => {
    if (technology.trim() && !technologies.includes(technology.trim())) {
      setTechnologies([...technologies, technology.trim()]);
      setTechnology('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let thumbnailUrl = currentProject?.thumbnail || '';

      if (thumbnail) {
        const formData = new FormData();
        formData.append('file', thumbnail);
        formData.append('upload_preset', 'portfolio_preset');
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const uploadResponse = await fetch(config.cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error('Cloudinary error:', errorData);
          throw new Error(errorData.error?.message || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        thumbnailUrl = uploadData.secure_url;
      }

      const projectData = {
        title,
        description,
        technologies,
        thumbnail: thumbnailUrl,
      };

      const response = await fetch(
        `${config.apiUrl}/projects${currentProject ? `/${currentProject.id}` : ''}`,
        {
          method: currentProject ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save project');
      }

      if (currentProject) {
        dispatch(updateProject(data));
      } else {
        dispatch(addProject(data));
      }

      dispatch(setIsEditing(false));
      dispatch(setCurrentProject(null));
      onClose();
    } catch (err) {
      console.error('Project form error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {currentProject ? 'Edit Project' : 'Add New Project'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Box sx={{ mt: 2, mb: 1 }}>
          <TextField
            label="Technologies"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddTechnology}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              onDelete={() => handleRemoveTechnology(tech)}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2, mb: 2 }}
          disabled={uploading}
        >
          Upload Thumbnail
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </Button>
        {thumbnail && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {thumbnail.name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={uploading}
          >
            {uploading ? 'Saving...' : currentProject ? 'Update' : 'Create'} Project
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => {
              dispatch(setIsEditing(false));
              dispatch(setCurrentProject(null));
              onClose();
            }}
            disabled={uploading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProjectForm; 