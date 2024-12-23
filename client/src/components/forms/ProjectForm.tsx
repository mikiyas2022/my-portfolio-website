import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addProject } from '../../redux/slices/projectSlice';
import { RootState } from '../../redux/store';
import config from '../../config';

export interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    image: '',
    tags: ['Research', 'Information Architecture']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      dispatch(addProject(data));
      setFormData({
        title: '',
        description: '',
        image: '',
        tags: ['Research', 'Information Architecture']
      });
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Project Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' },
            }}
          >
            Add Project
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm; 