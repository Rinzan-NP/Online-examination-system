import React from 'react';
import { 
  BookOpen, 
  Award, 
  PlusCircle, 
  Layers, 
  UserCheck,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onRoleSwitch, 
  serverStatus,
  theme,
  onToggleTheme 
}) {
  const isInstructor = currentUser?.role === 'INSTRUCTOR';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-header)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background-color 0.25s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('exams')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          {/* Apple-style minimalist icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            color: '#fff'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '1.15rem', 
                fontWeight: 700, 
                letterSpacing: '-0.028em',
                color: 'var(--text-main)' 
              }}>
                Exami<span style={{ color: 'var(--apple-blue)' }}>Nation</span>
              </span>
              <span className="badge badge-gray" style={{ fontSize: '0.675rem' }}>
                University Exam Suite
              </span>
            </div>
          </div>
        </div>

        {/* Apple-style Segmented Control Navigation */}
        <nav className="apple-segmented">
          <button 
            className={`apple-segment-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            <BookOpen size={15} />
            <span>Exams</span>
          </button>

          <button 
            className={`apple-segment-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Award size={15} />
            <span>Leaderboard</span>
          </button>

          <button 
            className={`apple-segment-item ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle size={15} />
            <span>Create Exam</span>
          </button>

          <button 
            className={`apple-segment-item ${activeTab === 'oops' ? 'active' : ''}`}
            onClick={() => setActiveTab('oops')}
          >
            <Layers size={15} />
            <span>OOPS Project Architecture</span>
          </button>
        </nav>

        {/* Right Tools: Theme Switcher & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-outline"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} color="#ff9f0a" /> : <Moon size={16} color="var(--text-muted)" />}
          </button>

          {/* User Profile Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px 4px 4px',
            background: 'var(--bg-segmented)',
            borderRadius: 'var(--radius-full)',
          }}>
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={currentUser?.name || 'User'}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser?.name?.split(' ')[0] || 'Candidate'}
              </div>
              <div style={{ fontSize: '0.675rem', color: isInstructor ? 'var(--apple-purple)' : 'var(--apple-blue)', fontWeight: 500 }}>
                {isInstructor ? 'Instructor' : 'Student'}
              </div>
            </div>

            <button 
              onClick={onRoleSwitch}
              className="btn btn-primary"
              title="Toggle role"
              style={{
                padding: '4px 8px',
                fontSize: '0.725rem',
                borderRadius: 'var(--radius-full)',
                marginLeft: '4px',
                boxShadow: 'none'
              }}
            >
              Switch
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
