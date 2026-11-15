/**
 * API Service for Online Examination System.
 * Connects directly to the Spring Boot REST backend.
 */
const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth & Roles
  getCurrentUser: () => request('/auth/current-user'),
  switchRole: (role) => request(`/auth/switch-role?role=${role}`, { method: 'POST' }),
  teacherLogin: (email = 'sarah.mitchell@college.edu', password = '') => 
    request('/auth/teacher-login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password, role: 'INSTRUCTOR' }) 
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getAllUsers: () => request('/auth/users'),

  // Exams
  getExams: (status, subject) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (subject) params.append('subject', subject);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request(`/exams${qs}`);
  },
  getExamById: (id) => request(`/exams/${id}`),
  createExam: (examData) => request('/exams', { method: 'POST', body: JSON.stringify(examData) }),
  updateExam: (id, examData) => request(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(examData) }),
  deleteExam: (id) => request(`/exams/${id}`, { method: 'DELETE' }),
  addQuestion: (examId, questionData) => request(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(questionData) }),

  // Submissions with custom participant name support
  startExam: (examId, studentId = 'STUDENT-001', studentName = '', studentRollNo = '') => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (studentName) params.append('studentName', studentName);
    if (studentRollNo) params.append('studentRollNo', studentRollNo);
    return request(`/exams/${examId}/start?${params.toString()}`, { method: 'POST' });
  },
  submitExam: (examId, payload) => request(`/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getSubmissionById: (id) => request(`/submissions/${id}`),
  getStudentSubmissions: (studentId) => request(`/submissions/student/${studentId}`),
  getLeaderboard: (examId) => request(`/exams/${examId}/leaderboard`),

  // Analytics
  getAnalyticsOverview: () => request('/analytics/overview'),
};
