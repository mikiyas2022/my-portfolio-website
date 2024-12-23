import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Container, Button, Dialog } from '@mui/material';
import { RootState } from '../../store';
import ProjectCard from '../projects/ProjectCard';
import ProjectForm from '../forms/ProjectForm';
import { setProjects, setIsEditing } from '../../store/slices/portfolioSlice';
import config from '../../config';

const Home = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state: RootState) => state.portfolio);
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/projects`);
        const data = await response.json();
        
        if (response.ok) {
          dispatch(setProjects(data));
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, [dispatch]);

  const handleAddProject = () => {
    dispatch(setIsEditing(false));
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Portfolio
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
              onClick={handleAddProject}
            >
              Add New Project
            </Button>
          )}
        </Grid>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard project={project} onEdit={() => setIsFormOpen(true)} />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <ProjectForm onClose={() => setIsFormOpen(false)} />
      </Dialog>
    </Container>
  );
};

export default Home; 