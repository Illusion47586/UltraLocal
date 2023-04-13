import { ERRORS } from "@constants/errors";
import { prisma } from "@ultralocal/database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? undefined;
  if (!name) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS.NAME_ONLY;
    return NextResponse.json(error, { status });
  }
  const doesOrganizationWithSameExistAlready =
    (await prisma.organization.count({
      where: { name },
    })) === 0;
  if (!doesOrganizationWithSameExistAlready) {
    const { error, status } = ERRORS.ORGANIZATION.FOUND;
    return NextResponse.json(error, { status });
  }
  return NextResponse.json("Not organization found with same name.", {
    status: 200,
  });
}
