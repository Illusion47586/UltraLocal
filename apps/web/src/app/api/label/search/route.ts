import { ERRORS } from "@constants/errors";
import { prisma } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const title = searchParams.get("title");
  // follows https://www.prisma.io/docs/concepts/components/prisma-client/pagination
  const skip = Number(searchParams.get("skip")) ?? undefined;
  const take = Number(searchParams.get("take")) ?? undefined;
  if (!orgId || !title) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const labels = await prisma.label.findMany({
    where: {
      organizationId: orgId,
      title: { contains: title },
    },
    select: {
      id: true,
      title: true,
      groupId: true,
      TagsOnLabels: true,
      contents: true,
    },
    skip,
    take,
  });
  if (!labels) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(labels, { status: 200 });
}
