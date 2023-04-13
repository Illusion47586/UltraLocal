import { prisma, Timing } from "./index";
import { prismaLogger } from "@ultralocal/utils";

export const main = async () => {
  // CREATE ORGANIZATION
  const organization = await prisma.organization.create({
    data: { name: "random org", userId: "blah blah" },
  });

  // CREATE PROJECT
  const project1 = await prisma.project.create({
    data: { name: "PROJECT 1", organizationId: organization.id },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "PROJECT 2",
      organizationId: organization.id,
      isPublished: true,
    },
  });

  // CREATE GROUPS
  const group1 = await prisma.group.create({
    data: {
      name: "GROUP 1",
      projectId: project1.id,
      organizationId: organization.id,
    },
  });

  const group2 = await prisma.group.create({
    data: {
      name: "GROUP 2",
      projectId: project2.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const group3 = await prisma.group.create({
    data: {
      name: "GROUP 3",
      projectId: project2.id,
      organizationId: organization.id,
    },
  });

  // CREATE SUBGROUPS
  const group4 = await prisma.group.create({
    data: {
      name: "GROUP 4",
      parentGroupId: group3.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const group5 = await prisma.group.create({
    data: {
      name: "GROUP 5",
      parentGroupId: group3.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  // CREATE LABELS
  const label1 = await prisma.label.create({
    data: {
      title: "LABEL 1",
      groupId: group4.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const label2 = await prisma.label.create({
    data: {
      title: "LABEL 2",
      groupId: group4.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const label3 = await prisma.label.create({
    data: {
      title: "LABEL 3",
      groupId: group5.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const label4 = await prisma.label.create({
    data: {
      title: "LABEL 4",
      groupId: group5.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  // CREATE CONTENTS
  const content1 = await prisma.content.create({
    data: {
      language: "en",
      literal: "sup paji ok haha",
      labelId: label1.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const content2 = await prisma.content.create({
    data: {
      language: "es",
      literal: "sup paji ok haha",
      labelId: label1.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const content3 = await prisma.content.create({
    data: {
      language: "en",
      literal: "sup paji ok haha",
      labelId: label2.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const content4 = await prisma.content.create({
    data: {
      language: "hi",
      literal: "sup paji ok haha",
      labelId: label3.id,
      organizationId: organization.id,
      timing: Timing.RUNTIME,
    },
  });

  const content5 = await prisma.content.create({
    data: {
      language: "en",
      literal: "sup paji ok haha",
      labelId: label3.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const content6 = await prisma.content.create({
    data: {
      language: "es",
      literal: "sup paji ok haha",
      labelId: label3.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  const content7 = await prisma.content.create({
    data: {
      language: "hi",
      literal: "sup paji ok haha",
      labelId: label4.id,
      organizationId: organization.id,
      timing: Timing.COMPILETIME,
    },
  });

  // LOG
  prismaLogger.info(organization.id);
};
