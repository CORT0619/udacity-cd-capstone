/**
 * Fields in a request to update a gradebook item.
 */
export interface UpdateGradebookItemRequest {
  instructorId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: boolean;
  finalGrade?: string;
  photoUrl?: string;
}