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
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/slices/authSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: 'Facebook', url: '' }]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'Facebook', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = profileImageUrl;

      // Upload image to Cloudinary if there's a new profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', profileImage);
        formData.append('upload_preset', 'portfolio_preset');
        
        try {
          console.log('Starting image upload to Cloudinary...');
          const uploadResponse = await fetch(
            'https://api.cloudinary.com/v1_1/defbzjdkk/image/upload',
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('Cloudinary upload failed:', errorData);
            throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
          }

          console.log('Image upload successful');
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.secure_url;
        } catch (uploadError) {
          console.error('Error during image upload:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
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
          socialLinks: socialLinks.filter(link => link.url.trim() !== ''),
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Add Social Media Links</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddSocialLink}
                variant="contained"
                sx={{
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#45a049' },
                }}
              >
                Add Platform
              </Button>
            </Box>
            
            <Stack spacing={2}>
              {socialLinks.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
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
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  />
                  {socialLinks.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveSocialLink(index)}
                      sx={{
                        color: 'error.main',
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
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
    </Box>
  );
};

export default ProfileSetup; 