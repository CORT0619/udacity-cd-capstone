import { apiEndpoint } from '../config'
import { GradebookItem } from '../types/GradebookItem';
import { CreateGradebookItemRequest } from '../types/CreateGradebookItemRequest'; // change to reference CreateGradebookItemRequest
import Axios from 'axios';
import { UpdateGradebookItemRequest } from '../types/UpdateGradebookItemRequest'; // change to reference UpdateGradebookItemRequest

export async function getGradebookItems(idToken: string): Promise<GradebookItem[]> { // change to reference GradebookItem
  console.log('Fetching gradebook items');

  const response = await Axios.get(`${apiEndpoint}/gradebook`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.items
}

export async function createGradebookItem(
  idToken: string,
  newItem: CreateGradebookItemRequest
): Promise<GradebookItem> {
  const response = await Axios.post(`${apiEndpoint}/gradebook`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item;
}

export async function patchGradebookItem(
  idToken: string,
  studentId: string,
  updatedGradebookItem: UpdateGradebookItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/gradebook/${studentId}`, JSON.stringify(updatedGradebookItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteGradebookItem(
  idToken: string,
  studentId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/gradebook/${studentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getPhotoUrl(
  idToken: string,
  studentId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/gradebook/${studentId}/photo`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.photoUrl
}

export async function uploadFile(photoUrl: string, file: Buffer): Promise<void> {
  await Axios.put(photoUrl, file)
}
