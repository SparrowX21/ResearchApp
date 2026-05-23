export const INITIAL_RESEARCH_STATE = {
  currentStage: 0,
  completedStages: [],
  topic: '',
  researchQuestion: '',
  thesis: '',
  thesisScores: { clarity: 0, arguability: 0, specificity: 0, sophistication: 0, feedback: '' },
  researchPlan: null,
  sources: [],
  outline: [],
  draft: '',
  revisionFeedback: null,
};

export const DEFAULT_STUDENT_DATA = {
  name: 'Demo Student',
  grade: '11th Grade',
  school: 'Academic Prep High',
  gpa: '4.00',
  targetMajor: 'Computer Science & AI',
  bio: 'Passionate student interested in machine learning ethics, independent research, and high school computer science pathways.',
  skills: [
    { id: 1, name: 'Python Programming', category: 'Technical', proficiency: 'Advanced' },
    { id: 2, name: 'Academic Research Methods', category: 'Research', proficiency: 'Intermediate' },
  ],
  courses: [
    { id: 1, name: 'AP Computer Science A', grade: 'A', type: 'AP' },
    { id: 2, name: 'Honors Pre-Calculus', grade: 'A', type: 'Honors' },
  ],
  projects: [],
  competitions: 0,
  extracurriculars: [],
  volunteerLogs: [],
  completedMilestones: [],
  colleges: [],
  interests: ['technology'],
  documents: [],
};
