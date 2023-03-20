import { ERRORS } from "@constants/errors";
import { prisma, Organization } from "@ultralocal/database";
import { NextResponse } from "next/server";
import SuperJSON from "superjson";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? undefined;
  const name = searchParams.get("name") ?? undefined;
  if (!id && !name) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const organization = await prisma.organization.findFirst({
    where: { OR: [{ id }, { name }] },
    include: {
      projects: true,
    },
  });
  if (!organization) {
    const { error, status } = ERRORS.ORGANIZATION.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json(organization, { status: 200 });
}

export async function POST(request: Request) {
  const json = SuperJSON.parse<Omit<Organization, "id">>(await request.text());
  if (!json.name) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS.NAME_ONLY;
    return NextResponse.json(error, { status });
  }
  if (
    await prisma.organization.findFirst({
      where: { name: json.name },
    })
  ) {
    const { error, status } = ERRORS.ORGANIZATION.FOUND;
    return NextResponse.json(error, { status });
  }
  const organization = await prisma.organization.create({ data: json });
  return NextResponse.json(organization, { status: 200 });
}

export async function PATCH(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS.ID_ONLY;
    return NextResponse.json(error, { status });
  }
  const json = SuperJSON.parse<Omit<Organization, "id">>(await request.text());
  if (
    !(await prisma.organization.findFirst({
      where: { id },
    }))
  ) {
    const { error, status } = ERRORS.ORGANIZATION.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  const organization = await prisma.organization.update({
    where: { id },
    data: json,
  });
  return NextResponse.json(organization, { status: 200 });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS.ID_ONLY;
    return NextResponse.json(error, { status });
  }
  const organization = await prisma.organization.findFirst({
    where: { id },
  });
  if (!organization) {
    const { error, status } = ERRORS.ORGANIZATION.NOT_FOUND;
    return NextResponse.json(error, { status });
  }
  await prisma.organization.delete({ where: { id } });
  return NextResponse.json(organization, { status: 200 });
}
