import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ExamList from './components/ExamList';
import ExamRunner from './components/ExamRunner';
import ExamResult from './components/ExamResult';
import LeaderboardView from './components/LeaderboardView';
import ExamCreator from './components/ExamCreator';
import OopsInspector from './components/OopsInspector';
import ParticipantModal from './components/ParticipantModal';
import TeacherLoginModal from './components/TeacherLoginModal';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeExam, setActiveExam] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [selectedLeaderboardExamId, setSelectedLeaderboardExamId] = useState(null);
  const [serverStatus, setServerStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  // Participant registration modal state
  const [participantExam, setParticipantExam] = useState(null);
  const [activeParticipant, setActiveParticipant] = useState(null);

  // Teacher login modal state
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);

  // Apple Theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Initial Data Fetch & URL share link detection
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [user, examList, stats] = await Promise.all([
        api.getCurrentUser().catch(() => null),
        api.getExams().catch(() => []),
        api.getAnalyticsOverview().catch(() => null)
      ]);

      if (user) {
        setCurrentUser(user);
        setServerStatus(true);
      }
      setExams(examList || []);
      setAnalytics(stats);

      // Check if candidate arrived through a shared link (?examId=EXAM-101 or ?exam=...)
      const urlParams = new URLSearchParams(window.location.search);
      const sharedExamId = urlParams.get('examId') || urlParams.get('exam');
      if (sharedExamId) {
        try {
          const sharedExam = await api.getExamById(sharedExamId);
          if (sharedExam) {
            setParticipantExam(sharedExam);
          }
        } catch (e) {
          console.warn('Shared exam not found:', sharedExamId);
        }
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setServerStatus(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherLogin = async ({ email, password }) => {
    const teacher = await api.teacherLogin(email, password);
    if (teacher) {
      setCurrentUser(teacher);
      setIsTeacherLoginOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const student = await api.logout();
      setCurrentUser(student);
      if (activeTab === 'create') {
        setActiveTab('exams');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Triggered when user clicks "Participate" or opens a share link
  const handleStartExam = async (examId) => {
    try {
      const fullExam = await api.getExamById(examId);
      if (fullExam) {
        setParticipantExam(fullExam);
      }
    } catch (err) {
      alert(`Could not load exam: ${err.message}`);
    }
  };

  // Confirmed participant name & roll number from ParticipantModal
  const handleConfirmStartParticipant = async ({ examId, candidateName, rollNumber }) => {
    try {
      const fullExam = await api.getExamById(examId);
      if (fullExam) {
        const studentId = 'CAND-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        setActiveParticipant({
          studentId,
          candidateName,
          rollNumber
        });
        setActiveExam(fullExam);
        setParticipantExam(null);

        // Start exam attempt with candidate's custom name in the backend
        await api.startExam(examId, studentId, candidateName, rollNumber).catch(() => null);
        setActiveTab('taking');
      }
    } catch (err) {
      alert(`Could not start exam: ${err.message}`);
    }
  };

  const handleSubmitExam = async (submitPayload) => {
    if (!activeExam) return;
    try {
      const candidateName = activeParticipant?.candidateName || submitPayload.candidateName || currentUser?.name || 'Candidate';
      const studentRollNo = activeParticipant?.rollNumber || submitPayload.rollNumber || 'CAND-001';
      const studentId = activeParticipant?.studentId || currentUser?.id || 'CAND-001';

      const payload = {
        studentId,
        studentName: candidateName,
        studentRollNo: studentRollNo,
        timeTakenSeconds: submitPayload.timeTakenSeconds,
        answers: submitPayload.answers
      };

      const evaluated = await api.submitExam(activeExam.id, payload);
      setLastSubmission(evaluated);
      setActiveTab('result');

      api.getAnalyticsOverview().then(setAnalytics).catch(() => null);
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    }
  };

  const handleViewLeaderboard = (examId) => {
    setSelectedLeaderboardExamId(examId);
    setActiveTab('leaderboard');
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this examination?')) return;
    try {
      await api.deleteExam(examId);
      setExams(prev => prev.filter(e => e.id !== examId));
      api.getAnalyticsOverview().then(setAnalytics).catch(() => null);
    } catch (err) {
      alert(`Error deleting exam: ${err.message}`);
    }
  };

  const handleExamCreated = (newExam) => {
    setExams(prev => [newExam, ...prev]);
    setActiveTab('exams');
    api.getAnalyticsOverview().then(setAnalytics).catch(() => null);
  };

  // Fullscreen Focused Exam Runner
  if (activeTab === 'taking' && activeExam) {
    return (
      <ExamRunner
        exam={activeExam}
        participant={activeParticipant}
        onSubmitExam={handleSubmitExam}
        onExit={() => setActiveTab('exams')}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg-main)'
    }}>
      
      {/* Apple-styled Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
        onLogout={handleLogout}
        serverStatus={serverStatus}
        theme={theme}
        onToggleTheme={toggleTheme}
        examsCount={exams.length}
      />

      {/* Main Scrollable Content Area */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        
        {/* Main View Router */}
        <main style={{ flex: 1 }}>
          {activeTab === 'exams' && (
            <ExamList
              exams={exams}
              analytics={analytics}
              onStartExam={handleStartExam}
              onViewLeaderboard={handleViewLeaderboard}
              onDeleteExam={handleDeleteExam}
              isInstructor={currentUser?.role === 'INSTRUCTOR'}
            />
          )}

          {activeTab === 'result' && (
            <ExamResult
              submission={lastSubmission}
              onBackToExams={() => setActiveTab('exams')}
              onViewLeaderboard={handleViewLeaderboard}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              exams={exams}
              selectedExamId={selectedLeaderboardExamId}
              onBack={() => setActiveTab('exams')}
              onStartExam={handleStartExam}
            />
          )}

          {activeTab === 'create' && (
            <ExamCreator
              currentUser={currentUser}
              onExamCreated={handleExamCreated}
            />
          )}

          {activeTab === 'oops' && (
            <OopsInspector />
          )}
        </main>

        {/* Minimal Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px 32px',
          color: 'var(--text-dim)',
          fontSize: '0.8rem',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong>ExamiNation</strong> • University Online Examination System
          </div>
          <div>
            College OOPS Project • Pure Java Spring Boot Architecture & React
          </div>
        </footer>
      </div>

      {/* Teacher Sign In Modal */}
      {isTeacherLoginOpen && (
        <TeacherLoginModal
          onLogin={handleTeacherLogin}
          onClose={() => setIsTeacherLoginOpen(false)}
        />
      )}

      {/* Participant Name & Registration Modal (Opens when user clicks Participate or follows a shared link) */}
      {participantExam && (
        <ParticipantModal
          exam={participantExam}
          currentUser={currentUser}
          onConfirmStart={handleConfirmStartParticipant}
          onClose={() => setParticipantExam(null)}
        />
      )}
    </div>
  );
}
