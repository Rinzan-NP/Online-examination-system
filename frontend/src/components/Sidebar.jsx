import React from 'react';
import { 
  BookOpen, 
  Award, 
  PlusCircle, 
  Layers, 
  LogIn,
  LogOut,
  Lock,
  Sun, 
  Moon, 
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenTeacherLogin,
  onLogout,
  serverStatus,
  theme,
  onToggleTheme,
  examsCount = 0
}) {
  const isInstructor = currentUser?.role === 'INSTRUCTOR';

  return (
    <aside style={{
      width: '270px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-subtle)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'background-color 0.25s ease, border-color 0.25s ease',
      userSelect: 'none'
    }}>
      {/* Top Branding */}
      <div>
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {/* macOS window control dots for subtle Apple desktop feel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>

          <div 
            onClick={() => setActiveTab('exams')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              color: '#fff',
              flexShrink: 0
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>

            <div>
              <div style={{ 
                fontSize: '1.15rem', 
                fontWeight: 700, 
                letterSpacing: '-0.025em',
                color: 'var(--text-main)',
                lineHeight: 1.2
              }}>
                Exami<span style={{ color: 'var(--apple-blue)' }}>Nation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: serverStatus ? 'var(--apple-green)' : 'var(--apple-orange)',
                  display: 'inline-block'
                }} />
                <span>{serverStatus ? 'Java Backend Online' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Section: Academic Assessments */}
          <div>
            <div style={{
              padding: '0 10px',
              fontSize: '0.675rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '6px'
            }}>
              Examinations
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('exams')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'exams' ? 'var(--apple-blue)' : 'transparent',
                  color: activeTab === 'exams' ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'exams' ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={16} />
                  <span>Available Exams</span>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === 'exams' ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-segmented)',
                  color: activeTab === 'exams' ? '#ffffff' : 'var(--text-dim)'
                }}>
                  {examsCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'leaderboard' ? 'var(--apple-blue)' : 'transparent',
                  color: activeTab === 'leaderboard' ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'leaderboard' ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <Award size={16} />
                <span>Class Leaderboard</span>
              </button>
            </nav>
          </div>

          {/* Section: Faculty Management */}
          <div>
            <div style={{
              padding: '0 10px',
              fontSize: '0.675rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '6px'
            }}>
              Instructor Studio
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => {
                  if (isInstructor) {
                    setActiveTab('create');
                  } else {
                    onOpenTeacherLogin();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'create' ? 'var(--apple-blue)' : 'transparent',
                  color: activeTab === 'create' ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'create' ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PlusCircle size={16} />
                  <span>Create Exam</span>
                </div>
                {!isInstructor && <Lock size={13} color="var(--text-dim)" />}
              </button>
            </nav>
          </div>

          {/* Section: Project Architecture */}
          <div>
            <div style={{
              padding: '0 10px',
              fontSize: '0.675rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '6px'
            }}>
              College Course OOPS
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('oops')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'oops' ? 'var(--apple-blue)' : 'transparent',
                  color: activeTab === 'oops' ? '#ffffff' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === 'oops' ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={16} />
                <span>OOPS Architecture</span>
              </button>
            </nav>
          </div>

        </div>
      </div>

      {/* Bottom Profile & Apple Controls */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-secondary)'
      }}>
        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
            alt={currentUser?.name || 'User'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentUser?.name || 'Candidate'}
            </div>
            <div style={{ 
              fontSize: '0.725rem', 
              color: isInstructor ? 'var(--apple-purple)' : 'var(--apple-blue)', 
              fontWeight: 500 
            }}>
              {isInstructor ? 'Instructor Mode' : 'Student Mode'}
            </div>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
            title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={14} color="#ff9f0a" /> : <Moon size={14} color="var(--text-muted)" />}
          </button>
        </div>

        {/* Teacher Login / Logout Action */}
        {isInstructor ? (
          <button
            onClick={onLogout}
            className="btn btn-outline"
            style={{
              width: '100%',
              padding: '7px 12px',
              fontSize: '0.775rem',
              borderRadius: 'var(--radius-sm)',
              justifyContent: 'center',
              color: 'var(--apple-red)'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out (Teacher)</span>
          </button>
        ) : (
          <button
            onClick={onOpenTeacherLogin}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '7px 12px',
              fontSize: '0.775rem',
              borderRadius: 'var(--radius-sm)',
              justifyContent: 'center'
            }}
          >
            <LogIn size={14} />
            <span>Teacher Login</span>
          </button>
        )}
      </div>
    </aside>
  );
}
