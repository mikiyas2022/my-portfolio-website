import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  IconButton,
  Chip,
  Drawer,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { addProject } from '../../redux/slices/projectSlice';
import config from '../../config';

const ModernPortfolio = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProjectFormOpen, setProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: ['Research', 'Information Architecture']
  });
  const { user } = useSelector((state: RootState) => state.auth);
  const { token } = useSelector((state: RootState) => state.auth);
  const { projects } = useSelector((state: RootState) => state.project);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddProject = () => {
    setProjectFormOpen(true);
  };

  const handleCloseProjectForm = () => {
    setProjectFormOpen(false);
  };

  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      dispatch(addProject(data));
      setProjectFormOpen(false);
      setProjectForm({
        title: '',
        description: '',
        image: '',
        tags: ['Research', 'Information Architecture']
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const Sidebar = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Avatar
        sx={{
          width: 200,
          height: 200,
          mx: 'auto',
          mb: 2,
        }}
        alt={user?.name}
        src="/path-to-profile-image.jpg"
      />
      <Typography variant="h5" align="center" gutterBottom>
        {user?.name}
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
        {user?.domain}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        {user?.email} • {user?.phoneNumber}
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Hello, I am {user?.name?.split(' ')[0]}, A UX Design Institute Diploma Alumni,
        I craft interfaces that not only look stunning but also seamlessly guide users towards their goals. With a
        keen eye for aesthetics, a deep understanding of human behavior, and a proven track record of success,
        I transform complex ideas into intuitive, user-centered designs that resonate with your audience and propel
        your business forward.
      </Typography>
      
      <Box sx={{ mt: 'auto' }}>
        <Typography
          component="a"
          href="#"
          sx={{
            color: 'primary.main',
            display: 'block',
            mb: 1,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          HOME
        </Typography>
        <Typography
          component="a"
          href="#"
          sx={{
            color: 'text.primary',
            display: 'block',
            mb: 1,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ABOUT ME
        </Typography>
        <Typography
          component="a"
          href="#"
          sx={{
            color: 'text.primary',
            display: 'block',
            mb: 3,
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          CONTACT
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 2 }}>
        <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
          <img src="/behance-icon.svg" alt="Behance" width="20" />
        </IconButton>
        <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
          <img src="/facebook-icon.svg" alt="Facebook" width="20" />
        </IconButton>
        <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
          <img src="/telegram-icon.svg" alt="Telegram" width="20" />
        </IconButton>
        <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
          <img src="/instagram-icon.svg" alt="Instagram" width="20" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          {Sidebar}
        </Box>
      )}

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 300 },
        }}
      >
        {Sidebar}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            LOGO
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton>
              <DownloadIcon />
            </IconButton>
            <IconButton>
              <ShareIcon />
            </IconButton>
            <Button variant="outlined" sx={{ ml: 1 }}>
              Preview
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            My Projects
          </Typography>

          <Grid container spacing={3}>
            {projects?.map((project) => (
              <Grid item xs={12} md={6} key={project._id}>
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
                    <Box sx={{ mb: 2 }}>
                      <Chip label="Research" sx={{ mr: 1 }} />
                      <Chip label="Information Architecture" />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        bgcolor: '#4CAF50',
                        '&:hover': { bgcolor: '#45a049' },
                      }}
                    >
                      See Detail
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Add Project Card */}
            <Grid item xs={12} md={6}>
              <Card
                onClick={handleAddProject}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Add Project
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Project Form Dialog */}
        <Dialog open={isProjectFormOpen} onClose={handleCloseProjectForm} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleProjectSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={projectForm.title}
                onChange={handleProjectFormChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={projectForm.description}
                onChange={handleProjectFormChange}
                multiline
                rows={4}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={projectForm.image}
                onChange={handleProjectFormChange}
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
      </Box>
    </Box>
  );
};

export default ModernPortfolio; 