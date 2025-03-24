export interface Question {
    question_id: string;
    question_text: string;
    options: any[];
}

export interface QuizData {
    quizz_id: string;
    title: string;
    description: string;
    time: number;
    score: string;
    questions: Question[];
    article: string;
    result_id: string;
}