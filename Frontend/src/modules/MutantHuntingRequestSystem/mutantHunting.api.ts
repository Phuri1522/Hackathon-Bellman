import type {
  CreateMutantHuntingRequestPayload,
  MutantHuntingRequest,
} from "./types/mutantHunting.type";

const API_BASE_URL = "http://localhost:3000/api";

export async function createMutantHuntingRequest(
  payload: CreateMutantHuntingRequestPayload,
) {
  const response = await fetch(`${API_BASE_URL}/mutant-hunting-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create mutant hunting request");
  }

  return response.json();
}

export async function getMutantHuntingRequests(): Promise<MutantHuntingRequest[]> {
  const response = await fetch(`${API_BASE_URL}/mutant-hunting-requests`);

  if (!response.ok) {
    throw new Error("Failed to fetch mutant hunting requests");
  }

  const result = await response.json();
  return result.data ?? [];
}

export async function deleteMutantHuntingRequest(id: number, userId: number) {
  const response = await fetch(`${API_BASE_URL}/mutant-hunting-requests/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete mutant hunting request");
  }

  return response.json();
}
