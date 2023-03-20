import { ERRORS } from "@constants/errors";
import { isId, prisma, Group } from "@ultralocal/database";
import { NextResponse } from "next/server";
import SuperJSON from "superjson";

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
    include: { subGroups: true, TagsOnGroups: true },
  });
  if (!group) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(group, { status: 200 });
}

export async function POST(request: Request) {
  const orgId = new URL(request.url).searchParams.get("orgId") ?? undefined;
  if (!orgId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.ORG_ID_ONLY;
    return NextResponse.json(error, { status });
  }
  const json = SuperJSON.parse<Omit<Group, "id">>(await request.text());
  if (!json.name) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.NAME_ONLY;
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
    data: { ...json, organizationId: orgId },
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
  const json = SuperJSON.parse<Omit<Group, "id" | "organizationId">>(
    await request.text()
  );
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
  await prisma.organization.delete({ where: { id: group.id } });
  return NextResponse.json(group, { status: 200 });
}
