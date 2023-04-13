import { ERRORS } from "@constants/errors";
import { prisma, Group, Label, Timing } from "@ultralocal/database";
import { NextResponse } from "next/server";
import superjson from "superjson";

const findAllContentsFromLabels = async (labels: Label[], language: string) => {
  const object: Record<string, any> = {};

  for (let index = 0; index < labels.length; index++) {
    const { id, title } = labels[index];
    const label = await prisma.label.findFirst({
      where: { id, timing: Timing.COMPILETIME },
      include: { contents: true },
    });

    if (!label) continue;

    for (let _index = 0; _index < label.contents.length; _index++) {
      const { language: _language, literal } = label.contents[_index];
      if (language === _language) {
        object[title] = literal;
        break;
      }
    }
  }

  return object;
};

const findAllContentsFromGroups = async (
  group: Group & {
    labels: Label[];
    subGroups: Group[];
  },
  language: string
) => {
  if (!group.subGroups.length && group.labels.length) {
    const contents = await findAllContentsFromLabels(group.labels, language);
    return contents;
  }

  const object: Record<string, any> = {};
  for (let index = 0; index < group.subGroups.length; index++) {
    const subGroup = await prisma.group.findFirst({
      where: { id: group.subGroups[index].id, timing: Timing.COMPILETIME },
      include: { subGroups: true, labels: true },
    });

    if (subGroup) {
      const children = await findAllContentsFromGroups(subGroup, language);
      if (Object.keys(children).length) object[subGroup.name] = children;
    }
  }

  return object;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? undefined;
  const language = searchParams.get("language") ?? "en";
  if (!id) {
    const { error, status } = ERRORS.ORGANIZATION.INVALID_PARAMS;
    return NextResponse.json(error, { status });
  }
  const projects = await prisma.project.findMany({
    where: { organizationId: id, isPublished: true },
  });

  if (!projects) {
    const { error, status } = ERRORS.ORGANIZATION.NOT_FOUND;
    return NextResponse.json(error, { status });
  }

  const object: Record<string, any> = {};

  for (let index = 0; index < projects.length; index++) {
    const project = projects[index];
    const _object: Record<string, any> = {};
    const groups = await prisma.group.findMany({
      where: {
        organizationId: id,
        projectId: project.id,
        timing: Timing.COMPILETIME,
      },
      include: { subGroups: true, labels: true },
    });

    for (let _index = 0; _index < groups.length; _index++) {
      const group = groups[_index];
      const groupContents = await findAllContentsFromGroups(group, language);
      if (Object.keys(groupContents).length)
        _object[group.name] = groupContents;
    }

    if (Object.keys(_object).length) object[project.name] = _object;
  }

  return NextResponse.json(superjson.serialize(object).json, {
    status: 200,
  });
}
