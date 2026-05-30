import { Request, Response } from "express";
import { prisma } from "../db.js"; 

export const getMapMarkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const activePosts = await prisma.post.findMany({
      where: {
        status: "OPEN"
      },
      select: {
        id: true,
        userId: true,
        latitude: true,
        longitude: true,
        animalType: true,
        mutantType: true,
        classRequired: true,
        reward: true,
        description: true,
        picture: true,
        status: true,
        createdAt: true,
      }
    });

    res.status(200).json(activePosts);
  } catch (error) {
    console.error("Error fetching map markers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};