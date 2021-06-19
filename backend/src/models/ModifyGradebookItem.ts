export interface UpdateRequest {
    instructorId: string;
    studentId: string;
    firstName?: string;
    lastName?: string;
    finalGrade?: string;
    photoUrl?: string;
}