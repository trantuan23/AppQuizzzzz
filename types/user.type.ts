export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    avatarUrl?: string;
    class?: { class_name: string };
}

export interface QuizResult {
    title: string;
    score: string;
    completed_at: string;
    quizzes: any;
    subject: string;
    class: string;
    result_id: string;
}