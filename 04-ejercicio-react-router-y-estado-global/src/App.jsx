import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
		
import { JobListings } from '../components/JobListings.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'

import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))
const JobDetail = lazy(() => import('./pages/Detail.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))

function App() {
  return (
    <>
      <Header />

      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/profile" element={
            <ProtectedRoute redirectTo="/login">
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

const Fallback = () => {
  return <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>Cargando...</div>
}

export default App