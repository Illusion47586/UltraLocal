import { ERRORS } from "@constants/errors";
import { isId, prisma, Project } from "@ultralocal/database";
import { NextResponse } from "next/server";
import SuperJSON from "superjson";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const projectId = searchParams.get("id") ?? undefined;
  const projectName = searchParams.get("name") ?? undefined;
  if (!orgId || (!projectId && !projectName)) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const project = await prisma.project.findFirst({
    where: {
      AND: [
        { organizationId: orgId },
        {
          OR: [{ id: projectId }, { name: { equals: projectName } }],
        },
      ],
    },
    include: { groups: true, TagsOnProjects: true },
  });
  if (!project) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(project, { status: 200 });
}

export async function POST(request: Request) {
  const orgId = new URL(request.url).searchParams.get("orgId");
  if (!orgId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.ORG_ID_ONLY;
    return NextResponse.json(error, { status });
  }
  const json = SuperJSON.parse<Omit<Project, "id" | "organizationId">>(
    await request.text()
  );
  if (!json.name) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS.NAME_ONLY;
    return NextResponse.json(error, { status });
  }
  if (
    await prisma.project.findFirst({
      where: {
        AND: [{ organizationId: orgId }, { name: json.name }],
      },
    })
  ) {
    const { error, status } = ERRORS.PROJECT.FOUND;
    return NextResponse.json(error, { status });
  }
  const project = await prisma.project.create({
    data: { ...json, organizationId: orgId },
  });
  return NextResponse.json(project, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const projectId = searchParams.get("id") ?? undefined;
  if (!orgId || !projectId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const json = SuperJSON.parse<Omit<Project, "id" | "organizationId">>(
    await request.text()
  );
  const project = await prisma.project.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: projectId }],
    },
  });
  if (!project) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: json,
  });
  return NextResponse.json(updatedProject, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? undefined;
  const projectId = searchParams.get("id") ?? undefined;
  if (!orgId || !projectId) {
    const { error, status } = ERRORS.PROJECT.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const project = await prisma.project.findFirst({
    where: {
      AND: [{ organizationId: orgId }, { id: projectId }],
    },
  });
  if (!project) {
    const { error, status } = ERRORS.PROJECT.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  await prisma.organization.delete({ where: { id: project.id } });
  return NextResponse.json(project, { status: 200 });
}
