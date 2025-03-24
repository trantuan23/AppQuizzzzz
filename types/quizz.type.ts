export interface Quiz {
  quizz_id: string;
  title: string;
  description?: string;
  article?: string
  user: any,
  classes: string[];  // Các lớp có thể là mảng
  subject: any;  // Các môn học có thể là mảng
  userId: string
  quizz: any
  time: number
  answer: any
  created_at: Date;
  updated_at: Date;
  questions: any,
  result_id: string


}