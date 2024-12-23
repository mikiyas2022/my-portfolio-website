import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { Project } from '../../redux/slices/projectSlice';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="200"
        image={project.image}
        alt={project.title}
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          {project.description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {project.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            component={Link}
            to={`/project/${project._id}`}
            sx={{
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' },
            }}
          >
            See Detail
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard; 