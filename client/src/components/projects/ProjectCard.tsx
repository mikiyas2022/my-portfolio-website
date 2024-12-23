import { Card, CardContent, CardMedia, Typography, Chip, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Project } from '../../types';
import { deleteProject, setCurrentProject, setIsEditing } from '../../store/slices/portfolioSlice';
import config from '../../config';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const handleEdit = () => {
    dispatch(setCurrentProject(project));
    dispatch(setIsEditing(true));
    onEdit();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${config.apiUrl}/projects/${project.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch(deleteProject(project.id));
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={project.thumbnail}
        alt={project.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography gutterBottom variant="h5" component="h2">
            {project.title}
          </Typography>
          {isAuthenticated && (
            <Box>
              <IconButton size="small" color="primary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {project.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {project.technologies.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard; 