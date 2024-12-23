import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/slices/authSlice';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface SocialLink {
  platform: string;
  url: string;
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newUrl, setNewUrl] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  const handleAddSocialLink = () => {
    if (newUrl.trim()) {
      setSocialLinks([...socialLinks, { platform: newPlatform, url: newUrl }]);
      setNewUrl('');
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = profileImageUrl;

      // Upload image to Cloudinary if there's a new profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', profileImage);
        formData.append('upload_preset', 'portfolio_preset');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      // Update user profile
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          profileImage: imageUrl,
          jobPosition,
          aboutMe,
          socialLinks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      dispatch(setUser(data));
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Give us More Info
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <input
            type="file"
            accept="image/*"
            id="profile-image-upload"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <label htmlFor="profile-image-upload">
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {profileImageUrl ? (
                <Avatar
                  src={profileImageUrl}
                  sx={{ width: '100%', height: '100%' }}
                />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              )}
            </Box>
          </label>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload Profile Picture
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Job Position"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="About Me"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Social Media Links
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Platform</InputLabel>
              <Select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                label="Platform"
              >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Twitter">Twitter</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                <MenuItem value="GitHub">GitHub</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Behance">Behance</MenuItem>
                <MenuItem value="Telegram">Telegram</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Insert Link Here"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <IconButton
              onClick={handleAddSocialLink}
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                '&:hover': { bgcolor: '#45a049' },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          {socialLinks.map((link, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Typography variant="body2">
                {link.platform}: {link.url}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 4,
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' },
            py: 1.5,
          }}
        >
          Continue
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfileSetup; 