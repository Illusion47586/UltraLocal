import { ERRORS } from "@constants/errors";
import { isId, prisma, Group, Label } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const groupId = searchParams.get("groupId") ?? undefined;
  const groupName = searchParams.get("groupName") ?? undefined;
  const labelId = searchParams.get("id") ?? undefined;
  const labelTitle = searchParams.get("title") ?? undefined;
  if (!orgId || (!groupId && !groupName) || (!labelId && !labelTitle)) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const label = await prisma.label.findFirst({
    where: {
      AND: [
        { organizationId: orgId },
        { OR: [{ groupId: groupId }, { Group: { name: groupName } }] },
        {
          OR: [{ id: labelId }, { title: labelTitle }],
        },
      ],
    },
    include: {
      contents: true,
      TagsOnLabels: true,
    },
  });
  if (!label) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(label, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const groupId = searchParams.get("groupId") ?? undefined;
  const groupName = searchParams.get("groupName") ?? undefined;
  if (!orgId || (!groupId && !groupName)) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const json: Omit<
    Label,
    "id" | "organizationId" | "groupId" | "createdAt" | "updatedAt"
  > = await request.json();
  if (!json.title) {
    console.log(json, !!json.title);
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.NAME_ONLY;
    return NextResponse.json(error, { status });
  }
  if (
    await prisma.label.findFirst({
      where: {
        AND: [
          { organizationId: orgId },
          { title: json.title },
          { OR: { groupId: groupId, Group: { name: groupName } } },
        ],
      },
    })
  ) {
    const { error, status } = ERRORS.PROJECT.FOUND;
    return NextResponse.json(error, { status });
  }
  const group = await prisma.group.findFirst({
    where: { OR: { id: groupId, name: groupName } },
  });
  const label = await prisma.label.create({
    data: {
      ...json,
      organizationId: orgId,
      // group should exist because without that we can't make the label
      groupId: group!.id,
    },
  });
  return NextResponse.json(label, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const labelId = searchParams.get("id") ?? undefined;
  if (!orgId || !labelId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const json: Omit<Group, "id" | "organizationId"> = await request.json();
  const label = await prisma.label.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: labelId }],
    },
  });
  if (!label) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  const updatedGroup = await prisma.label.update({
    where: { id: label.id },
    data: json,
  });
  return NextResponse.json(updatedGroup, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const labelId = searchParams.get("id") ?? undefined;
  if (!orgId || !labelId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const label = await prisma.label.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: labelId }],
    },
  });
  if (!label) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  await prisma.label.delete({ where: { id: labelId } });
  return NextResponse.json(label, { status: 200 });
}
