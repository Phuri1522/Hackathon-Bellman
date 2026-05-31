import { Request, Response } from "express";
import { prisma } from "../../../db.js";
import { recommendClass } from "../../../utils/reccommend.js";
import { syncHunterRankScore } from "../../hunt-matching/services/huntRequest.service.js";
import {
  AcceptMutantHuntingRequestBody,
  CompleteMutantHuntingRequestBody,
  CreateMutantHuntingRequestBody,
  DeleteMutantHuntingRequestBody,
  MutantHuntingRequestStatus,
} from "../models/MutantHuntingRequestSystem.models.js";

const VALID_STATUSES: MutantHuntingRequestStatus[] = [
  "MATCHMAKING",
  "PUBLIC",
  "ACCEPTED",
  "COMPLETED",
];

const MATCHMAKING_TIMEOUT_MS = 60 * 1000;

const getRewardText = (reward: string | null | undefined): string =>
  reward?.trim() ? reward : "-";

const withRewardText = <T extends { reward?: string | null }>(request: T) => ({
  ...request,
  reward: getRewardText(request.reward),
});

const uniqueClasses = (classes: string[]): string[] => [...new Set(classes)];

const calculateRequiredClasses = (animalType: string): string[] => {
  const { requiredClasses } = recommendClass(animalType.trim().toUpperCase());
  return uniqueClasses(
    requiredClasses.map((hunterClass) =>
      hunterClass.charAt(0) + hunterClass.slice(1).toLowerCase()
    )
  );
};

const parseNumericId = (id: unknown): number | null => {
  if (Array.isArray(id)) {
    return null;
  }

  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
};

const toNumber = (value: unknown): number | null => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const getRequestUserId = (req: Request): number | null => {
  const authUserId = (req as any).user?.userId;
  const bodyUserId = (req.body as DeleteMutantHuntingRequestBody)?.userId;
  const rawUserId = authUserId ?? bodyUserId;
  return rawUserId ? parseNumericId(String(rawUserId)) : null;
};

const getRequestHunterId = async (
  req: Request,
  body: AcceptMutantHuntingRequestBody
): Promise<number | null> => {
  if (body.hunterId) {
    return parseNumericId(String(body.hunterId));
  }

  const authUserId = (req as any).user?.userId;
  if (!authUserId) {
    return null;
  }

  const hunter = await prisma.hunter.findUnique({
    where: { userId: Number(authUserId) },
  });

  return hunter?.id ?? null;
};

export const createMutantHuntingRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as CreateMutantHuntingRequestBody;
    const userId = getRequestUserId(req);
    const latitude = toNumber(body.latitude);
    const longitude = toNumber(body.longitude);
    const imageUrl = body.imageUrl ?? body.image;
    const status: MutantHuntingRequestStatus = "MATCHMAKING";

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    if (
      !body.animalType ||
      !body.mutantType ||
      latitude === null ||
      longitude === null
    ) {
      res.status(400).json({
        message:
          "animalType, mutantType, latitude, and longitude are required",
      });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const requiredClasses = calculateRequiredClasses(body.animalType);
    const classRequired = requiredClasses.join(",");

    const request = await prisma.post.create({
      data: {
        userId,
        animalType: body.animalType,
        mutantType: body.mutantType,
        classRequired,
        reward: body.reward,
        description: body.description,
        picture: imageUrl,
        latitude,
        longitude,
        status,
      },
    });

    res.status(201).json({
      message: "Mutant hunting request created successfully",
      classRequired,
      requiredClasses,
      data: withRewardText(request),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create mutant hunting request",
      error,
    });
  }
};

export const getAllMutantHuntingRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const matchmakingExpiresAt = new Date(Date.now() - MATCHMAKING_TIMEOUT_MS);

    await prisma.post.updateMany({
      where: { status: "OPEN" },
      data: { status: "PUBLIC" },
    });

    await prisma.post.updateMany({
      where: {
        status: "MATCHMAKING",
        createdAt: { lte: matchmakingExpiresAt },
      },
      data: { status: "PUBLIC" },
    });

    const requests = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        huntRequests: {
          include: {
            hunter: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Mutant hunting requests fetched successfully",
      data: requests.map(withRewardText),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch mutant hunting requests",
      error,
    });
  }
};

export const getMutantHuntingRequestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseNumericId(req.params.id);
    if (!id) {
      res.status(400).json({ message: "id must be numeric" });
      return;
    }

    const request = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        huntRequests: {
          include: {
            hunter: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!request) {
      res.status(404).json({ message: "Mutant hunting request not found" });
      return;
    }

    res.status(200).json({
      message: "Mutant hunting request fetched successfully",
      data: withRewardText(request),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch mutant hunting request",
      error,
    });
  }
};

export const deleteMutantHuntingRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseNumericId(req.params.id);
    const userId = getRequestUserId(req);

    if (!id) {
      res.status(400).json({ message: "id must be numeric" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const request = await prisma.post.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ message: "Mutant hunting request not found" });
      return;
    }

    if (request.userId !== userId) {
      res.status(403).json({
        message: "You are not allowed to delete this request.",
      });
      return;
    }

    await prisma.$transaction([
      prisma.huntRequest.deleteMany({ where: { postId: id } }),
      prisma.mutantSighting.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } }),
    ]);

    res.status(200).json({
      message: "Mutant hunting request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete mutant hunting request",
      error,
    });
  }
};

export const acceptMutantHuntingRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseNumericId(req.params.id);
    const body = req.body as AcceptMutantHuntingRequestBody;

    if (!id) {
      res.status(400).json({ message: "id must be numeric" });
      return;
    }

    const hunterId = await getRequestHunterId(req, body);
    if (!hunterId) {
      res.status(400).json({ message: "hunterId is required" });
      return;
    }

    const hunter = await prisma.hunter.findUnique({ where: { id: hunterId } });
    if (!hunter) {
      res.status(404).json({ message: "Hunter not found" });
      return;
    }

    const activeTask = await prisma.huntRequest.findFirst({
      where: {
        hunterId,
        status: { in: ["ACCEPTED", "IN_PROGRESS"] },
        post: {
          status: { in: ["ACCEPTED", "IN_PROGRESS"] },
        },
      },
    });

    if (activeTask) {
      res.status(400).json({
        message: "Complete your current task before accepting another request.",
      });
      return;
    }

    const request = await prisma.post.findUnique({ where: { id } });
    if (!request) {
      res.status(404).json({ message: "Mutant hunting request not found" });
      return;
    }

    if (request.status === "ACCEPTED" || request.status === "COMPLETED") {
      res.status(400).json({
        message:
          "This mutant hunting request has already been accepted, is in progress, or is completed",
      });
      return;
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.post.updateMany({
        where: { id, status: { in: ["MATCHMAKING", "PUBLIC"] } },
        data: { status: "ACCEPTED" },
      });

      if (updated.count === 0) {
        return null;
      }

      const huntRequest = await tx.huntRequest.create({
        data: {
          postId: id,
          hunterId,
          status: "ACCEPTED",
        },
        include: {
          hunter: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatarUrl: true },
              },
            },
          },
          post: true,
        },
      });

      return huntRequest;
    });

    if (!result) {
      res.status(409).json({
        message: "Another hunter already accepted this mutant hunting request",
      });
      return;
    }

    res.status(200).json({
      message: "Mutant hunting request accepted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to accept mutant hunting request",
      error,
    });
  }
};

export const completeMutantHuntingRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseNumericId(req.params.id);
    const body = req.body as CompleteMutantHuntingRequestBody;

    if (!id) {
      res.status(400).json({ message: "id must be numeric" });
      return;
    }

    const hunterId = await getRequestHunterId(req, body);
    if (!hunterId) {
      res.status(400).json({ message: "hunterId is required" });
      return;
    }

    const request = await prisma.post.findUnique({
      where: { id },
      include: { huntRequests: true },
    });

    if (!request) {
      res.status(404).json({ message: "Mutant hunting request not found" });
      return;
    }

    if (request.status === "COMPLETED") {
      res.status(400).json({ message: "This mutant hunting request is already completed" });
      return;
    }

    if (request.status !== "ACCEPTED" && request.status !== "IN_PROGRESS") {
      res.status(400).json({
        message: "Only accepted or in-progress mutant hunting requests can be completed",
      });
      return;
    }

    const huntRequest = request.huntRequests.find(
      (item) => item.hunterId === hunterId
    );

    if (!huntRequest) {
      res.status(403).json({
        message: "You can only complete a mutant hunting request assigned to you",
      });
      return;
    }

    const result = await prisma.$transaction(async (tx: any) => {
      await tx.huntRequest.updateMany({
        where: { postId: id, hunterId },
        data: { status: "COMPLETED" },
      });

      const completedPost = await tx.post.update({
        where: { id },
        data: { status: "COMPLETED" },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          huntRequests: {
            include: {
              hunter: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                  },
                },
              },
            },
          },
        },
      });

      return completedPost;
    });

    await syncHunterRankScore(hunterId);

    res.status(200).json({
      message: "Mutant hunting request completed successfully",
      data: withRewardText(result),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete mutant hunting request",
      error,
    });
  }
};
