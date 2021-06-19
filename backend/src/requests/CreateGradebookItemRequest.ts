/**
 * Fields in a request to create a gradebook item.
 */
export interface CreateGradebookRequest {
  instructorId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  finalGrade?: string;
  photoUrl?: string;
}
