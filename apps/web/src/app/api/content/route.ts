import { ERRORS } from "@constants/errors";
import { isId, prisma, Group, Label, Content } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const labelId = searchParams.get("labelId") ?? undefined;
  const labelTitle = searchParams.get("labelTitle") ?? undefined;
  const id = searchParams.get("id") ?? undefined;
  const language = searchParams.get("title") ?? undefined;
  if (!orgId || (!labelId && !labelTitle) || !language) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const content = await prisma.content.findFirst({
    where: {
      OR: [
        { id },
        {
          AND: [
            { organizationId: orgId, language },
            { OR: [{ labelId: labelId }, { Label: { title: labelTitle } }] },
          ],
        },
      ],
    },
    include: {
      TagsOnContents: true,
    },
  });
  if (!content) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(content, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const labelId = searchParams.get("labelId") ?? undefined;
  const labelTitle = searchParams.get("labelTitle") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  if (!orgId || (!labelId && !labelTitle) || !language) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const json: Omit<
    Content,
    "id" | "organizationId" | "labelId" | "numberOfParams" | "language"
  > = await request.json();
  if (!json.literal) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.NAME_ONLY;
    return NextResponse.json(error, { status });
  }
  if (
    await prisma.content.findFirst({
      where: {
        AND: [
          { organizationId: orgId },
          { language },
          { OR: { labelId: labelId, Label: { title: labelTitle } } },
        ],
      },
    })
  ) {
    const { error, status } = ERRORS.PROJECT.FOUND;
    return NextResponse.json(error, { status });
  }
  const label = await prisma.label.findFirst({
    where: { OR: { id: labelId, title: labelTitle } },
  });
  const content = await prisma.content.create({
    data: {
      ...json,
      organizationId: orgId,
      numberOfParams: 0,
      language,
      labelId: label!.id,
    },
  });
  return NextResponse.json(content, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const labelId = searchParams.get("labelId") ?? undefined;
  const language = searchParams.get("language") ?? undefined;
  if (!orgId || !labelId || !language) {
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
