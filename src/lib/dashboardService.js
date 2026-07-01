import { supabase } from './supabase';
export { getSession, signIn, signOut } from './authService';

// O código volta a ser extremamente simples, pois o Banco de Dados 
// já garante que o aluno existe graças ao Trigger!
export const getStudentProfile = (userId) =>
  supabase
    .from('students')
    .select('*')
    .eq('id', userId)
    .single();

export const getStudentLessons = (studentId) =>
  supabase
    .from('student_lessons')
    .select('*, lesson:lessons(*)')
    .eq('student_id', studentId);

export const toggleLessonComplete = (id, completed) =>
  supabase
    .from('student_lessons')
    .update({ completed, completed_at: completed ? new Date().toISOString() : null })
    .eq('id', id);
