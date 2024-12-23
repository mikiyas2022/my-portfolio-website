import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Typography, Container, Button, Dialog } from '@mui/material';
import { RootState } from '../../redux/store';
import ProjectCard from '../projects/ProjectCard';
import ProjectForm from '../forms/ProjectForm';
import { setProjects, setLoading } from '../../redux/slices/projectSlice';
import config from '../../config';

const Home = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state: RootState) => state.project);
  const { token } = useSelector((state: RootState) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        dispatch(setLoading(true));
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
    setIsFormOpen(true);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Portfolio
          </Typography>
          {token && (
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
          <Grid item xs={12} sm={6} md={4} key={project._id}>
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