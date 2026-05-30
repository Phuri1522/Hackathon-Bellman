import type { CreateMutantHuntingRequestPayload } from "./types/mutantHunting.type";

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
