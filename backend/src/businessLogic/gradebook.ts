import * as uuid from 'uuid';
import { GradebookQueries } from '../dataLayer/gradebookQueries';
import { GradebookItem } from '../models/GradebookItem';
import { GradebookItemRequest } from '../models/GradebookItemRequest';
import { UpdateRequest } from '../models/ModifyGradebookItem';

const queries = new GradebookQueries();

export async function getAllGradebookItems(instructorId) {
    return await queries.getGradebookItems(instructorId);
}

export async function createGradebookItem(gradebookItem: GradebookItem) {
    const studentId = uuid.v4();

    const item: GradebookItemRequest = {
        studentId,
        instructorId: gradebookItem.instructorId,
        firstName: gradebookItem.firstName,
        lastName: gradebookItem.lastName,
        dateOfBirth: gradebookItem.dateOfBirth,
        finalGrade: gradebookItem.finalGrade
    };

    if (gradebookItem.photoUrl) {
        item.photoUrl = gradebookItem.photoUrl;
    }
    return await queries.createGradebookItem(item);
}

export async function deleteGradebookItem(studentId, instructorId)  {
    return await queries.deleteGradebookItem(studentId, instructorId);
}

export async function updateGradebookItem(studentId, instructorId, gradebookItem: UpdateRequest) {
    return await queries.updateGradebookItem(studentId, instructorId, gradebookItem);
}

export async function updatePhotoUrl(studentId, instructorId, photoUrl: string) {
    return await queries.updatePhotoUrl(studentId, instructorId, photoUrl);
}