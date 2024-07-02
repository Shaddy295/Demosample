import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, Modal, Button, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NewsComponentProps {
  newsData: {
    urlToImage: string;
    description: string;
    title: string;
    publishedAt: string;
    url: string;
    sourceName: string;
  };
}

const NewsComponent: React.FC<NewsComponentProps> = ({ newsData }) => {
  const defaultImage = 'https://www.shutterstock.com/shutterstock/photos/2037270056/display_1500/stock-vector-financial-news-trading-stock-news-impulses-market-movements-creative-concept-charts-up-2037270056.jpg';
  const { urlToImage, description, title, publishedAt, url, sourceName } = newsData;
  const [showModal, setShowModal] = useState(false); // State to manage modal open/close
  const [imageError, setImageError] = useState(false); // State to handle image loading errors

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Function to toggle modal open/close
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to share on Twitter
  const handleShareTwitter = () => {
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`;
    window.open(twitterURL, '_blank');
  };

  // Function to share on Facebook
  const handleShareFacebook = () => {
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookURL, '_blank');
  };

  // Format date for display
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Card Component to trigger Modal */}
      <Card style={{ marginBottom: '20px', cursor: 'pointer', height: '150px', overflow: 'hidden' }} onClick={toggleModal}>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <Grid item xs={4}>
            {/* Display News Image */}
            <CardMedia
              component="img"
              image={!imageError ? (urlToImage || defaultImage) : defaultImage}
              alt="News Image"
              style={{ height: '100%', objectFit: 'cover' }}
              onError={handleImageError} // Handle image loading errors
            />
          </Grid>
          <Grid item xs={8}>
            {/* Display News Title */}
            <CardContent>
              <Typography variant="h6" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {title}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Modal Component */}
      <Modal open={showModal} onClose={toggleModal}>
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Grid item xs={10} md={8} lg={6}>
            <Card>
              <CardContent>
                {/* Close Button */}
                <Grid container justifyContent="flex-end">
                  <IconButton onClick={toggleModal} style={{ position: 'absolute', right: '8px', top: '8px', zIndex: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                {/* News Details */}
                <Typography variant="h5" component="h2">
                  {sourceName}
                </Typography>
                <Typography variant="h6">{formattedDate}</Typography>
                <Typography variant="h4" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                  {description}
                </Typography>
                {/* Share Buttons */}
                <Button variant="contained" color="primary" onClick={handleShareTwitter} style={{ marginRight: '10px' }}>
                  Share on Twitter
                </Button>
                <Button variant="contained" color="primary" onClick={handleShareFacebook}>
                  Share on Facebook
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default NewsComponent;
