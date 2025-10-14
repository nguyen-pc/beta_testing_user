import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../../components/home/AppAppBar';
import Footer from '../../components/home/Footer';
import CampaignDetailUser from '../../components/home/DetailUserCampaign';

export default function DetailUserCampaignCampaign(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <CampaignDetailUser />
      </Container>
      <Footer />
    </AppTheme>
  );
}
