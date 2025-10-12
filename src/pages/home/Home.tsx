import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../../components/home/AppAppBar';
import MainContent from '../../components/home/MainContent';
import Latest from '../../components/home/Latest';
import Footer from '../../components/home/Footer';
import Hero from '../../components/home/Hero';
import NotificationsProvider from '../../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../../hooks/useDialogs/DialogsProvider';
import { Route, Routes } from 'react-router-dom';
import ProjectShow from '../../components/home/ProjectShow';

export default function Home(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        {/* <Hero /> */}
        {/* <MainContent /> */}

         <NotificationsProvider>
              <DialogsProvider>
                <Routes>
                  <Route index element={<MainContent />} />
                  <Route path="" element={<MainContent />} />
                  <Route path="project/:projectId" element={<ProjectShow />} />
                  {/* Fallback route nếu không khớp */}
                  <Route path="*" element={<MainContent />} />
                </Routes>
              </DialogsProvider>
            </NotificationsProvider>
        {/* <Latest /> */}
      </Container>
      <Footer />
    </AppTheme>
  );
}
