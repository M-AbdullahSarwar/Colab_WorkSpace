import "server-only"; // first line of lib/workspace.ts

import { prisma } from "@colab/db";
import { verifyToken } from "@colab/shared/auth";
import type { CreateWorkspaceRequestBody, Role } from "@colab/shared/schema";

export type MEMBERS_AND_ROLE = {
    userId: string;
    role: Role;
};

export async function createWorkspace(
    input: CreateWorkspaceRequestBody,
    token: string,
) {
    const { userId } = await verifyToken(token);
    if (!userId) {
        throw new Error("Invalid token");
    }

    const workspace = await prisma.workspace.create({
        data: {
            name: input.name,
            ownerId: userId,
            members: {
                create: { userId: input.member.userId, role: "OWNER" },
            },
        },
    });

    return {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
    };
}

export async function addMembersToWorkspace(
    workspaceId: string,
    members: MEMBERS_AND_ROLE[],
    token: string,
) {
    const { userId } = await verifyToken(token);
    if (!userId) {
        throw new Error("Invalid token");
    }
    
    const exist = await prisma.membership.findFirst({
        where: {
            workspaceId,
            userId,
            role: {
                in: ["OWNER", "ADMIN"],
            },
        },
    });
    if (!exist) {
        throw new Error("Workspace not found or access denied");
    }
    const workspace_members = members.map((member) => ({
        userId: member.userId,
        workspaceId,
        role: member.role,
    }));

    await prisma.membership.createMany({
        data: workspace_members,
        skipDuplicates: true,
    });
}
