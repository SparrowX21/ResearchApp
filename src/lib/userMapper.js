import { INITIAL_RESEARCH_STATE, DEFAULT_STUDENT_DATA } from '../contexts/userDefaults';

/** Map Postgres row (snake_case) → app user object */
export function mapUserFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? 'Student',
    picture: row.picture ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.id}`,
    studentData: {
      ...DEFAULT_STUDENT_DATA,
      ...(row.student_data || {}),
      name: row.student_data?.name ?? row.name ?? 'Student',
    },
    researchState: {
      ...INITIAL_RESEARCH_STATE,
      ...(row.research_state || {}),
    },
  };
}

/** Map app user → Postgres insert/update payload */
export function mapUserToDb(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    student_data: user.studentData,
    research_state: user.researchState,
  };
}

export function buildNewUserFromFirebase(firebaseUser) {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || 'Student',
    picture:
      firebaseUser.photoURL ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    studentData: {
      ...DEFAULT_STUDENT_DATA,
      name: firebaseUser.displayName || 'Student',
    },
    researchState: { ...INITIAL_RESEARCH_STATE },
  };
}
