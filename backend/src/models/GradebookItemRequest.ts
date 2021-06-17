import { GradebookItem } from "./GradebookItem";

export interface GradebookItemRequest extends GradebookItem {
    studentId: string;
}
