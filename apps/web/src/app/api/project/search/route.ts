import { ERRORS } from "@constants/errors";
import { prisma } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const name = searchParams.get("name");
  // follows https://www.prisma.io/docs/concepts/components/prisma-client/pagination
  const skip = Number(searchParams.get("skip")) ?? undefined;
  const take = Number(searchParams.get("take")) ?? undefined;
  if (!orgId || !name) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
      name: { contains: name },
    },
    select: {
      id: true,
      name: true,
      isPublished: true,
      TagsOnProjects: true,
    },
    skip,
    take,
  });
  if (!projects) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(projects, { status: 200 });
}
