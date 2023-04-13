import { ERRORS } from "@constants/errors";
import { isId, prisma, Group } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const groupId = searchParams.get("id") ?? undefined;
  const groupName = searchParams.get("name") ?? undefined;
  if (!orgId || (!groupId && !groupName)) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const group = await prisma.group.findFirst({
    where: {
      AND: [
        { organizationId: orgId },
        {
          OR: [{ id: groupId }, { name: { equals: groupName } }],
        },
      ],
    },
    include: {
      subGroups: true,
      TagsOnGroups: true,
    },
  });
  if (!group) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(group, { status: 200 });
}

export async function POST(request: Request) {
  const orgId = new URL(request.url).searchParams.get("orgId") ?? undefined;
  const projectId =
    new URL(request.url).searchParams.get("projectId") ?? undefined;
  const parentGroupId =
    new URL(request.url).searchParams.get("parentGroupId") ?? undefined;
  if (!orgId || (!projectId && !parentGroupId)) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.ORG_ID_ONLY;
    return NextResponse.json(error, { status });
  }
  const json: Omit<
    Group,
    "id" | "organizationId" | "projectId" | "parentGroupId"
  > = await request.json();
  if (!json.name) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.NAME_AND_PROJECT;
    return NextResponse.json(error, { status });
  }
  if (
    await prisma.group.findFirst({
      where: {
        AND: [{ organizationId: orgId }, { name: json.name }],
      },
    })
  ) {
    const { error, status } = ERRORS.PROJECT.FOUND;
    return NextResponse.json(error, { status });
  }
  const group = await prisma.group.create({
    data: {
      ...json,
      organizationId: orgId,
      projectId: projectId,
      parentGroupId: parentGroupId,
    },
  });
  return NextResponse.json(group, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const groupId = searchParams.get("id") ?? undefined;
  if (!orgId || !groupId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const json: Omit<Group, "id" | "organizationId"> = await request.json();
  const group = await prisma.group.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: groupId }],
    },
  });
  if (!group) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  const updatedGroup = await prisma.group.update({
    where: { id: group.id },
    data: json,
  });
  return NextResponse.json(updatedGroup, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const groupId = searchParams.get("id") ?? undefined;
  if (!orgId || !groupId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const group = await prisma.group.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: groupId }],
    },
  });
  if (!group) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  await prisma.group.delete({ where: { id: groupId } });
  return NextResponse.json(group, { status: 200 });
}
